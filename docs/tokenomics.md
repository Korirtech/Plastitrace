# Plastitrace Tokenomics and Financial Settlement Model

## Executive recommendation

Plastitrace should not begin with a freely tradable speculative token. The safer design is a **three-layer value system**:

1. **Material settlement** pays collectors, hubs, and partners for verified physical material in Kenyan shillings through existing rails.
2. **Impact units** represent quantified, serialized environmental outcomes and remain locked until the underlying lot passes the required verification and no-double-counting checks.
3. **TRACE utility** is a future coordination instrument, not a phase-one investment product. It should only be considered after the operational registry, buyer demand, payout history, and compliance position are proven.

The material itself, its environmental attributes, and any future protocol utility must remain separate ledgers. A kilogram can create material revenue. It can create a collection or recycling outcome. It can contribute to a carbon methodology. These are related claims, but they are not the same asset and must not be sold or claimed as if they were interchangeable.

> **Design principle:** pay for verified work first; tokenize environmental attributes only when the measurement and ownership chain can withstand independent scrutiny.

## Value stack

| Layer | Instrument | Unit definition | Transferability | Primary buyer or user | Phase |
| --- | --- | --- | --- | --- | --- |
| Physical value | Material settlement | Kenyan shilling amount for accepted material | Fiat settlement only | Processor, aggregator, buyer | 1 |
| Operational proof | Verified Material Unit (VMU) | 1 verified kilogram associated with one lot and custody history | Non-transferable internal record; may be represented by a permissioned token later | Network operator and processor | 1 |
| Plastic impact | Plastic Recovery Credit (PRC-C / PRC-R) | 1 metric tonne of additional plastic collected or recycled, respectively | Permissioned, serialized, and retired for a claim | Brand, producer, EPR or impact buyer | 2 |
| Climate impact | Carbon Impact Unit (CIU) | 1 metric tonne CO₂e only where an approved methodology and independent verification support the claim | Permissioned until issued; retirement required for claims | Climate buyer or impact partner | 3 |
| Protocol coordination | TRACE utility | Future access, fee, staking, or governance utility | Not launched in the MVP | Network participants | 4 or later |

The PRC-C and PRC-R distinction is deliberate. Collection and recycling are different activities with different baselines, evidence, and impact claims. A single lot may support a collection credit, a recycling credit, or both only where the applicable standard permits it and the registry records the allocation boundary. The architecture should not call either unit a carbon credit unless a qualified methodology and registry support that classification.

## Measurement and issuance formulas

All measurement factors must be versioned. A factor must never be silently changed after a lot has been verified.

### Verified material quantity

```text
verified_kg = min(quantity observed by verifier, quantity accepted at custody handoff)
```

The lower accepted quantity protects the system from paying or issuing credits on material that was recorded but never received.

### Eligible collection and recycling quantity

```text
eligible_collection_kg = max(0, verified_collected_kg - baseline_collection_kg)
eligible_recycling_kg = max(0, verified_recycled_kg - baseline_recycling_kg)
```

Baseline quantities and additionality rules must come from the selected methodology. Plastitrace should store the methodology version, baseline evidence, uncertainty deduction, and verifier decision for every issued series.

### Plastic impact units

```text
PRC-C units = floor(eligible_collection_kg / 1,000)
PRC-R units = floor(eligible_recycling_kg / 1,000)
```

Fractional quantities remain in the operational ledger as pending volume. The issuance policy can later support fractional units if a selected registry or buyer requires them. Whole-tonne issuance is easier to communicate and reduces low-value serial fragmentation in the first release.

### Carbon impact units

```text
co2e_avoided_kg =
  eligible_recycled_kg
  × methodology_emission_factor
  − leakage_kg
  − uncertainty_buffer_kg

CIU units = floor(co2e_avoided_kg / 1,000)
```

The emission factor is not a generic Plastitrace estimate. It must be chosen from the applicable methodology, documented with its boundary conditions, and approved by an independent verifier. A Plastitrace impact metric in the dashboard is not automatically a marketable carbon credit.

## Material settlement model

The initial settlement rail should be off-chain. The buyer pays the settlement account in KES. Plastitrace releases the payout only after the lot reaches `verified` or the buyer accepts a documented commercial exception. Mobile money and bank payouts should reference the lot settlement ID, but payment credentials should never be stored on-chain.

### Settlement ledger

A settlement is a double-entry record with immutable references to the lot and the parties. The minimum entries are:

| Entry | Debit | Credit | Purpose |
| --- | --- | --- | --- |
| Buyer receivable | Buyer account | Settlement clearing | Records amount due for accepted material |
| Source payout | Settlement clearing | Collector or collector group | Pays the originator of the material |
| Hub service fee | Settlement clearing | Hub account | Pays sorting, storage, or handling service |
| Verification fee | Settlement clearing | Verifier account | Pays the independent verification action |
| Impact reserve | Settlement clearing | Reserve account | Funds remeasurement, disputes, and community safeguards |
| Platform fee | Settlement clearing | Plastitrace revenue | Funds software, support, and compliance |

The exact percentages should be configured in a versioned `settlement_rules` table, not hard-coded in the contract. A proposed starting rule for pilot testing is an **illustrative policy**, not a market fact:

| Allocation | Illustrative share of accepted material proceeds | Purpose |
| --- | ---: | --- |
| Source collector network | 65% | Direct reward for collection and first-mile work |
| Recovery hub | 10% | Sorting, aggregation, storage, and handling |
| Verification and data quality | 8% | Evidence review and quality assurance |
| Impact reserve | 7% | Disputes, reversals, community safeguards, and methodology costs |
| Plastitrace platform | 5% | Software, support, and operating costs |
| Network treasury | 5% | Training, equipment, and network development |

These percentages should be tested against real buyer prices, collector economics, taxes, payment costs, and household income goals before adoption. They are deliberately adjustable and should never be presented as guaranteed earnings.

### Illustrative settlement

The following example is a design illustration only. It is not a price forecast.

| Input | Example |
| --- | ---: |
| Accepted HDPE weight | 1,000 kg |
| Buyer price | KES 80/kg |
| Gross material proceeds | KES 80,000 |
| Source collector network at 65% | KES 52,000 |
| Recovery hub at 10% | KES 8,000 |
| Verification and data quality at 8% | KES 6,400 |
| Impact reserve at 7% | KES 5,600 |
| Plastitrace at 5% | KES 4,000 |
| Network treasury at 5% | KES 4,000 |

Credit revenue is not included in the material waterfall until a credit is issued and sold. When a PRC or CIU is sold, its net proceeds should use a separate impact waterfall so the physical material payout is not reduced by uncertain future credit revenue.

## Impact-credit lifecycle

Impact attributes should move through explicit states. A database row and an on-chain record must use the same lifecycle vocabulary.

| State | Meaning | Can be sold? | Can support a public claim? |
| --- | --- | --- | --- |
| `measured` | Calculated from verified operational data | No | No |
| `reserved` | Reserved for a buyer or reporting period | No | No |
| `issued` | Serialized after methodology and verification gates pass | Yes, subject to buyer and registry rules | Not until retired |
| `transferred` | Moved to an approved account | Yes, if transfer rules allow | Not until retired |
| `retired` | Permanently consumed for one named claim | No | Yes, within the claim scope |
| `reversed` | Invalidated because evidence, custody, or methodology failed | No | No |
| `cancelled` | Administrative cancellation before sale | No | No |

The system must record the owner, beneficiary, methodology, serial range, underlying lot allocation, evidence root, issue date, transfer history, and retirement statement. Retirement is the only state that should unlock a customer-facing impact claim.

## No-double-counting controls

Double counting can happen through double issuance, double claiming, or double use. Plastitrace should implement all three controls at the application, registry, and contract layers.

| Risk | Control |
| --- | --- |
| Same kilogram issued twice | A lot can allocate each accepted gram only once per attribute type. The allocation ledger uses a unique `(lot_id, attribute_type, allocated_grams)` relationship. |
| Collection and recycling both claimed as the same outcome | Separate PRC-C and PRC-R series, separate methodologies, and an explicit mass-balance allocation. |
| Carbon and plastic claims overlap | A CIU references the exact recycled output allocation. The same output cannot back another CIU or a second unretired claim. |
| Two buyers claim one credit | Serialized credit IDs, permissioned transfer, and retirement required for a claim. |
| Material sold and later re-sold as if still available | Custody and settlement statuses are linked. A processed or retired allocation cannot return to `available`. |
| Verification is later overturned | Issue a `reversed` record and compensating audit event. Never delete the original series. |
| Buyer claims an internal dashboard metric as a certified credit | UI labels distinguish `impact measured`, `credit issued`, and `credit retired`. |

## Recommended contract architecture

The existing `PlastiTraceRegistry` contract should remain the identity and custody registry. Tokenization should be a separate contract or module so a bug in a credit-transfer path cannot rewrite physical lot history.

| Contract | Purpose | Suggested primitive |
| --- | --- | --- |
| `PlastiTraceRegistry` | Lot identity, evidence anchors, verification, custody | Custom registry with role controls |
| `ImpactCreditRegistry` | Serialized PRC-C, PRC-R, and CIU issuance and retirement | Permissioned ERC-1155-style series or a dedicated registry |
| `SettlementReceiptRegistry` | Hashes of approved settlement statements and payout references | Minimal attestation registry; no fiat custody |
| Optional `SettlementVault` | Future stablecoin escrow for approved counterparties | Separate, audited contract; not part of the MVP |

A `CreditSeries` should include `seriesId`, `attributeType`, `methodologyVersion`, `projectId`, `vintage`, `unitScale`, `underlyingAllocationRoot`, `issuer`, and `status`. The contract should expose `issue`, `transfer`, `retire`, `reverse`, and `getSeries` operations with role checks and serial-event logs. It should reject issuance when the allocation root has already been consumed.

The contract should not accept KES payments. The first settlement version should integrate with a regulated payment provider or bank/mobile-money process through an off-chain payment service. A future stablecoin vault is optional and should be introduced only after the fiat settlement workflow, counterparty checks, refund rules, and dispute process are working.

## Governance and risk controls

Plastitrace should treat tokenomics as a controlled accounting system rather than a marketing mechanism. The network operator should approve methodology versions, allocation rules, eligible buyers, and role assignments through documented governance. Verifiers should be independent from the collector payout approval path. The platform should publish a credit-quality page that explains what each unit means, what it does not mean, and whether it has been issued or retired.

A future TRACE utility token should not be launched until there is a demonstrated reason to use it instead of KES, ordinary permissions, or existing settlement rails. If launched, it should not promise returns, collateral value, or an entitlement to platform revenue. It should be subject to a separate legal, tax, securities, payments, and consumer-protection review for every launch jurisdiction.

## Implementation sequence

1. Add `settlement_rules`, `settlements`, `settlement_entries`, `impact_allocations`, `credit_series`, `credit_events`, and `retirements` to the operational schema.
2. Build the payout calculator as a deterministic service that stores inputs, rule version, and result snapshot.
3. Add a verifier approval gate before any credit series is issued.
4. Add an outbox worker for credit issuance and reconciliation.
5. Launch PRC-C and PRC-R in a permissioned pilot with no secondary market.
6. Add buyer retirement statements and public verification pages.
7. Evaluate CIU eligibility only after the methodology, monitoring, reporting, and independent verification process is mature.
8. Revisit TRACE only after the protocol has recurring usage that requires a coordination asset.

## References

[1]: https://icvcm.org/core-carbon-principles/ "The Core Carbon Principles — Integrity Council for the Voluntary Carbon Market"
[2]: https://verra.org/programs/plastic-waste-reduction-standard/plastic-program-details/ "Plastic Program Details — Verra"
