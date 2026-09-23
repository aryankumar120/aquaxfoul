import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { vesselApi } from '../../services/vesselApi';
import { Vessel } from '../../types';
import { VesselHeader } from '../../components/vessel/VesselHeader';
import { OverviewTab } from '../../components/vessel/OverviewTab';
import { TechnicalTab } from '../../components/vessel/TechnicalTab';
import { ManagementTab } from '../../components/vessel/ManagementTab';
import { PerformanceTab } from '../../components/vessel/PerformanceTab';
import { FoulingTab } from '../../components/vessel/FoulingTab';
import { CleaningTab } from '../../components/vessel/CleaningTab';
import { ProjectionsTab } from '../../components/vessel/ProjectionsTab';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';

type TabKey =
  | 'overview'
  | 'technical'
  | 'management'
  | 'performance'
  | 'fouling'
  | 'cleaning'
  | 'projections';

export const VesselDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get('tab') as TabKey) || 'overview';

  const [vessel, setVessel] = useState<Vessel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVessel = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await vesselApi.getVessel(id);
      setVessel(data);
    } catch (err: any) {
      setError(err?.message || 'Unable to load vessel details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVessel();
  }, [id]);

  const handleTabChange = (tab: TabKey) => {
    setSearchParams({ tab });
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'technical', label: 'Technical' },
    { key: 'management', label: 'Management' },
    { key: 'performance', label: 'Performance' },
    { key: 'fouling', label: 'Fouling' },
    { key: 'cleaning', label: 'Cleaning' },
    { key: 'projections', label: 'Projections' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton rows={3} />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error || !vessel) {
    return <ErrorState message={error || undefined} onRetry={fetchVessel} />;
  }

  return (
    <div className="space-y-6">
      {/* Vessel Header */}
      <VesselHeader vessel={vessel} />

      {/* Tabs Navigation Bar matching PDF structure */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 pt-1 shadow-sm">
        <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-aqua-500 text-aqua-700 bg-aqua-50/30'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}
      <div>
        {currentTab === 'overview' && <OverviewTab vessel={vessel} />}
        {currentTab === 'technical' && <TechnicalTab vessel={vessel} />}
        {currentTab === 'management' && <ManagementTab vessel={vessel} />}
        {currentTab === 'performance' && <PerformanceTab vessel={vessel} />}
        {currentTab === 'fouling' && <FoulingTab vessel={vessel} />}
        {currentTab === 'cleaning' && <CleaningTab vessel={vessel} />}
        {currentTab === 'projections' && <ProjectionsTab vessel={vessel} />}
      </div>
    </div>
  );
};
