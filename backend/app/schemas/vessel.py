from datetime import datetime
from decimal import Decimal
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict, computed_field


class ShipTypeOut(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class VesselBase(BaseModel):
    imo_number: int
    name: str
    yard_number: Optional[str] = None
    category: Optional[str] = None
    technical_manager: Optional[str] = None
    manager_domicile: Optional[str] = None
    manager_registration: Optional[str] = None
    deadweight: Optional[int] = None
    gross_tonnage: Optional[int] = None
    teu: Optional[int] = None
    teu_14: Optional[int] = None
    flag: Optional[str] = None
    built_year: Optional[int] = None
    length: Optional[Decimal] = None
    length_bp: Optional[Decimal] = None
    breadth: Optional[Decimal] = None
    breadth_moulded: Optional[Decimal] = None
    depth: Optional[Decimal] = None
    draught: Optional[Decimal] = None
    engine_rpm: Optional[Decimal] = None
    service_speed: Optional[Decimal] = None
    speed_knots: Optional[Decimal] = None
    fuel_consumption_tons_per_day: Optional[Decimal] = None
    status: Optional[str] = "Active"
    fouling_risk: Optional[str] = "Low"
    fouling_rating: Optional[Decimal] = Decimal("0.0")
    last_inspection_date: Optional[str] = None
    next_cleaning_due_date: Optional[str] = None
    current_route: Optional[str] = None


class VesselCreate(VesselBase):
    ship_type: str  # Name of ship type, resolved in repo/service


class VesselUpdate(BaseModel):
    name: Optional[str] = None
    ship_type: Optional[str] = None
    yard_number: Optional[str] = None
    category: Optional[str] = None
    technical_manager: Optional[str] = None
    manager_domicile: Optional[str] = None
    manager_registration: Optional[str] = None
    deadweight: Optional[int] = None
    gross_tonnage: Optional[int] = None
    teu: Optional[int] = None
    teu_14: Optional[int] = None
    flag: Optional[str] = None
    built_year: Optional[int] = None
    length: Optional[Decimal] = None
    length_bp: Optional[Decimal] = None
    breadth: Optional[Decimal] = None
    breadth_moulded: Optional[Decimal] = None
    depth: Optional[Decimal] = None
    draught: Optional[Decimal] = None
    engine_rpm: Optional[Decimal] = None
    service_speed: Optional[Decimal] = None
    speed_knots: Optional[Decimal] = None
    fuel_consumption_tons_per_day: Optional[Decimal] = None
    status: Optional[str] = None
    fouling_risk: Optional[str] = None
    fouling_rating: Optional[Decimal] = None
    last_inspection_date: Optional[str] = None
    next_cleaning_due_date: Optional[str] = None
    current_route: Optional[str] = None


class VesselOut(VesselBase):
    id: int
    ship_type: ShipTypeOut

    model_config = ConfigDict(from_attributes=True)

    # Computed aliases for frontend seamless integration
    @computed_field
    def imo(self) -> str:
        return str(self.imo_number)

    @computed_field
    def yardNumber(self) -> str:
        return self.yard_number or f"YD-{self.id:04d}"

    @computed_field
    def type(self) -> str:
        return self.ship_type.name

    @computed_field
    def technicalManager(self) -> str:
        return self.technical_manager or "Aqua Fleet Management"

    @computed_field
    def managerDomicile(self) -> str:
        return self.manager_domicile or "Singapore"

    @computed_field
    def managerRegistration(self) -> str:
        return self.manager_registration or "SG-REG-2024"

    @computed_field
    def dwt(self) -> int:
        return self.deadweight or 50000

    @computed_field
    def gt(self) -> int:
        return self.gross_tonnage or int((self.deadweight or 50000) * 0.6)

    @computed_field
    def teu14(self) -> Optional[int]:
        return self.teu_14 or (int(self.teu * 0.75) if self.teu else None)

    @computed_field
    def builtYear(self) -> int:
        return self.built_year or 2018

    @computed_field
    def lengthMeters(self) -> float:
        return float(self.length or 220.0)

    @computed_field
    def beamMeters(self) -> float:
        return float(self.breadth or 32.2)

    @computed_field
    def draftMeters(self) -> float:
        return float(self.draught or 12.0)

    @computed_field
    def foulingRisk(self) -> str:
        return self.fouling_risk or "Low"

    @computed_field
    def foulingRating(self) -> float:
        return float(self.fouling_rating or 0.0)

    @computed_field
    def lastInspectionDate(self) -> str:
        return self.last_inspection_date or "2026-08-15"

    @computed_field
    def nextCleaningDueDate(self) -> str:
        return self.next_cleaning_due_date or "2026-11-20"

    @computed_field
    def speedKnots(self) -> float:
        return float(self.speed_knots or self.service_speed or 15.5)

    @computed_field
    def fuelConsumptionTonsPerDay(self) -> float:
        return float(self.fuel_consumption_tons_per_day or 38.5)


class VesselListResponse(BaseModel):
    total: int
    page: int
    limit: int
    totalPages: int
    data: List[VesselOut]
    results: List[VesselOut]


class DuplicateDetail(BaseModel):
    imo: int
    original: dict
    duplicate: dict


class InvalidDetail(BaseModel):
    row: int
    reason: str
    raw: dict


class ImportSummary(BaseModel):
    records_processed: int = 0
    new_vessels: int = 0
    updated_vessels: int = 0
    duplicates_detected: int = 0
    invalid_records: int = 0
    files_processed: int = 1
    status: str = "Import completed"
    duplicate_details: List[DuplicateDetail] = []
    invalid_details: List[InvalidDetail] = []