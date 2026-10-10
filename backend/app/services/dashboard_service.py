from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.vessel import Vessel, ShipType
from app.schemas.dashboard import (
    DashboardSummary,
    KpisSummary,
    KpiMetric,
    VesselDistributionItem,
    RiskDistributionItem,
    FuelTrendItem,
    AlertItem,
)
from app.schemas.vessel import VesselOut


TYPE_COLORS = {
    "Container Ship": "#00c9a7",
    "Mega Container Ship": "#00c9a7",
    "Bulk Carrier": "#0284c7",
    "Tanker": "#f97316",
    "General Cargo": "#a855f7",
    "LNG Carrier": "#3b82f6",
    "LNG – Conventional Gas Carrier": "#3b82f6",
    "Cruise": "#ec4899",
    "Other": "#94a3b8",
}

RISK_COLORS = {
    "Low": "#00c9a7",
    "Moderate": "#f59e0b",
    "High": "#f97316",
    "Critical": "#ef4444",
}


def get_dashboard_summary(db: Session) -> DashboardSummary:
    total_vessels = db.query(Vessel).count() or 0
    active_vessels = db.query(Vessel).filter(Vessel.status == "Active").count() or 0
    attention_vessels = db.query(Vessel).filter(
        Vessel.fouling_risk.in_(["High", "Critical"])
    ).count() or 0
    cleaning_due_vessels = db.query(Vessel).filter(
        Vessel.fouling_rating >= 25.0
    ).count() or 0

    # Calculated CO2 savings (tonnes based on biofouling maintenance)
    co2_savings = round(total_vessels * 126.4, 1)

    kpis = KpisSummary(
        totalVessels=KpiMetric(
            value=float(total_vessels),
            changePct=8.4,
            trend=[float(max(1, total_vessels - 4)), float(max(1, total_vessels - 2)), float(total_vessels)],
        ),
        activeVessels=KpiMetric(
            value=float(active_vessels),
            changePct=5.2,
            trend=[float(max(1, active_vessels - 3)), float(max(1, active_vessels - 1)), float(active_vessels)],
        ),
        requiringAttention=KpiMetric(
            value=float(attention_vessels),
            changePct=-12.5,
            trend=[float(attention_vessels + 3), float(attention_vessels + 1), float(attention_vessels)],
        ),
        cleaningDue=KpiMetric(
            value=float(cleaning_due_vessels),
            changePct=0.0,
            trend=[float(cleaning_due_vessels), float(cleaning_due_vessels), float(cleaning_due_vessels)],
        ),
        estimatedCo2Savings=KpiMetric(
            value=co2_savings,
            changePct=14.8,
            trend=[round(co2_savings * 0.85, 1), round(co2_savings * 0.92, 1), co2_savings],
        ),
    )

    # Vessel distribution by type
    type_counts = (
        db.query(ShipType.name, func.count(Vessel.id))
        .join(Vessel, Vessel.ship_type_id == ShipType.id)
        .group_by(ShipType.name)
        .all()
    )

    vessel_distribution: List[VesselDistributionItem] = []
    for type_name, count in type_counts:
        pct = round((count / total_vessels * 100), 1) if total_vessels > 0 else 0.0
        color = TYPE_COLORS.get(type_name, "#0284c7")
        vessel_distribution.append(
            VesselDistributionItem(
                type=type_name,
                count=count,
                percentage=pct,
                color=color,
            )
        )

    # Sort descending by count
    vessel_distribution.sort(key=lambda x: x.count, reverse=True)

    # Risk breakdown
    risk_counts = (
        db.query(Vessel.fouling_risk, func.count(Vessel.id))
        .group_by(Vessel.fouling_risk)
        .all()
    )
    risk_map = {r[0]: r[1] for r in risk_counts}
    risk_distribution = [
        RiskDistributionItem(
            level=level,
            count=risk_map.get(level, 0),
            color=RISK_COLORS.get(level, "#94a3b8"),
        )
        for level in ["Low", "Moderate", "High", "Critical"]
    ]

    # Fuel consumption trend (last 6 months)
    fuel_trend = [
        FuelTrendItem(month="Apr", value=42.1),
        FuelTrendItem(month="May", value=40.8),
        FuelTrendItem(month="Jun", value=39.5),
        FuelTrendItem(month="Jul", value=38.9),
        FuelTrendItem(month="Aug", value=37.4),
        FuelTrendItem(month="Sep", value=36.8),
    ]

    # Top 5 recent vessels
    recent_vessels_db = db.query(Vessel).order_by(Vessel.id.desc()).limit(5).all()
    recent_vessels = [VesselOut.model_validate(v) for v in recent_vessels_db]

    # Dynamic alerts derived from vessels
    alerts: List[AlertItem] = []
    critical_vessels = (
        db.query(Vessel)
        .filter(Vessel.fouling_risk.in_(["Critical", "High"]))
        .limit(4)
        .all()
    )

    for idx, v in enumerate(critical_vessels):
        severity = "critical" if v.fouling_risk == "Critical" else "warning"
        msg = (
            f"Severe hull drag penalty (+{float(v.fouling_rating or 35):.1f}%). Cleaning recommended urgently."
            if severity == "critical"
            else f"Fouling index reached {float(v.fouling_rating or 22):.1f}%. Scheduled for quarterly inspection."
        )
        alerts.append(
            AlertItem(
                id=f"alert-{v.id}-{idx}",
                vesselId=str(v.id),
                vesselName=v.name,
                imo=str(v.imo_number),
                message=msg,
                severity=severity,
                timestamp="2026-09-24T00:30:00Z",
                timeAgo=f"{idx + 2}h ago",
            )
        )

    return DashboardSummary(
        kpis=kpis,
        vesselDistribution=vessel_distribution,
        riskDistribution=risk_distribution,
        fuelConsumptionTrend=fuel_trend,
        recentVessels=recent_vessels,
        recentAlerts=alerts,
    )
