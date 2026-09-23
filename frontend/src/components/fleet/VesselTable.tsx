import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, Eye } from 'lucide-react';
import { Vessel, VesselFilterParams } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface VesselTableProps {
  vessels: Vessel[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (column: string) => void;
}

export const VesselTable: React.FC<VesselTableProps> = ({
  vessels,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const navigate = useNavigate();

  const renderSortIndicator = (columnKey: string) => {
    const isActive = sortBy === columnKey;
    return (
      <ArrowUpDown
        className={`w-3.5 h-3.5 inline ml-1 transition-opacity ${
          isActive ? 'opacity-100 text-aqua-600' : 'opacity-40 group-hover:opacity-75'
        }`}
      />
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <th
                onClick={() => onSortChange('imo')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 group select-none"
              >
                IMO {renderSortIndicator('imo')}
              </th>
              <th
                onClick={() => onSortChange('name')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 group select-none"
              >
                Vessel Name {renderSortIndicator('name')}
              </th>
              <th
                onClick={() => onSortChange('type')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 group select-none"
              >
                Type {renderSortIndicator('type')}
              </th>
              <th className="py-3 px-4 select-none">Technical Manager</th>
              <th className="py-3 px-4 select-none">Domicile</th>
              <th
                onClick={() => onSortChange('dwt')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 group select-none"
              >
                DWT {renderSortIndicator('dwt')}
              </th>
              <th
                onClick={() => onSortChange('status')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 group select-none"
              >
                Status {renderSortIndicator('status')}
              </th>
              <th
                onClick={() => onSortChange('foulingRisk')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 group select-none"
              >
                Fouling Risk {renderSortIndicator('foulingRisk')}
              </th>
              <th className="py-3 px-4 select-none">Last Inspection</th>
              <th className="py-3 px-4 text-right select-none">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {vessels.map((v) => (
              <tr
                key={v.id}
                onClick={() => navigate(`/vessels/${v.id}`)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <td className="py-3 px-4 text-slate-500 font-mono">{v.imo}</td>
                <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-aqua-600 transition-colors">
                  {v.name}
                </td>
                <td className="py-3 px-4 text-slate-600">{v.type}</td>
                <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{v.technicalManager}</td>
                <td className="py-3 px-4 text-slate-500">{v.managerDomicile}</td>
                <td className="py-3 px-4 font-mono text-slate-700">{v.dwt.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <StatusBadge type="status" value={v.status} />
                </td>
                <td className="py-3 px-4">
                  <StatusBadge type="risk" value={v.foulingRisk} />
                </td>
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{v.lastInspectionDate}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/vessels/${v.id}`);
                    }}
                    className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                    title="View Vessel Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
