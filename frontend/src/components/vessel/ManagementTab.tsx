import React from 'react';
import { Vessel } from '../../types';
import { Building2, Globe2, FileCheck, ShieldCheck } from 'lucide-react';

export const ManagementTab: React.FC<{ vessel: Vessel }> = ({ vessel }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-2">
          Management & Governance Registry
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Commercial, technical, and regulatory ship management authorities governing this vessel.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/60 space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200/80">
              <Building2 className="w-4 h-4 text-aqua-600" />
              <span>Technical Management Organization</span>
            </div>

            <dl className="space-y-3.5 text-xs">
              <div>
                <dt className="text-slate-400 font-medium">Assigned Technical Manager</dt>
                <dd className="text-sm font-bold text-slate-900 mt-0.5">{vessel.technicalManager}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Corporate Domicile / Jurisdiction</dt>
                <dd className="text-slate-800 font-medium flex items-center gap-1.5 mt-0.5">
                  <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{vessel.managerDomicile}</span>
                </dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Official Registry Identifier</dt>
                <dd className="font-mono text-slate-800 font-semibold mt-0.5">
                  {vessel.managerRegistration}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/60 space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200/80">
              <FileCheck className="w-4 h-4 text-aqua-600" />
              <span>Compliance & Biofouling Management Plan (BMP)</span>
            </div>

            <dl className="space-y-3.5 text-xs">
              <div>
                <dt className="text-slate-400 font-medium">IMO Resolution MEPC.378(80) Status</dt>
                <dd className="text-emerald-700 font-semibold flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Approved Biofouling Record Book Active</span>
                </dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Safety Management (ISM Code)</dt>
                <dd className="text-slate-800 font-medium mt-0.5">DOC / SMC Certified — Valid until Oct 2028</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Designated Superintendent</dt>
                <dd className="text-slate-800 font-medium mt-0.5">Capt. Henrik Lindqvist (Technical Fleet Dir.)</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
