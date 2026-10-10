from typing import Optional
from sqlalchemy.orm import Session
from app.models.vessel import Vessel
from app.schemas.projections import (
    VesselProjections,
    ScenariosGroup,
    ScenarioProjection,
    ProjectionSeriesPoint,
)


def get_vessel_projections(db: Session, vessel: Vessel) -> VesselProjections:
    base_fouling = float(vessel.fouling_rating or 18.5)
    base_fuel = float(vessel.fuel_consumption_tons_per_day or 42.0)

    # Monthly progression projection points
    months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]

    # Scenario A: No Cleaning
    series_a = [
        ProjectionSeriesPoint(month=m, historical=(base_fouling if i == 0 else None), projected=round(base_fouling + (i * 3.8), 1))
        for i, m in enumerate(months)
    ]
    scenario_a = ScenarioProjection(
        scenarioId="no-cleaning",
        scenarioName="Scenario A: Baseline (No Cleaning)",
        description="Vessel continues regular voyage schedules with zero biofouling intervention.",
        projectedFoulingPct=round(base_fouling + 22.8, 1),
        excessFuelTons=round(base_fuel * 4.2 * 30, 1),
        excessCo2Tons=round(base_fuel * 4.2 * 30 * 3.114, 1),
        financialImpactUsd=round(base_fuel * 4.2 * 30 * 680, 2),
        efficiencyRecoveryPct=0.0,
        series=series_a,
    )

    # Scenario B: Clean Now
    series_b = [
        ProjectionSeriesPoint(month=m, historical=(base_fouling if i == 0 else None), projected=round(max(2.5, 3.0 + (i * 0.9)), 1))
        for i, m in enumerate(months)
    ]
    scenario_b = ScenarioProjection(
        scenarioId="clean-now",
        scenarioName="Scenario B: Immediate ROV Cleaning",
        description="Execute in-water hull robotic grooming at next port of call (Rotterdam).",
        recommendationBadge="Optimal ROI (Save $142,500)",
        cleaningDate="2026-10-15",
        projectedFoulingPct=5.4,
        excessFuelTons=18.2,
        excessCo2Tons=56.6,
        financialImpactUsd=28500.0,
        efficiencyRecoveryPct=94.5,
        series=series_b,
    )

    # Scenario C: Clean Later
    series_c = [
        ProjectionSeriesPoint(
            month=m,
            historical=(base_fouling if i == 0 else None),
            projected=round(base_fouling + (i * 3.2) if i < 3 else max(3.5, 4.0 + ((i - 3) * 1.1)), 1),
        )
        for i, m in enumerate(months)
    ]
    scenario_c = ScenarioProjection(
        scenarioId="clean-later",
        scenarioName="Scenario C: Deferred Cleaning (Q1 2027)",
        description="Postpone grooming until scheduled dry dock survey in Singapore.",
        cleaningDate="2027-01-10",
        projectedFoulingPct=14.2,
        excessFuelTons=74.6,
        excessCo2Tons=232.1,
        financialImpactUsd=86200.0,
        efficiencyRecoveryPct=78.0,
        series=series_c,
    )

    return VesselProjections(
        vesselId=str(vessel.id),
        vesselName=vessel.name,
        imo=str(vessel.imo_number),
        calculatedAt="2026-09-24T06:00:00Z",
        optimalCleaningWindow="15 Oct - 28 Oct 2026",
        recommendedAction="Schedule In-Water Robotic Cleaning at Rotterdam Anchorage",
        currentPenaltyUsdPerDay=round(base_fuel * (base_fouling / 100.0) * 650.0, 2),
        confidenceIntervalPct=96.4,
        scenarios=ScenariosGroup(
            noCleaning=scenario_a,
            cleanNow=scenario_b,
            cleanLater=scenario_c,
        ),
    )
