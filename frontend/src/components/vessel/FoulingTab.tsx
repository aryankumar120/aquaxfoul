import React, { useEffect, useState } from 'react';
import { Vessel, FoulingAssessmentRecord, InspectionRecord } from '../../types';
import { vesselApi } from '../../services/vesselApi';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { StatusBadge } from '../common/StatusBadge';
import { Waves, Camera, Eye, Microscope } from 'lucide-react';

export const FoulingTab: React.FC<{ vessel: Vessel }> = ({ vessel }) => {
  const [assessments, setAssessments] = useState<FoulingAssessmentRecord[]>([]);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      vesselApi.getFoulingData(vessel.id),
      vesselApi.getInspections(vessel.id),
    ]).then(([faData, inspData]) => {
      setAssessments(faData);
      setInspections(inspData);
      setLoading(false);
    });
  }, [vessel.id]);

  if (loading) return <LoadingSkeleton rows={4} />;

  return (
    <div className="space-y-6">
      {/* Current Fouling Assessment Status */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card card-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Waves className="w-4 h-4 text-aqua-600" />
              <span>Biofouling Status & Optical Assessment</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Latest hydrodynamic roughness and microfouling classification derived from high-resolution ROV imagery.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Current Risk:</span>
            <StatusBadge type="risk" value={vessel.foulingRisk} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 card-subtle hover:bg-white">
            <span className="text-xs text-slate-400 font-medium">Hull Bio-Coverage</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              {assessments[0]?.foulingCoveragePct || vessel.foulingRating}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Primarily low-drag microbial slime</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 card-subtle hover:bg-white">
            <span className="text-xs text-slate-400 font-medium">Hydrodynamic Roughness (k_s)</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              {assessments[0]?.roughnessMicrons || 85} <span className="text-xs font-normal text-slate-400">μm</span>
            </div>
            <p className="text-[11px] text-emerald-600 mt-1">Normal coating threshold &lt; 150 μm</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 card-subtle hover:bg-white">
            <span className="text-xs text-slate-400 font-medium">Induced Speed Loss</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              -{assessments[0]?.speedLossPct || 0.3}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">ISO 19030 hydrodynamic deviation</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 card-subtle hover:bg-white">
            <span className="text-xs text-slate-400 font-medium">Excess CO₂ Penalty</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              +{assessments[0]?.estimatedCo2PenaltyTons || 12.4} <span className="text-xs font-normal text-slate-400">t</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Calculated for last 30-day voyage</p>
          </div>
        </div>
      </div>

      {/* Historical Fouling Assessments Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card card-subtle">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Microscope className="w-4 h-4 text-slate-600" />
          <span>Historical Biofouling Assessments</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Risk Level</th>
                <th className="py-2.5 px-4">Coverage</th>
                <th className="py-2.5 px-4">Roughness (μm)</th>
                <th className="py-2.5 px-4">Speed Impact</th>
                <th className="py-2.5 px-4">Excess Fuel</th>
                <th className="py-2.5 px-4">Evaluated By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {assessments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/90 transition-all duration-150">
                  <td className="py-3 px-4 font-mono text-slate-600">{a.date}</td>
                  <td className="py-3 px-4">
                    <StatusBadge type="risk" value={a.riskLevel} />
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{a.foulingCoveragePct}%</td>
                  <td className="py-3 px-4 font-mono">{a.roughnessMicrons} μm</td>
                  <td className="py-3 px-4 text-amber-600 font-medium">-{a.speedLossPct}%</td>
                  <td className="py-3 px-4 text-rose-600 font-medium">+{a.excessFuelPct}%</td>
                  <td className="py-3 px-4 text-slate-500">{a.assessedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Underwater Inspection Records */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card card-subtle">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Camera className="w-4 h-4 text-slate-600" />
          <span>Underwater Drone / Diver Inspection Log</span>
        </h3>

        <div className="space-y-3">
          {inspections.map((insp) => (
            <div key={insp.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 text-xs card-subtle hover:bg-white hover:border-slate-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-slate-900">{insp.type}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-mono text-slate-500">{insp.date}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">{insp.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 font-medium">Hull Score:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {insp.hullRating} / 100
                  </span>
                </div>
              </div>

              <div className="mt-2 text-slate-600">
                <span className="font-semibold text-slate-700">Findings: </span>
                {insp.findings}
              </div>

              <div className="mt-2 pt-2 flex items-center justify-between text-slate-500 text-[11px]">
                <span>Surveyor: <b className="text-slate-700">{insp.inspector}</b></span>
                <span>Propeller: <b className="text-slate-700">{insp.propellerCondition}</b></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
