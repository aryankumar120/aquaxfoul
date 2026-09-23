import React, { useState, useEffect } from 'react';
import { LineChart, Sliders, ShieldCheck } from 'lucide-react';
import { projectionApi } from '../../services/projectionApi';
import { vesselApi } from '../../services/vesselApi';
import { Vessel, VesselProjections } from '../../types';
import { ProjectionComparisonChart } from '../../components/charts/ProjectionComparisonChart';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const ProjectionsPage: React.FC = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [selectedVesselId, setSelectedVesselId] = useState<string>('v-9876543');
  const [projections, setProjections] = useState<VesselProjections | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeScenario, setActiveScenario] = useState<'all' | 'no-cleaning' | 'clean-now' | 'clean-later'>('all');

  useEffect(() => {
    vesselApi.getVessels({ limit: 20 }).then((res) => {
      setVessels(res.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    projectionApi.getProjections(selectedVesselId).then((data) => {
      setProjections(data);
      setLoading(false);
    });
  }, [selectedVesselId]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <LineChart className="w-6 h-6 text-aqua-600" />
            <span>Hydrodynamic Projections & Decision Support</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Machine learning predictive model comparing fuel burn penalties across multi-scenario cleaning schedules.
          </p>
        </div>

        {/* Vessel Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Target Vessel:</label>
          <select
            value={selectedVesselId}
            onChange={(e) => setSelectedVesselId(e.target.value)}
            className="bg-white border border-slate-200 text-xs rounded-lg px-3 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-aqua-500 shadow-sm"
          >
            {vessels.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} (IMO {v.imo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading || !projections ? (
        <LoadingSkeleton type="chart" />
      ) : (
        <>
          {/* Recommendation Banner */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white rounded-xl border border-emerald-200/80 p-6 shadow-card card-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  Decision Recommendation
                </span>
                <span className="text-xs text-slate-500">
                  Target: <b className="text-slate-900">{projections.optimalCleaningWindow}</b>
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-2">
                {projections.recommendedAction}
              </h2>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl border border-emerald-200 shadow-sm text-right shrink-0">
              <span className="text-[11px] text-slate-400 font-medium block">Daily Fuel Drag Cost</span>
              <span className="text-xl font-bold font-mono text-rose-600">
                +${projections.currentPenaltyUsdPerDay} USD/day
              </span>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-card card-subtle p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Multi-Scenario Fuel Consumption Projections (t/day)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparison between baseline status quo and intervention schedules.
                </p>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setActiveScenario('all')}
                  className={`px-3 py-1 rounded-md transition-all btn-press ${
                    activeScenario === 'all'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Scenarios
                </button>
                <button
                  onClick={() => setActiveScenario('no-cleaning')}
                  className={`px-3 py-1 rounded-md transition-all btn-press ${
                    activeScenario === 'no-cleaning'
                      ? 'bg-rose-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  No Clean
                </button>
                <button
                  onClick={() => setActiveScenario('clean-now')}
                  className={`px-3 py-1 rounded-md transition-all btn-press ${
                    activeScenario === 'clean-now'
                      ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Clean Now
                </button>
                <button
                  onClick={() => setActiveScenario('clean-later')}
                  className={`px-3 py-1 rounded-md transition-all btn-press ${
                    activeScenario === 'clean-later'
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Clean Later
                </button>
              </div>
            </div>

            <ProjectionComparisonChart projections={projections} activeScenario={activeScenario} />
          </div>

          {/* Scenario Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-rose-200 p-5 shadow-card card-hover space-y-2 cursor-default">
              <div className="font-bold text-rose-700 text-sm">Scenario A: No Cleaning</div>
              <p className="text-xs text-slate-500">Continuous hull roughness degradation without intervention.</p>
              <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Excess Fuel:</span>
                  <b className="text-rose-600 font-mono">+{projections.scenarios.noCleaning.excessFuelTons} t</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Excess CO₂:</span>
                  <b className="text-rose-600 font-mono">+{projections.scenarios.noCleaning.excessCo2Tons} t</b>
                </div>
                <div className="flex justify-between pt-1 font-semibold">
                  <span className="text-slate-500">12-Mo Financial Penalty:</span>
                  <b className="text-rose-700 font-mono">-${projections.scenarios.noCleaning.financialImpactUsd.toLocaleString()}</b>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-emerald-300 p-5 shadow-card card-hover space-y-2 ring-1 ring-emerald-400 cursor-default">
              <div className="font-bold text-emerald-700 text-sm">Scenario B: Clean Now</div>
              <p className="text-xs text-slate-500">Immediate in-water robotic cleaning restoring smooth hydrodynamics.</p>
              <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Excess Fuel:</span>
                  <b className="text-emerald-600 font-mono">+{projections.scenarios.cleanNow.excessFuelTons} t</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CO₂ Abated:</span>
                  <b className="text-emerald-600 font-mono">
                    {projections.scenarios.noCleaning.excessCo2Tons - projections.scenarios.cleanNow.excessCo2Tons} t
                  </b>
                </div>
                <div className="flex justify-between pt-1 font-semibold">
                  <span className="text-slate-500">Net Financial Savings:</span>
                  <b className="text-emerald-700 font-mono">
                    +${(projections.scenarios.noCleaning.financialImpactUsd - projections.scenarios.cleanNow.financialImpactUsd).toLocaleString()}
                  </b>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-card card-hover space-y-2 cursor-default">
              <div className="font-bold text-blue-700 text-sm">Scenario C: Clean Later</div>
              <p className="text-xs text-slate-500">Deferred intervention synchronized with scheduled Q1 dry docking.</p>
              <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Excess Fuel:</span>
                  <b className="text-blue-600 font-mono">+{projections.scenarios.cleanLater.excessFuelTons} t</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cleaning Date:</span>
                  <b className="text-slate-700">{projections.scenarios.cleanLater.cleaningDate}</b>
                </div>
                <div className="flex justify-between pt-1 font-semibold">
                  <span className="text-slate-500">Net Financial Savings:</span>
                  <b className="text-blue-700 font-mono">
                    +${(projections.scenarios.noCleaning.financialImpactUsd - projections.scenarios.cleanLater.financialImpactUsd).toLocaleString()}
                  </b>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
