# Nairobi Collection Hub Settlement Simulation

> This is a deterministic design simulation using illustrative sample inputs. It is not a price forecast, an offer, or a certified environmental-credit issuance.

## Transaction summary

| Field | Sample value |
| --- | --- |
| Simulation ID | `SIM-NBO-2026-09-07-001` |
| Collection hub | Nairobi Metro / Eastleigh collection hub |
| Lot | `PT-NBO-260907-001` |
| Material | HDPE |
| Accepted weight | 1,000 kg |
| Buyer price | KES 80.00/kg |
| Gross material proceeds | KES 80,000.00 |
| Material settlement state | Paid · `SIM-MPESA-0001` |
| Impact-credit state | Measured, not issued |
| Chain anchor | Confirmed · `confirmed:simulated:0x7c8e...91af` |

## Settlement waterfall

The buyer funds one KES 80,000.00 settlement. The rule version `pilot-2026-01` allocates the full amount without using future credit revenue.

| Allocation | Amount (KES) | Share |
| --- | ---: | ---: |
| Source collector network | 52,000.00 | 65.00% |
| Recovery hub | 8,000.00 | 10.00% |
| Verification and data quality | 6,400.00 | 8.00% |
| Impact reserve | 5,600.00 | 7.00% |
| Plastitrace platform | 4,000.00 | 5.00% |
| Network treasury | 4,000.00 | 5.00% |
| **Total** | **80,000.00** | **100.00%** |

### Cash movement

1. Nairobi Circularity Buyer funds the settlement clearing account with KES 80,000.00.
2. The platform confirms the accepted 1,000 kg handoff and applies the versioned allocation rule.
3. KES 52,000.00 is payable to Eastleigh Green Team.
4. KES 8,000.00 is payable to the Eastleigh hub.
5. KES 6,400.00 funds the verification and evidence-quality process.
6. KES 5,600.00 remains protected for remeasurement, disputes, safeguards, and methodology costs.
7. KES 4,000.00 funds platform operations. KES 4,000.00 funds network development.

## Impact ledger outcome

| Attribute | Calculation | Result | State |
| --- | --- | ---: | --- |
| Collection | 1,000 kg accepted − 200 kg baseline | 800 kg / 0.80 units | Measured, not issued |
| Recycling | 750 kg output − 0 kg baseline | 750 kg / 0.75 units | Measured, not issued |
| Carbon | 750 kg × 1.35 − 12.5 kg buffer | 1,000.00 kg CO₂e / 1.00 units | Illustrative, not certified |

The measured quantities remain locked because this sample does not include an independent methodology verification or a credit registry issuance event. No impact-credit revenue is included in the KES waterfall. A later credit sale must use a separate impact waterfall and a unique retirement record.

## Controls exercised

- The material payout is based on the lower accepted quantity, not the original field estimate.
- The impact ledger stores collection, recycling, and carbon attributes separately.
- The sample does not mint a credit because measured impact is not the same as an issued or retired credit.
- The settlement clears to zero and the anchor reference is recorded for reconciliation.
- The lot remains eligible for later review, reversal, or credit issuance without rewriting the cash settlement history.

## Source of assumptions

The allocation percentages and sample price are design assumptions inherited from the Plastitrace pilot policy. They must be calibrated against live buyer contracts, collector economics, payment costs, taxes, and the selected plastic or carbon methodology before production use.
