import React from 'react';
import { Ship, BarChart3, AlertTriangle, Droplets, Leaf } from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { DashboardSummary } from '../../types';

interface KpiGridProps {
  kpis: DashboardSummary['kpis'];
}

export const KpiGrid: React.FC<KpiGridProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {/* 1. Total Vessels */}
      <MetricCard
        title="Total Vessels"
        value={kpis.totalVessels.value}
        changePct={kpis.totalVessels.changePct}
        trend={kpis.totalVessels.trend}
        icon={Ship}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
        sparklineColor="#10b981"
      />

      {/* 2. Active Vessels */}
      <MetricCard
        title="Active Vessels"
        value={kpis.activeVessels.value}
        changePct={kpis.activeVessels.changePct}
        trend={kpis.activeVessels.trend}
        icon={BarChart3}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
        sparklineColor="#10b981"
      />

      {/* 3. Requiring Attention */}
      <MetricCard
        title="Requiring Attention"
        value={kpis.requiringAttention.value}
        changePct={kpis.requiringAttention.changePct}
        trend={kpis.requiringAttention.trend}
        icon={AlertTriangle}
        iconBgColor="bg-rose-50"
        iconColor="text-rose-500"
        sparklineColor="#ef4444"
      />

      {/* 4. Cleaning Due */}
      <MetricCard
        title="Cleaning Due"
        value={kpis.cleaningDue.value}
        changePct={kpis.cleaningDue.changePct}
        trend={kpis.cleaningDue.trend}
        icon={Droplets}
        iconBgColor="bg-sky-50"
        iconColor="text-sky-500"
        sparklineColor="#0284c7"
      />

      {/* 5. Estimated CO2 Savings */}
      <MetricCard
        title="Estimated CO₂ Savings (t)"
        value={kpis.estimatedCo2Savings.value}
        changePct={kpis.estimatedCo2Savings.changePct}
        trend={kpis.estimatedCo2Savings.trend}
        icon={Leaf}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
        sparklineColor="#10b981"
      />
    </div>
  );
};
