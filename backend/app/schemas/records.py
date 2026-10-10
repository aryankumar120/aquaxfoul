from typing import Optional, List
from pydantic import BaseModel, ConfigDict, computed_field


class InspectionRecordOut(BaseModel):
    id: int
    vessel_id: int
    date: str
    type: str
    inspector: str
    location: str
    hull_rating: float
    propeller_condition: str
    findings: Optional[str] = None
    status: str

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    def vesselId(self) -> str:
        return str(self.vessel_id)

    @computed_field
    def hullRating(self) -> float:
        return float(self.hull_rating)

    @computed_field
    def propellerCondition(self) -> str:
        return self.propeller_condition


class FoulingAssessmentOut(BaseModel):
    id: int
    vessel_id: int
    date: str
    risk_level: str
    fouling_coverage_pct: float
    roughness_microns: float
    speed_loss_pct: float
    excess_fuel_pct: float
    estimated_co2_penalty_tons: float
    assessed_by: str

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    def vesselId(self) -> str:
        return str(self.vessel_id)

    @computed_field
    def riskLevel(self) -> str:
        return self.risk_level

    @computed_field
    def foulingCoveragePct(self) -> float:
        return float(self.fouling_coverage_pct)

    @computed_field
    def roughnessMicrons(self) -> float:
        return float(self.roughness_microns)

    @computed_field
    def speedLossPct(self) -> float:
        return float(self.speed_loss_pct)

    @computed_field
    def excessFuelPct(self) -> float:
        return float(self.excess_fuel_pct)

    @computed_field
    def estimatedCo2PenaltyTons(self) -> float:
        return float(self.estimated_co2_penalty_tons)

    @computed_field
    def assessedBy(self) -> str:
        return self.assessed_by


class CleaningEventOut(BaseModel):
    id: int
    vessel_id: int
    date: str
    location: str
    provider: str
    method: str
    status: str
    before_rating: float
    after_rating: float
    efficiency_gain_pct: float
    cost_usd: float
    co2_saved_tons_est: float

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    def vesselId(self) -> str:
        return str(self.vessel_id)

    @computed_field
    def beforeRating(self) -> float:
        return float(self.before_rating)

    @computed_field
    def afterRating(self) -> float:
        return float(self.after_rating)

    @computed_field
    def efficiencyGainPct(self) -> float:
        return float(self.efficiency_gain_pct)

    @computed_field
    def costUsd(self) -> float:
        return float(self.cost_usd)

    @computed_field
    def co2SavedTonsEst(self) -> float:
        return float(self.co2_saved_tons_est)


class PerformanceRecordOut(BaseModel):
    id: int
    vessel_id: int
    date: str
    speed_knots: float
    fuel_consumption_tons_per_day: float
    slip_ratio_pct: float
    weather_beaufort: int
    excess_fuel_penalty_pct: float

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    def vesselId(self) -> str:
        return str(self.vessel_id)

    @computed_field
    def speedKnots(self) -> float:
        return float(self.speed_knots)

    @computed_field
    def fuelConsumptionTonsPerDay(self) -> float:
        return float(self.fuel_consumption_tons_per_day)

    @computed_field
    def slipRatioPct(self) -> float:
        return float(self.slip_ratio_pct)

    @computed_field
    def weatherBeaufort(self) -> int:
        return self.weather_beaufort

    @computed_field
    def excessFuelPenaltyPct(self) -> float:
        return float(self.excess_fuel_penalty_pct)
