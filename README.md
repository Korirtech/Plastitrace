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
