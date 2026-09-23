import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { VesselFilterParams } from '../../types';

interface FilterBarProps {
  filters: VesselFilterParams;
  onFilterChange: (newFilters: Partial<VesselFilterParams>) => void;
  onReset: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const vesselTypes = [
    'All',
    'Container Ship',
    'Bulk Carrier',
    'General Cargo',
    'LNG Carrier',
    'Cruise',
    'Other',
  ];

  const riskLevels = ['All', 'Low', 'Moderate', 'High', 'Critical'];
  const statuses = ['All', 'Active', 'In Maintenance', 'Anchored'];
  const domiciles = ['All', 'Singapore', 'Cyprus', 'Hong Kong', 'United Kingdom', 'Germany', 'Norway', 'Japan'];

  const hasActiveFilters =
    (filters.search && filters.search.trim() !== '') ||
    (filters.type && filters.type !== 'All') ||
    (filters.foulingRisk && filters.foulingRisk !== 'All') ||
    (filters.status && filters.status !== 'All') ||
    (filters.managerDomicile && filters.managerDomicile !== 'All') ||
    filters.minDwt ||
    filters.maxDwt;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-card card-subtle p-5 space-y-4">
      {/* Top Search & Filter Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            placeholder="Search by vessel name, IMO number, or technical manager..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-aqua-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-aqua-500/20 transition-all text-slate-800"
          />
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-500 font-medium">
            Found <b className="text-slate-900">{totalResults}</b> matching vessels
          </span>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all btn-press font-medium shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
        {/* Type */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Vessel Type
          </label>
          <select
            value={filters.type || 'All'}
            onChange={(e) => onFilterChange({ type: e.target.value, page: 1 })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-aqua-500"
          >
            {vesselTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Level */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Fouling Risk
          </label>
          <select
            value={filters.foulingRisk || 'All'}
            onChange={(e) => onFilterChange({ foulingRisk: e.target.value, page: 1 })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-aqua-500"
          >
            {riskLevels.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Status
          </label>
          <select
            value={filters.status || 'All'}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-aqua-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Manager Domicile */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Manager Domicile
          </label>
          <select
            value={filters.managerDomicile || 'All'}
            onChange={(e) => onFilterChange({ managerDomicile: e.target.value, page: 1 })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-aqua-500"
          >
            {domiciles.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum DWT */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Min DWT (tons)
          </label>
          <input
            type="number"
            placeholder="e.g. 50000"
            value={filters.minDwt || ''}
            onChange={(e) =>
              onFilterChange({
                minDwt: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-aqua-500"
          />
        </div>
      </div>
    </div>
  );
};
