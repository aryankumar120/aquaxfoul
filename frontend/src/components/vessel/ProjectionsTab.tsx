import React, { useEffect, useState } from 'react';
import { Vessel, VesselProjections } from '../../types';
import { projectionApi } from '../../services/projectionApi';
import { ProjectionComparisonChart } from '../charts/ProjectionComparisonChart';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { LineChart, CheckCircle2, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';

export const ProjectionsTab: React.FC<{ vessel: Vessel }> = ({ vessel }) => {
  const [projections, setProjections] = useState<VesselProjections | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<'all' | 'no-cleaning' | 'clean-now' | 'clean-later'>('all');

  useEffect(() => {
    projectionApi.getProjections(vessel.id).then((data) => {
      setProjections(data);
      setLoading(false);
    });
  }, [vessel.id]);

  if (loading || !projections) return <LoadingSkeleton rows={4} />;

  const { scenarios } = projections;

  return (
    <div className="space-y-6">
      {/* Decision Support Recommendation Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white rounded-xl border border-emerald-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white uppercase tracking-wider">
                Recommendation Engine
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Model Confidence: <b className="text-slate-800">{projections.confidenceIntervalPct}%</b>
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Optimal Cleaning Target: {projections.optimalCleaningWindow}
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl">
              {projections.recommendedAction}
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-xl border border-emerald-100 shadow-sm shrink-0 text-right">
            <div className="text-[11px] text-slate-400 font-medium">Current Drag Penalty</div>
            <div className="text-xl font-bold font-mono text-rose-600">
              +${projections.currentPenaltyUsdPerDay.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Comparison Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <LineChart className="w-4 h-4 text-aqua-600" />
              <span>12-Month Dynamic Fuel Consumption Projection</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Solid line: Historical telemetry | Dashed lines: Forward predictive scenarios
            </p>
          </div>

          {/* Scenario Filter Buttons */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setSelectedScenario('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedScenario === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Scenarios
            </button>
            <button
              onClick={() => setSelectedScenario('no-cleaning')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedScenario === 'no-cleaning'
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              No Clean
            </button>
            <button
              onClick={() => setSelectedScenario('clean-now')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedScenario === 'clean-now'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clean Now
            </button>
            <button
              onClick={() => setSelectedScenario('clean-later')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedScenario === 'clean-later'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clean Later
            </button>
          </div>
        </div>

        <ProjectionComparisonChart projections={projections} activeScenario={selectedScenario} />
      </div>

      {/* Scenario Comparison Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scenario A: No Cleaning */}
        <div className="bg-white rounded-xl border-2 border-rose-200 p-5 shadow-sm space-y-3 relative">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">{scenarios.noCleaning.scenarioName}</h4>
            <span className="p-1 rounded bg-rose-100 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-slate-500">{scenarios.noCleaning.description}</p>

          <dl className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            <div>
              <dt className="text-slate-400">Excess Fuel Burn</dt>
              <dd className="font-bold font-mono text-rose-600 text-sm mt-0.5">
                +{scenarios.noCleaning.excessFuelTons} t
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Excess CO₂ Penalty</dt>
              <dd className="font-bold font-mono text-rose-600 text-sm mt-0.5">
                +{scenarios.noCleaning.excessCo2Tons} t
              </dd>
            </div>
            <div className="col-span-2 pt-2">
              <dt className="text-slate-400">Financial Impact (12 mo)</dt>
              <dd className="font-bold font-mono text-rose-700 text-base mt-0.5">
                -${scenarios.noCleaning.financialImpactUsd.toLocaleString()} USD
              </dd>
            </div>
          </dl>
        </div>

        {/* Scenario B: Clean Now */}
        <div className="bg-white rounded-xl border-2 border-emerald-300 p-5 shadow-sm space-y-3 relative ring-2 ring-emerald-500/10">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">{scenarios.cleanNow.scenarioName}</h4>
            <span className="p-1 rounded bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-slate-500">{scenarios.cleanNow.description}</p>

          <dl className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            <div>
              <dt className="text-slate-400">Excess Fuel Burn</dt>
              <dd className="font-bold font-mono text-emerald-600 text-sm mt-0.5">
                +{scenarios.cleanNow.excessFuelTons} t
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Net CO₂ Savings</dt>
              <dd className="font-bold font-mono text-emerald-600 text-sm mt-0.5">
                {scenarios.noCleaning.excessCo2Tons - scenarios.cleanNow.excessCo2Tons} t abated
              </dd>
            </div>
            <div className="col-span-2 pt-2">
              <dt className="text-slate-400">Financial Net Benefit</dt>
              <dd className="font-bold font-mono text-emerald-700 text-base mt-0.5">
                +${(scenarios.noCleaning.financialImpactUsd - scenarios.cleanNow.financialImpactUsd).toLocaleString()} USD saved
              </dd>
            </div>
          </dl>
        </div>

        {/* Scenario C: Clean Later */}
        <div className="bg-white rounded-xl border-2 border-blue-200 p-5 shadow-sm space-y-3 relative">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">{scenarios.cleanLater.scenarioName}</h4>
            <span className="p-1 rounded bg-blue-100 text-blue-700">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-slate-500">{scenarios.cleanLater.description}</p>

          <dl className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            <div>
              <dt className="text-slate-400">Excess Fuel Burn</dt>
              <dd className="font-bold font-mono text-blue-600 text-sm mt-0.5">
                +{scenarios.cleanLater.excessFuelTons} t
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Scheduled Port</dt>
              <dd className="font-semibold text-slate-800 text-xs mt-1">
                {scenarios.cleanLater.cleaningDate}
              </dd>
            </div>
            <div className="col-span-2 pt-2">
              <dt className="text-slate-400">Financial Net Benefit</dt>
              <dd className="font-bold font-mono text-blue-700 text-base mt-0.5">
                +${(scenarios.noCleaning.financialImpactUsd - scenarios.cleanLater.financialImpactUsd).toLocaleString()} USD saved
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
