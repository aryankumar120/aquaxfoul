import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ship, MapPin, Gauge, Droplet } from 'lucide-react';
import { Vessel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface VesselHeaderProps {
  vessel: Vessel;
}

export const VesselHeader: React.FC<VesselHeaderProps> = ({ vessel }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-card card-subtle space-y-4 sm:space-y-5">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate('/fleet')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-all btn-press"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Fleet</span>
        </button>
      </div>

      {/* Title & Key Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight break-words">
              {vessel.name.toUpperCase()}
            </h1>
            <span className="text-xs font-mono px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-semibold border border-slate-200">
              IMO {vessel.imo}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              {vessel.type}
            </span>
            <StatusBadge type="status" value={vessel.status} />
            <StatusBadge type="risk" value={vessel.foulingRisk} />
            <span className="text-xs text-slate-400 ml-2">
              Yard No: <b className="text-slate-600 font-mono">{vessel.yardNumber}</b>
            </span>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 self-stretch md:self-auto bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-xl text-xs card-subtle">
          <div>
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <Gauge className="w-3 h-3 text-slate-400" />
              <span>Speed</span>
            </div>
            <div className="font-bold text-slate-800 font-mono mt-0.5">{vessel.speedKnots} kn</div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <Droplet className="w-3 h-3 text-slate-400" />
              <span>Fuel/Day</span>
            </div>
            <div className="font-bold text-slate-800 font-mono mt-0.5">{vessel.fuelConsumptionTonsPerDay} t</div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Route</span>
            </div>
            <div className="font-bold text-slate-800 truncate max-w-[130px] mt-0.5">
              {vessel.currentRoute || 'In Transit'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
