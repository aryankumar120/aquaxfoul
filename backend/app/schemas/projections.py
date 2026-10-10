from typing import List, Optional
from pydantic import BaseModel


class ProjectionSeriesPoint(BaseModel):
    month: str
    historical: Optional[float] = None
    projected: float


class ScenarioProjection(BaseModel):
    scenarioId: str  # 'no-cleaning' | 'clean-now' | 'clean-later'
    scenarioName: str
    description: str
    recommendationBadge: Optional[str] = None
    cleaningDate: Optional[str] = None
    projectedFoulingPct: float
    excessFuelTons: float
    excessCo2Tons: float
    financialImpactUsd: float
    efficiencyRecoveryPct: float
    series: List[ProjectionSeriesPoint]


class ScenariosGroup(BaseModel):
    noCleaning: ScenarioProjection
    cleanNow: ScenarioProjection
    cleanLater: ScenarioProjection


class VesselProjections(BaseModel):
    vesselId: str
    vesselName: str
    imo: str
    calculatedAt: str
    optimalCleaningWindow: str
    recommendedAction: str
    currentPenaltyUsdPerDay: float
    confidenceIntervalPct: float
    scenarios: ScenariosGroup
