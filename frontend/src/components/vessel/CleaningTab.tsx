import React, { useEffect, useState } from 'react';
import { Vessel, CleaningEvent } from '../../types';
import { vesselApi } from '../../services/vesselApi';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { Droplet, DollarSign, Leaf, Sparkles, CheckCircle2 } from 'lucide-react';

export const CleaningTab: React.FC<{ vessel: Vessel }> = ({ vessel }) => {
  const [cleanings, setCleanings] = useState<CleaningEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vesselApi.getCleaningHistory(vessel.id).then((data) => {
      setCleanings(data);
      setLoading(false);
    });
  }, [vessel.id]);

  if (loading) return <LoadingSkeleton rows={3} />;

  return (
    <div className="space-y-6">
      {/* Cleaning Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card card-hover cursor-default flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-aqua-50 text-aqua-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Efficiency Restoration</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">+12.8%</div>
            <div className="text-[11px] text-emerald-600">Average hydrodynamic gain</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card card-hover cursor-default flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">CO₂ Abated via Cleanings</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">1,760 t</div>
            <div className="text-[11px] text-slate-500">Cumulative lifecycle savings</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card card-hover cursor-default flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Cleaning Return on Investment</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">3.4x ROI</div>
            <div className="text-[11px] text-slate-500">Net fuel savings payback</div>
          </div>
        </div>
      </div>

      {/* Cleaning History Records */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-card card-subtle p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Droplet className="w-4 h-4 text-aqua-600" />
          <span>Hull Cleaning & Propeller Polishing Log</span>
        </h3>

        <div className="space-y-4">
          {cleanings.map((c) => (
            <div key={c.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 text-xs space-y-3 card-subtle hover:bg-white hover:border-slate-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{c.method}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      {c.status}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-1">
                    Executed at <b className="text-slate-800">{c.location}</b> by{' '}
                    <span className="text-slate-700 font-medium">{c.provider}</span>
                  </div>
                </div>

                <div className="text-right self-start sm:self-auto">
                  <div className="font-mono text-slate-500">{c.date}</div>
                  <div className="text-slate-900 font-bold font-mono text-sm mt-0.5">
                    ${c.costUsd.toLocaleString()} USD
                  </div>
                </div>
              </div>

              {/* Before and after scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                <div>
                  <span className="text-slate-400 block text-[11px]">Before Assessment</span>
                  <span className="font-mono font-bold text-rose-600 text-sm mt-0.5 inline-block">
                    {c.beforeRating} / 100
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">After Assessment</span>
                  <span className="font-mono font-bold text-emerald-600 text-sm mt-0.5 inline-block">
                    {c.afterRating} / 100
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Hydrodynamic Recovery</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 inline-block">
                    +{c.efficiencyGainPct}%
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Est. CO₂ Avoided</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 inline-block">
                    {c.co2SavedTonsEst.toLocaleString()} tons
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
