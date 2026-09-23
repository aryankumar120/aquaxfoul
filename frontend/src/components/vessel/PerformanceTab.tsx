import React, { useEffect, useState } from 'react';
import { Vessel, PerformanceRecord } from '../../types';
import { vesselApi } from '../../services/vesselApi';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { Gauge, Flame, Wind, Activity } from 'lucide-react';

export const PerformanceTab: React.FC<{ vessel: Vessel }> = ({ vessel }) => {
  const [records, setRecords] = useState<PerformanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vesselApi.getPerformanceData(vessel.id).then((data) => {
      setRecords(data);
      setLoading(false);
    });
  }, [vessel.id]);

  if (loading) return <LoadingSkeleton rows={4} />;

  return (
    <div className="space-y-6">
      {/* Current Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
            <Gauge className="w-4 h-4 text-aqua-600" />
            <span>Operational Speed</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
            {vessel.speedKnots} <span className="text-xs font-normal text-slate-400">knots</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Design baseline: 20.0 kn</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Daily Fuel Burn</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
            {vessel.fuelConsumptionTonsPerDay} <span className="text-xs font-normal text-slate-400">t/day</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">VLSFO Heavy Fuel Oil</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
            <Activity className="w-4 h-4 text-blue-500" />
            <span>Apparent Slip Ratio</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
            4.8% <span className="text-xs font-normal text-slate-400">avg</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Normal hydrodynamic slip window</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
            <Wind className="w-4 h-4 text-emerald-500" />
            <span>Fouling Fuel Penalty</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
            +0.8% <span className="text-xs font-normal text-slate-400">drag</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Within optimal limits</div>
        </div>
      </div>

      {/* Historical Telemetry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Historical Speed & Fuel Telemetry Logs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">Observation Date</th>
                <th className="py-2.5 px-4">Speed (kn)</th>
                <th className="py-2.5 px-4">Fuel Burn (t/day)</th>
                <th className="py-2.5 px-4">Propeller Slip (%)</th>
                <th className="py-2.5 px-4">Weather (Beaufort)</th>
                <th className="py-2.5 px-4">Fouling Fuel Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono text-slate-500">{r.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{r.speedKnots} kn</td>
                  <td className="py-3 px-4 font-mono">{r.fuelConsumptionTonsPerDay} t</td>
                  <td className="py-3 px-4">{r.slipRatioPct}%</td>
                  <td className="py-3 px-4">BF {r.weatherBeaufort} (Moderate)</td>
                  <td className="py-3 px-4 text-emerald-700 font-medium">+{r.excessFuelPenaltyPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
