from __future__ import annotations

import json
from decimal import Decimal, ROUND_DOWN
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_JSON = ROOT / "docs" / "settlement-simulation.json"
OUTPUT_MD = ROOT / "docs" / "settlement-simulation.md"
D = Decimal
MONEY = D("0.01")

sample = {
    "simulation_id": "SIM-NBO-2026-09-07-001",
    "hub": "Nairobi Metro / Eastleigh collection hub",
    "lot_id": "PT-NBO-260907-001",
    "material": "HDPE",
    "collector_group": "Eastleigh Green Team",
    "buyer": "Nairobi Circularity Buyer",
    "accepted_weight_kg": D("1000"),
    "buyer_price_kes_per_kg": D("80"),
    "baseline_collection_kg": D("200"),
    "recycled_output_kg": D("750"),
    "baseline_recycling_kg": D("0"),
    "methodology_factor_kgco2e_per_kg": D("1.35"),
    "uncertainty_buffer_kgco2e": D("12.5"),
    "rule_version": "pilot-2026-01",
    "verification_status": "verified for material settlement; impact measured, not issued",
    "payment_reference": "SIM-MPESA-0001",
    "blockchain_anchor": "confirmed:simulated:0x7c8e...91af",
}

allocation_bps = {
    "Source collector network": 6500,
    "Recovery hub": 1000,
    "Verification and data quality": 800,
    "Impact reserve": 700,
    "Plastitrace platform": 500,
    "Network treasury": 500,
}


def q(value: Decimal) -> Decimal:
    return value.quantize(MONEY)


def kg_to_whole_units(value: Decimal) -> int:
    return int((value / D("1000")).to_integral_value(rounding=ROUND_DOWN))


gross = q(sample["accepted_weight_kg"] * sample["buyer_price_kes_per_kg"])
waterfall = {name: q(gross * D(bps) / D("10000")) for name, bps in allocation_bps.items()}
waterfall["Source collector network"] += q(gross - sum(waterfall.values()))
eligible_collection_kg = max(D("0"), sample["accepted_weight_kg"] - sample["baseline_collection_kg"])
eligible_recycling_kg = max(D("0"), sample["recycled_output_kg"] - sample["baseline_recycling_kg"])
co2e_avoided_kg = q(eligible_recycling_kg * sample["methodology_factor_kgco2e_per_kg"] - sample["uncertainty_buffer_kgco2e"])

result = {
    "simulation": {
        "id": sample["simulation_id"], "location": sample["hub"], "lot_id": sample["lot_id"],
        "material": sample["material"], "collector_group": sample["collector_group"], "buyer": sample["buyer"],
        "rule_version": sample["rule_version"], "status": sample["verification_status"],
    },
    "input": {
        "accepted_weight_kg": str(sample["accepted_weight_kg"]),
        "buyer_price_kes_per_kg": str(sample["buyer_price_kes_per_kg"]),
        "gross_material_proceeds_kes": str(gross),
        "baseline_collection_kg": str(sample["baseline_collection_kg"]),
        "recycled_output_kg": str(sample["recycled_output_kg"]),
        "baseline_recycling_kg": str(sample["baseline_recycling_kg"]),
    },
    "material_settlement": {
        "currency": "KES", "state": "paid", "payment_reference": sample["payment_reference"],
        "gross_proceeds_kes": str(gross),
        "waterfall_kes": {key: str(value) for key, value in waterfall.items()},
        "waterfall_total_kes": str(sum(waterfall.values())),
    },
    "impact_ledger": {
        "collection": {"eligible_kg": str(eligible_collection_kg), "measured_units": str(q(eligible_collection_kg / D("1000"))), "whole_units_issuable": kg_to_whole_units(eligible_collection_kg), "state": "measured"},
        "recycling": {"eligible_kg": str(eligible_recycling_kg), "measured_units": str(q(eligible_recycling_kg / D("1000"))), "whole_units_issuable": kg_to_whole_units(eligible_recycling_kg), "state": "measured"},
        "carbon": {"methodology_factor_kgco2e_per_kg": str(sample["methodology_factor_kgco2e_per_kg"]), "uncertainty_buffer_kgco2e": str(sample["uncertainty_buffer_kgco2e"]), "co2e_avoided_kg": str(co2e_avoided_kg), "measured_units": str(q(co2e_avoided_kg / D("1000"))), "whole_units_issuable": kg_to_whole_units(co2e_avoided_kg), "state": "measured", "note": "Illustrative methodology assumption; not a certified carbon credit."},
        "credit_revenue_kes": "0.00",
        "credit_revenue_note": "No impact-credit sale occurs in this settlement. Any later credit sale uses a separate waterfall.",
    },
    "controls": {
        "lot_state": "verified", "blockchain_anchor": sample["blockchain_anchor"],
        "double_counting_key": f"{sample['lot_id']}|HDPE|{sample['accepted_weight_kg']}kg",
        "claimable_public_impact": False,
        "release_condition": "Material payout released after verified quantity and accepted handoff; impact units remain locked until issuance and retirement gates pass.",
    },
}

assert D(result["material_settlement"]["waterfall_total_kes"]) == gross
assert D(result["material_settlement"]["waterfall_kes"]["Impact reserve"]) == D("5600.00")
OUTPUT_JSON.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")

waterfall_rows = [f"| {name} | {value:,.2f} | {allocation_bps[name] / 100:.2f}% |" for name, value in waterfall.items()]
report = [
    "# Nairobi Collection Hub Settlement Simulation",
    "",
    "> This is a deterministic design simulation using illustrative sample inputs. It is not a price forecast, an offer, or a certified environmental-credit issuance.",
    "",
    "## Transaction summary", "",
    "| Field | Sample value |", "| --- | --- |",
    f"| Simulation ID | `{sample['simulation_id']}` |",
    f"| Collection hub | {sample['hub']} |", f"| Lot | `{sample['lot_id']}` |", f"| Material | {sample['material']} |",
    f"| Accepted weight | {sample['accepted_weight_kg']:,.0f} kg |", f"| Buyer price | KES {sample['buyer_price_kes_per_kg']:,.2f}/kg |",
    f"| Gross material proceeds | KES {gross:,.2f} |", f"| Material settlement state | Paid · `{sample['payment_reference']}` |",
    "| Impact-credit state | Measured, not issued |", f"| Chain anchor | Confirmed · `{sample['blockchain_anchor']}` |", "",
    "## Settlement waterfall", "",
    f"The buyer funds one KES {gross:,.2f} settlement. The rule version `{sample['rule_version']}` allocates the full amount without using future credit revenue.", "",
    "| Allocation | Amount (KES) | Share |", "| --- | ---: | ---: |", *waterfall_rows,
    f"| **Total** | **{gross:,.2f}** | **100.00%** |", "", "### Cash movement", "",
    f"1. {sample['buyer']} funds the settlement clearing account with KES {gross:,.2f}.",
    "2. The platform confirms the accepted 1,000 kg handoff and applies the versioned allocation rule.",
    f"3. KES {waterfall['Source collector network']:,.2f} is payable to {sample['collector_group']}.",
    f"4. KES {waterfall['Recovery hub']:,.2f} is payable to the Eastleigh hub.",
    f"5. KES {waterfall['Verification and data quality']:,.2f} funds the verification and evidence-quality process.",
    f"6. KES {waterfall['Impact reserve']:,.2f} remains protected for remeasurement, disputes, safeguards, and methodology costs.",
    f"7. KES {waterfall['Plastitrace platform']:,.2f} funds platform operations. KES {waterfall['Network treasury']:,.2f} funds network development.", "",
    "## Impact ledger outcome", "", "| Attribute | Calculation | Result | State |", "| --- | --- | ---: | --- |",
    f"| Collection | 1,000 kg accepted − 200 kg baseline | {eligible_collection_kg:,.0f} kg / {eligible_collection_kg / D('1000'):.2f} units | Measured, not issued |",
    f"| Recycling | 750 kg output − 0 kg baseline | {eligible_recycling_kg:,.0f} kg / {eligible_recycling_kg / D('1000'):.2f} units | Measured, not issued |",
    f"| Carbon | 750 kg × 1.35 − 12.5 kg buffer | {co2e_avoided_kg:,.2f} kg CO₂e / {co2e_avoided_kg / D('1000'):.2f} units | Illustrative, not certified |", "",
    "The measured quantities remain locked because this sample does not include an independent methodology verification or a credit registry issuance event. No impact-credit revenue is included in the KES waterfall. A later credit sale must use a separate impact waterfall and a unique retirement record.", "",
    "## Controls exercised", "",
    "- The material payout is based on the lower accepted quantity, not the original field estimate.",
    "- The impact ledger stores collection, recycling, and carbon attributes separately.",
    "- The sample does not mint a credit because measured impact is not the same as an issued or retired credit.",
    "- The settlement clears to zero and the anchor reference is recorded for reconciliation.",
    "- The lot remains eligible for later review, reversal, or credit issuance without rewriting the cash settlement history.", "",
    "## Source of assumptions", "",
    "The allocation percentages and sample price are design assumptions inherited from the Plastitrace pilot policy. They must be calibrated against live buyer contracts, collector economics, payment costs, taxes, and the selected plastic or carbon methodology before production use.", "",
]
OUTPUT_MD.write_text("\n".join(report) + "\n", encoding="utf-8")
