import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { vesselApi } from '../../services/vesselApi';
import { Vessel, VesselFilterParams } from '../../types';
import { FilterBar } from '../../components/fleet/FilterBar';
import { VesselTable } from '../../components/fleet/VesselTable';
import { PaginationControls } from '../../components/fleet/PaginationControls';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Ship } from 'lucide-react';

export const FleetPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<VesselFilterParams>({
    search: searchParams.get('search') || '',
    type: 'All',
    category: 'All',
    technicalManager: 'All',
    managerDomicile: 'All',
    status: 'All',
    foulingRisk: 'All',
    page: 1,
    limit: 10,
    sortBy: 'dwt',
    sortOrder: 'desc',
  });

  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVessels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vesselApi.getVessels(filters);
      setVessels(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch vessels from the directory.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVessels();
  }, [fetchVessels]);

  const handleFilterChange = (newFilters: Partial<VesselFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'All',
      category: 'All',
      technicalManager: 'All',
      managerDomicile: 'All',
      status: 'All',
      foulingRisk: 'All',
      page: 1,
      limit: 10,
      sortBy: 'dwt',
      sortOrder: 'desc',
    });
    setSearchParams({});
  };

  const handleSortChange = (column: string) => {
    setFilters((prev) => {
      const isSameColumn = prev.sortBy === column;
      const newOrder = isSameColumn && prev.sortOrder === 'asc' ? 'desc' : 'asc';
      return {
        ...prev,
        sortBy: column,
        sortOrder: newOrder,
        page: 1,
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <Ship className="w-6 h-6 text-aqua-600" />
            <span>Fleet & Vessel Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Searchable and filterable database of commercial vessels under hydrodynamic biofouling supervision.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={total}
      />

      {/* Content State Handling */}
      {loading ? (
        <LoadingSkeleton type="table" rows={10} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchVessels} />
      ) : vessels.length === 0 ? (
        <EmptyState
          title="No vessels found matching your criteria"
          description="Try broadening your search term or resetting your active type/domicile/DWT filters."
          onReset={handleResetFilters}
        />
      ) : (
        <div className="space-y-4">
          <VesselTable
            vessels={vessels}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortChange={handleSortChange}
          />

          <PaginationControls
            page={filters.page || 1}
            limit={filters.limit || 10}
            total={total}
            totalPages={totalPages}
            onPageChange={(page) => handleFilterChange({ page })}
            onLimitChange={(limit) => handleFilterChange({ limit, page: 1 })}
          />
        </div>
      )}
    </div>
  );
};
