import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Vessel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface RecentVesselsTableProps {
  vessels: Vessel[];
}

export const RecentVesselsTable: React.FC<RecentVesselsTableProps> = ({ vessels }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-card card-subtle p-6 flex flex-col justify-between group/card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight group-hover/card:text-aqua-700 transition-colors">
          Recent Vessels
        </h2>
        <button
          onClick={() => navigate('/fleet')}
          className="text-xs font-semibold text-aqua-600 hover:text-aqua-700 flex items-center space-x-1 transition-all duration-200 hover:translate-x-0.5 btn-press"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="pb-3 pr-4 whitespace-nowrap">IMO</th>
              <th className="pb-3 px-4 whitespace-nowrap">Vessel Name</th>
              <th className="pb-3 px-4 whitespace-nowrap">Type</th>
              <th className="pb-3 px-4 whitespace-nowrap">DWT</th>
              <th className="pb-3 px-4 whitespace-nowrap">Current Status</th>
              <th className="pb-3 px-4 whitespace-nowrap">Fouling Risk</th>
              <th className="pb-3 pl-4 whitespace-nowrap">Last Inspection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {vessels.map((v) => (
              <tr
                key={v.id}
                onClick={() => navigate(`/vessels/${v.id}`)}
                className="hover:bg-slate-50/90 cursor-pointer transition-all duration-150 group"
              >
                <td className="py-3.5 pr-4 text-slate-500 font-mono whitespace-nowrap">{v.imo}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-aqua-600 transition-colors whitespace-nowrap">
                  {v.name}
                </td>
                <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{v.type}</td>
                <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                  {v.dwt.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge type="status" value={v.status} />
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge type="risk" value={v.foulingRisk} />
                </td>
                <td className="py-3.5 pl-4 text-slate-500 whitespace-nowrap">{v.lastInspectionDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
