import React from 'react';
import { HelpCircle, BookOpen, ExternalLink, LifeBuoy, FileCode2 } from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
          <HelpCircle className="w-6 h-6 text-aqua-600" />
          <span>Documentation & Support Center</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Technical specifications, biofouling standard guidelines, and operating procedures for Aqua-X-Foul.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-aqua-50 text-aqua-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">IMO Biofouling Guidelines (MEPC.378(80))</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Guidance for the control and management of ships' biofouling to minimize the transfer of invasive aquatic species and curb excess greenhouse gas emissions.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <FileCode2 className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">FastAPI Backend Integration</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            REST API endpoints for vessel telemetry ingestion, optical AI biofouling scoring, and hydrodynamic drag calculations.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <LifeBuoy className="w-4 h-4 text-aqua-600" />
          <span>Operational Support & Contact</span>
        </h2>
        <p className="text-xs text-slate-500">
          For technical fleet inquiries or support regarding Aqua-X-Foul deployments:
        </p>
        <div className="text-xs font-mono text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
          Email: <b className="text-slate-900">aquaxfoul@gmail.com</b>
        </div>
      </div>
    </div>
  );
};
