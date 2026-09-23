import React from 'react';
import { Vessel } from '../../types';
import { Layers, Settings2, Cpu, Wrench } from 'lucide-react';

export const TechnicalTab: React.FC<{ vessel: Vessel }> = ({ vessel }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-2">
          Structured Vessel Particulars
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Standardized naval architectural telemetry and technical specifications as recorded by classification societies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Group 1: Identification */}
          <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/60">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-200/80">
              <Layers className="w-4 h-4 text-aqua-600" />
              <span>Identification</span>
            </div>
            <dl className="space-y-3 text-xs">
              <div>
                <dt className="text-slate-400 font-medium">IMO Number</dt>
                <dd className="font-mono font-bold text-slate-900 text-sm mt-0.5">{vessel.imo}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Yard Build Number</dt>
                <dd className="font-mono text-slate-800 font-medium mt-0.5">{vessel.yardNumber}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Flag State Registry</dt>
                <dd className="text-slate-800 font-medium mt-0.5">{vessel.flag}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Classification Society</dt>
                <dd className="text-slate-800 font-medium mt-0.5">DNV / Lloyds Register</dd>
              </div>
            </dl>
          </div>

          {/* Group 2: Capacity & Tonnage */}
          <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/60">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-200/80">
              <Settings2 className="w-4 h-4 text-aqua-600" />
              <span>Capacity & Parameters</span>
            </div>
            <dl className="space-y-3 text-xs">
              <div>
                <dt className="text-slate-400 font-medium">Deadweight Tonnage (DWT)</dt>
                <dd className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                  {vessel.dwt.toLocaleString()} t
                </dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Gross Tonnage (GT)</dt>
                <dd className="font-mono text-slate-800 font-medium mt-0.5">
                  {vessel.gt.toLocaleString()} t
                </dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Container Capacity (TEU)</dt>
                <dd className="font-mono text-slate-800 font-medium mt-0.5">
                  {vessel.teu ? `${vessel.teu.toLocaleString()} TEU` : 'N/A (Bulk/Tanker)'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">TEU 14 (Homogenous)</dt>
                <dd className="font-mono text-slate-800 font-medium mt-0.5">
                  {vessel.teu14 ? `${vessel.teu14.toLocaleString()} TEU` : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Group 3: Engineering & Coating */}
          <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/60">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-200/80">
              <Wrench className="w-4 h-4 text-aqua-600" />
              <span>Hull & Propulsion</span>
            </div>
            <dl className="space-y-3 text-xs">
              <div>
                <dt className="text-slate-400 font-medium">Antifouling Coating Type</dt>
                <dd className="text-slate-900 font-semibold mt-0.5">Fluoropolymer Foul-Release (FRC)</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Coating Manufacturer</dt>
                <dd className="text-slate-800 font-medium mt-0.5">Jotun SeaQuantum Ultra S</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Main Engine Specifications</dt>
                <dd className="text-slate-800 font-medium mt-0.5">MAN B&W 8G95ME-C9.5 (48,200 kW)</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Propeller Geometry</dt>
                <dd className="text-slate-800 font-medium mt-0.5">Fixed Pitch 6-Blade Ni-Al-Bronze</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
