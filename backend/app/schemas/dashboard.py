from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.schemas.vessel import VesselOut


class KpiMetric(BaseModel):
    value: float
    changePct: float
    trend: List[float]


class KpisSummary(BaseModel):
    totalVessels: KpiMetric
    activeVessels: KpiMetric
    requiringAttention: KpiMetric
    cleaningDue: KpiMetric
    estimatedCo2Savings: KpiMetric


class VesselDistributionItem(BaseModel):
    type: str
    count: int
    percentage: float
    color: str


class RiskDistributionItem(BaseModel):
    level: str
    count: int
    color: str


class FuelTrendItem(BaseModel):
    month: str
    value: float


class AlertItem(BaseModel):
    id: str
    vesselId: str
    vesselName: str
    imo: str
    message: str
    severity: str
    timestamp: str
    timeAgo: str


class DashboardSummary(BaseModel):
    kpis: KpisSummary
    vesselDistribution: List[VesselDistributionItem]
    riskDistribution: List[RiskDistributionItem]
    fuelConsumptionTrend: List[FuelTrendItem]
    recentVessels: List[VesselOut]
    recentAlerts: List[AlertItem]
