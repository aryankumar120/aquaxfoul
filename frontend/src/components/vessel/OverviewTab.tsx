import React from 'react';
import { Vessel } from '../../types';
import { ShieldCheck, Anchor, Compass } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const OverviewTab: React.FC<{ vessel: Vessel }> = ({ vessel }) => {
  return (
    <div className="space-y-6">
      {/* Biofouling Health Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card card-subtle">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-aqua-600" />
          <span>Biofouling Operational Condition</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 card-subtle">
            <span className="text-xs text-slate-500 font-medium">Biofouling Index</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-1">
              <span>{vessel.foulingRating}%</span>
              <span className="text-xs font-normal text-slate-400">coverage</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  vessel.foulingRating > 60
                    ? 'bg-rose-500'
                    : vessel.foulingRating > 30
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${vessel.foulingRating}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 card-subtle">
            <span className="text-xs text-slate-500 font-medium">Assessed Risk Tier</span>
            <div className="mt-2">
              <StatusBadge type="risk" value={vessel.foulingRisk} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Based on continuous hydrodynamic optical and sensor telemetry.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 card-subtle">
            <span className="text-xs text-slate-500 font-medium">Last Inspection</span>
            <div className="text-base font-bold text-slate-800 mt-1 font-mono">
              {vessel.lastInspectionDate}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Verified via underwater drone video.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 card-subtle">
            <span className="text-xs text-slate-500 font-medium">Next Cleaning Target</span>
            <div className="text-base font-bold text-slate-800 mt-1 font-mono">
              {vessel.nextCleaningDueDate}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Optimal window before excess fuel penalty.</p>
          </div>
        </div>
      </div>

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identification */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card card-subtle">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
            <Anchor className="w-4 h-4 text-slate-600" />
            <span>Vessel Identification</span>
          </h3>
          <dl className="grid grid-cols-2 gap-y-3.5 text-xs">
            <dt className="text-slate-500">Official Ship Name</dt>
            <dd className="font-semibold text-slate-800">{vessel.name}</dd>

            <dt className="text-slate-500">IMO Identification</dt>
            <dd className="font-mono font-semibold text-slate-800">{vessel.imo}</dd>

            <dt className="text-slate-500">Yard Hull Number</dt>
            <dd className="font-mono text-slate-700">{vessel.yardNumber}</dd>

            <dt className="text-slate-500">Flag State</dt>
            <dd className="text-slate-700">{vessel.flag}</dd>

            <dt className="text-slate-500">Year of Commission</dt>
            <dd className="font-mono text-slate-700">{vessel.builtYear}</dd>

            <dt className="text-slate-500">Operational Category</dt>
            <dd className="text-slate-700">{vessel.category}</dd>
          </dl>
        </div>

        {/* Capacity Particulars */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card card-subtle">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
            <Compass className="w-4 h-4 text-slate-600" />
            <span>Capacities & Dimensions</span>
          </h3>
          <dl className="grid grid-cols-2 gap-y-3.5 text-xs">
            <dt className="text-slate-500">Deadweight Tonnage (DWT)</dt>
            <dd className="font-mono font-semibold text-slate-800">{vessel.dwt.toLocaleString()} t</dd>

            <dt className="text-slate-500">Gross Tonnage (GT)</dt>
            <dd className="font-mono text-slate-700">{vessel.gt.toLocaleString()} t</dd>

            {vessel.teu && (
              <>
                <dt className="text-slate-500">Nominal TEU</dt>
                <dd className="font-mono text-slate-700">{vessel.teu.toLocaleString()} TEU</dd>
              </>
            )}

            {vessel.teu14 && (
              <>
                <dt className="text-slate-500">Homogenous TEU (14t)</dt>
                <dd className="font-mono text-slate-700">{vessel.teu14.toLocaleString()} TEU</dd>
              </>
            )}

            <dt className="text-slate-500">Length Overall (LOA)</dt>
            <dd className="font-mono text-slate-700">{vessel.lengthMeters} m</dd>

            <dt className="text-slate-500">Moulded Beam</dt>
            <dd className="font-mono text-slate-700">{vessel.beamMeters} m</dd>

            <dt className="text-slate-500">Maximum Draft</dt>
            <dd className="font-mono text-slate-700">{vessel.draftMeters} m</dd>
          </dl>
        </div>
      </div>
    </div>
  );
};
