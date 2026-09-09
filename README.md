# Plastitrace

> Digital infrastructure for turning plastic waste into a traceable, measurable, and financially valuable resource.

Plastitrace is a Kenya-first recovery intelligence platform. It gives every material lot a digital identity, connects recovery hubs into a network, and makes the value and impact of recovered plastic visible from source to verified bale.

## Product direction

`Waste → Digital Identity → Verified Material → Measurable Impact → Financial Value → Recycled Product`

The first vertical slice in this repository is an operations dashboard for the Kenya recovery network. It is designed around the day-to-day questions a network lead needs to answer:

- How much material moved through the network and where?
- Which lots are verified, in review, or pending?
- What recovery value and avoided emissions are being created?
- What happened most recently in the chain of custody?
- How can a field operator quickly record the next intake?

## Included in this MVP

- Responsive Plastitrace operations dashboard with persistent workspace navigation.
- Network metrics for recovered material, verified lots, recovery value, and CO₂e avoided.
- Recovery throughput chart with 30-day, 90-day, and 12-month views.
- Illustrated Kenya recovery network pulse across Nairobi, Mombasa, Kisumu, and Rift Valley.
- Searchable and filterable material-lot table with traceability statuses.
- Intake modal that creates a new lot, updates dashboard metrics, and queues the lot for verification.
- Activity timeline, next-best-action prompt, responsive mobile navigation, and lightweight toast feedback.

## Run locally

This first slice intentionally has no build dependency or backend requirement. Run it with Python's built-in static server:

```bash
npm run dev
```

Then open [http://localhost:4173](http://localhost:4173).

To run the syntax check:

```bash
npm run check
```

## Repository structure

```text
.
├── index.html     # Dashboard and intake workflow markup
├── styles.css     # Product design system and responsive styling
├── app.js         # Interactions, lot data, filtering, and intake state
├── package.json   # Local development and validation scripts
└── README.md
```

## Next product milestones

1. **Field capture:** authenticated collector accounts, offline-first intake capture, GPS/time metadata, and photo evidence.
2. **Verification:** verifier queue, weighing and contamination checks, evidence attachments, and immutable lot history.
3. **Value exchange:** buyer offers, payout records, material pricing, and a transparent impact ledger.
4. **Network expansion:** hub onboarding, route planning, partner permissions, and support for additional African recovery networks.
5. **Recycled product:** bale dispatch, processor intake, recycled-content certificates, and downstream product traceability.

## Design principles

- **Traceability before dashboards:** metrics should always link back to a material event.
- **Field-friendly by default:** every workflow should be usable on a phone and under imperfect connectivity.
- **Value follows proof:** verification, evidence, and clean custody records unlock financial value.
- **Kenya first, Africa ready:** start with the local recovery reality while keeping the model extensible.

## Architecture foundations

The first architecture slice now lives in [`docs/architecture.md`](docs/architecture.md). It defines the hybrid boundary between the operational database and the public proof layer, including the lot identity model, lifecycle transitions, privacy rules, anchoring outbox, role model, and phased delivery plan.

The PostgreSQL design is in [`docs/database-schema.sql`](docs/database-schema.sql). It covers tenant isolation, hubs, collectors, lots, append-only events, evidence hashes, verification checks, custody transfers, impact calculations, value quotes, payouts, blockchain anchors, and audit history.

The Solidity registry skeleton is in [`docs/contracts/PlastiTraceRegistry.sol`](docs/contracts/PlastiTraceRegistry.sol). It registers material identities, anchors evidence, records verifier attestations, tracks custody transitions, and supports visible voiding without deleting history. It is an architecture reference and must be independently audited before production deployment.

The tokenomics and settlement model is documented in [`docs/tokenomics.md`](docs/tokenomics.md). It separates KES material settlement from serialized plastic-impact and carbon-impact attributes, defines illustrative allocation rules, explains no-double-counting controls, and explicitly defers a speculative TRACE token until the operational model is mature.

## Simulation and presentation

A deterministic Nairobi hub settlement simulation lives in [`docs/settlement-simulation.md`](docs/settlement-simulation.md) (report) and [`docs/settlement-simulation.json`](docs/settlement-simulation.json) (data). It models a 1,000 kg HDPE intake through the versioned allocation waterfall, resulting in a KES 52,000 collector payout and locked impact attributes.

The tokenomics pitch deck is archived at [`docs/presentations/tokenomics-pitch-deck.pdf`](docs/presentations/tokenomics-pitch-deck.pdf). It presents the three-ledger model, transaction lifecycle, integrity controls, and phased delivery roadmap.

## Render deployment

The repository includes [`render.yaml`](render.yaml), a Render Blueprint for the current dependency-free static site. In Render, choose **New → Blueprint**, connect the Plastitrace repository, and select the `main` branch. Render will run `npm run check` and publish the repository root as a static site.

## Operations pages

The dashboard now includes working client-side views for **Material lots**, **Recovery network**, and **Impact ledger**. These pages reuse the current app data and visual system, with lot search and status filters, hub performance and capacity signals, and methodology-aware impact states.

## On-chain verification integration

The Material Lots register now includes a browser-side `PlastiTraceRegistry` reader using ethers v6 and the EIP-1193 wallet provider or a configured JSON-RPC endpoint. It reads `getLot(bytes32)` for each visible lot, maps the Solidity `LotState` to the register, reconciles on-chain quantity, displays the latest block, and refreshes on new blocks when the provider supports subscriptions.

Set the deployed audited registry address and RPC endpoint in [`chain-config.js`](chain-config.js). The adapter intentionally starts in an explicit **Chain not configured** state when those values are empty; it never labels an off-chain demo row as on-chain verified. Production deployment still requires contract audit, role setup, finality handling, and a managed RPC endpoint.

## Overview information architecture

Overview is intentionally a minimal executive snapshot: core network KPIs, identity coverage, registry status, and three clear handoffs. Detailed custody operations, hub performance, and impact allocation records remain on the dedicated Material Lots, Recovery Network, and Impact Ledger pages so each workflow has room to stay useful and legible.
