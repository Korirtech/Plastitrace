# Plastitrace Identity and Material Verification Architecture

## Executive summary

Plastitrace should use a **hybrid architecture**. PostgreSQL is the operational source of truth for field capture, evidence, verification, custody, impact calculations, pricing, and payouts. A smart contract provides a compact public attestation layer for material identity, verification results, evidence hashes, and custody transitions. The system should never put personally identifiable information, raw photographs, buyer pricing, or payout details on-chain.

This boundary keeps field workflows fast and private while making the most important claims independently verifiable. The architecture is designed for Kenya first and can support additional African recovery networks by treating organizations, hubs, collectors, and methodologies as configurable data rather than hard-coded geography.

> **Core rule:** the database stores the story; the chain stores the proof that the story was anchored and not silently rewritten.

## System boundaries

| Layer | Responsibility | Data retained | Availability expectation |
| --- | --- | --- | --- |
| Field client | Capture intake, evidence, location, and collector context | Draft events, queued uploads, local retry state | Works with intermittent connectivity |
| Application API | Validate commands, enforce tenant permissions, transition lot state, calculate value and impact | Operational records and workflow state | Online system of record |
| Object storage | Store photos, tickets, signatures, and exported documents | Encrypted evidence binaries | Durable, private, hash-addressed |
| PostgreSQL | Join identities to events, evidence, verification, custody, impact, and value | Full operational history and audit trail | Transactional source of truth |
| Anchor worker | Hash canonical payloads, submit transactions, retry safely, reconcile confirmations | Queue status and transaction references | Eventual consistency with chain |
| Smart contract | Register lot IDs, anchor evidence, attest verification, record custody state, void bad records | Minimal hashes, quantities, role addresses, state | Public verification layer |
| Analytics / ledger | Aggregate verified quantities, CO₂e, value, and payouts | Derived views and reporting tables | Rebuildable from source events |

## Digital identity model

A lot receives its identity when an intake is accepted by the API. The identity is represented by a UUID in PostgreSQL and a human-readable number such as `PT-24087`. The contract adapter derives a deterministic `bytes32` identifier from the organization namespace and lot UUID.

```text
lotId = keccak256("plastitrace:v1" || organizationId || lotUid)
```

The canonical payload that is hashed and optionally anchored contains only normalized, non-sensitive fields:

```json
{
  "schema": "plastitrace.lot.v1",
  "lotId": "PT-24087",
  "organizationId": "kenya-network",
  "material": "HDPE",
  "quantityGrams": 320000,
  "capturedAt": "2026-09-07T13:55:00Z",
  "sourceHubCode": "NBO-EA",
  "evidenceHashes": ["sha256:..."],
  "methodologyVersion": "impact-ke-2026-01"
}
```

Raw evidence remains in private object storage. The database stores its SHA-256 digest and object path. The chain stores the digest or a Merkle root of the evidence set. A verifier can later prove that a downloaded file matches the file used during attestation without exposing the file publicly.

## Database design

The schema in [`database-schema.sql`](./database-schema.sql) is organized around six concepts.

| Concept | Tables | Design decision |
| --- | --- | --- |
| Tenant and permissions | `organizations`, `profiles`, `organization_members` | Every operational record is scoped to an organization. Roles are application permissions, not contract identities. |
| Places and actors | `recovery_hubs`, `collectors` | Collectors and hubs are first-class entities because route performance and custody depend on them. |
| Identity and event history | `recovery_lots`, `lot_events` | `recovery_lots` is the current projection; `lot_events` is the append-only history used to rebuild state. |
| Evidence and verification | `evidence_assets`, `verification_checks` | Evidence is hash-addressed. Verification records preserve observed quantity and contamination separately from the original intake. |
| Custody and value | `custody_transfers`, `value_quotes`, `payouts` | Physical movement, buyer value, and payout status are separate because they have different actors and failure modes. |
| Impact and public proof | `impact_calculations`, `blockchain_anchors`, `audit_log` | Impact is methodology-versioned. Blockchain anchoring is asynchronous and auditable. |

### State transition rules

The application API must validate state transitions in a transaction. A direct update of `recovery_lots.state` should not be exposed to clients.

| Current state | Command | Result | Required evidence |
| --- | --- | --- | --- |
| `draft` | Submit intake | `in_review` | Collector identity and intake payload |
| `in_review` | Approve verification | `verified` | Verifier result, observed weight, and evidence hash |
| `in_review` | Reject verification | `rejected` | Verifier reason and evidence |
| `verified` | Dispatch lot | `in_transit` | Dispatch note and receiving party |
| `in_transit` | Confirm receipt | `received` | Receiver confirmation and handoff evidence |
| `received` | Record processor output | `processed` | Output metadata and processor record |
| Any non-terminal state | Void | `voided` | Authorized reason and audit event |

The database should use an append-only event record for every command. The current lot state is a projection that can be reconciled against events. This gives operators a fast dashboard while preserving an investigation trail.

## Smart-contract architecture

The contract in [`contracts/PlastiTraceRegistry.sol`](./contracts/PlastiTraceRegistry.sol) is a registry and attestation layer. It is not a token contract, payment rail, or marketplace. That boundary avoids forcing commercial terms and personal data into a public ledger before the operational model is mature.

### Contract responsibilities

| Function | Caller | On-chain effect |
| --- | --- | --- |
| `registerLot` | Operator role | Creates the public lot identity, quantity, material code, metadata hash, and initial custodian. |
| `anchorEvidence` | Operator role | Records that an evidence digest was attached to the lot. |
| `submitVerification` | Verifier role | Records a pass/fail attestation with observed quantity and verification hash. |
| `transferCustody` | Operator role | Changes the public custodian and moves the lot to `InTransit`. |
| `markReceived` | Operator role | Records receipt at the next custody point. |
| `markProcessed` | Operator role | Closes the material loop with a processor output hash. |
| `voidLot` | Admin role | Makes a bad or fraudulent record visibly invalid without deleting history. |

### Role model

The application organization and the contract role are related but not identical. A network operator should use a service wallet or relayer for routine writes. Verifiers should use delegated signer addresses or a managed wallet policy. Administrative actions should require a multisig in production.

| Contract role | Intended authority | Recommended operational control |
| --- | --- | --- |
| `ADMIN_ROLE` | Grant/revoke roles, void lots | Multisig plus change-management record |
| `OPERATOR_ROLE` | Register lots, anchor evidence, move custody | Restricted relayer with per-organization quotas |
| `VERIFIER_ROLE` | Submit verification attestations | Verifier wallet registry and periodic review |

The contract skeleton uses role checks to make the authority boundary explicit. It should be replaced with audited OpenZeppelin access-control primitives before deployment to a production network.[1]

## Asynchronous anchoring flow

```text
Collector device
    │
    │ 1. intake + evidence
    ▼
Application API ── transaction ──► PostgreSQL + object storage
    │                                  │
    │ 2. outbox row                     │ 3. verify / calculate impact
    ▼                                  ▼
Anchor worker ── retry ──► Contract registry ◄── verifier signer
    │                                  │
    └──── reconcile tx receipt ◄───────┘
```

The anchor worker should use an outbox pattern. The API commits the lot event and a `blockchain_anchors` row in one database transaction. A worker claims queued rows, computes the canonical payload hash, submits the contract call, and stores the transaction hash. Reconciliation confirms the transaction after the configured number of block confirmations. Retries must use an idempotency key and must never create a second lot identity.

## Trust and privacy controls

The system should treat the chain as public, permanent, and adversarially readable. Only the following fields should be anchored: lot identifier, organization namespace, material code, normalized quantity, event timestamps, evidence hashes, verification hash, and custody state. Names, phone numbers, exact household locations, signatures, photographs, pricing, payouts, and access tokens remain off-chain.

The application must use row-level security for tenant isolation. A collector may create an intake for an assigned organization but must not edit a verifier result. A verifier may create a verification check but must not replace source evidence. A buyer may read verified lot summaries and accepted custody records but must not see private collector information.

Void is preferable to delete. A voided record remains visible with a reason hash and audit event. This protects the credibility of impact reporting and prevents a quiet correction from changing historical totals.

## Recommended delivery phases

### Phase 1 — operational identity

Implement the SQL schema, authentication, RLS policies, lot creation API, evidence uploads, and a verifier queue. The dashboard should read from PostgreSQL rather than seeded browser data.

### Phase 2 — public proof

Deploy the registry to a test network. Build the outbox worker, role-management console, confirmation reconciliation, and public lot verification page. Do not enable financial settlement on-chain yet.

### Phase 3 — value and impact

Version the impact methodology, link verified lots to value quotes, record payouts, and expose buyer-facing certificates. Add the minimum reporting needed for processors and impact partners.

### Phase 4 — production hardening

Complete a smart-contract audit, multisig administration, key rotation, incident response, rate limiting, evidence retention policy, and disaster recovery exercise. Establish a chain migration plan before committing to a production network.

## References

[1]: https://docs.openzeppelin.com/contracts/5.x/access-control "OpenZeppelin Contracts Access Control"
[2]: https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/ "Ethereum Proof-of-Stake consensus mechanism"
