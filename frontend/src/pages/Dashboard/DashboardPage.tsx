import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../services/dashboardApi';
import { DashboardSummary } from '../../types';
import { WelcomeBanner } from '../../components/dashboard/WelcomeBanner';
import { KpiGrid } from '../../components/dashboard/KpiGrid';
import { VesselDistributionChart } from '../../components/charts/VesselDistributionChart';
import { FoulingRiskBarChart } from '../../components/charts/FoulingRiskBarChart';
import { FuelConsumptionTrendChart } from '../../components/charts/FuelConsumptionTrendChart';
import { RecentVesselsTable } from '../../components/dashboard/RecentVesselsTable';
import { RecentAlertsList } from '../../components/dashboard/RecentAlertsList';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await dashboardApi.getDashboardSummary();
      setData(summary);
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve fleet dashboard intelligence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="chart" />
        </div>
        <LoadingSkeleton type="table" rows={5} />
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState message={error || undefined} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Welcome Greeting Banner */}
      <WelcomeBanner />

      {/* 2. Top 5 KPI Cards Grid */}
      <KpiGrid kpis={data.kpis} />

      {/* 3. Middle Visualizations Grid (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Vessel Distribution Donut */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Vessel Distribution by Type
            </h2>
            <button
              onClick={() => navigate('/fleet')}
              className="text-xs font-semibold text-aqua-600 hover:text-aqua-700 flex items-center space-x-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <VesselDistributionChart
            data={data.vesselDistribution}
            totalVessels={data.kpis.totalVessels.value}
          />
        </div>

        {/* Fouling Risk Distribution Bars */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Fouling Risk Distribution
            </h2>
            <button
              onClick={() => navigate('/fouling')}
              className="text-xs font-semibold text-aqua-600 hover:text-aqua-700 flex items-center space-x-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <FoulingRiskBarChart data={data.riskDistribution} />
        </div>

        {/* Fuel Consumption Trend Line */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <FuelConsumptionTrendChart data={data.fuelConsumptionTrend} />
        </div>
      </div>

      {/* 4. Bottom Row: Recent Vessels Table & Recent Alerts List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <RecentVesselsTable vessels={data.recentVessels} />
        </div>
        <div className="lg:col-span-4">
          <RecentAlertsList alerts={data.recentAlerts} />
        </div>
      </div>
    </div>
  );
};
