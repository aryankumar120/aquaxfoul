import React, { useState } from 'react';
import { Droplet, Calendar, CheckCircle2, Clock, DollarSign, Leaf } from 'lucide-react';
import { mockCleanings } from '../../mocks/mockDetails';

export const CleaningPage: React.FC = () => {
  const [filterType, setFilterType] = useState('All');

  const filteredCleanings = mockCleanings.filter((c) => {
    if (filterType === 'All') return true;
    return c.status === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
          <Droplet className="w-6 h-6 text-aqua-600" />
          <span>Cleaning Operations & Dry Dock Registry</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Hull grooming logs, robotic ROV cleanings, propeller hydro-polishing, and dry dock abrasive blasting history.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-600">
            <Clock className="w-4 h-4" />
            <span>Cleanings Due (30 Days)</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">26</div>
          <p className="text-[11px] text-slate-400 mt-1">Vessels at high fuel penalty threshold</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed This Year</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">54</div>
          <p className="text-[11px] text-slate-400 mt-1">Across 18 global deepwater ports</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span>Cumulative CO₂ Abated</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">14,280 t</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">~3,800 t fuel saved</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span>Average Service Cost</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">$34,500</div>
          <p className="text-[11px] text-slate-400 mt-1">In-water ROV grooming average</p>
        </div>
      </div>

      {/* Main List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Comprehensive Cleaning Records
          </h2>
          <div className="flex items-center space-x-2 text-xs">
            {['All', 'Completed', 'Scheduled'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterType(s)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterType === s
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredCleanings.map((c) => (
            <div key={c.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{c.method}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        c.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Location: <b className="text-slate-700">{c.location}</b> • Contractor: {c.provider}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-slate-500">{c.date}</span>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                    ${c.costUsd.toLocaleString()} USD
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Before Score</span>
                  <span className="font-mono font-bold text-rose-600 text-sm mt-0.5 inline-block">
                    {c.beforeRating} / 100
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">After Score</span>
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
                  <span className="text-slate-400 block text-[11px]">CO₂ Abated</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 inline-block">
                    {c.co2SavedTonsEst.toLocaleString()} t
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
