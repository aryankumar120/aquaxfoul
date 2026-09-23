import React from 'react';
import { FoulingRiskLevel, VesselStatus } from '../../types';

interface StatusBadgeProps {
  type: 'risk' | 'status';
  value: FoulingRiskLevel | VesselStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, className = '' }) => {
  if (type === 'risk') {
    const risk = value as FoulingRiskLevel;
    let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';

    if (risk === 'Moderate') {
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (risk === 'High') {
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
    } else if (risk === 'Critical') {
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 ${colorClasses} ${className}`}
      >
        {risk}
      </span>
    );
  }

  // Vessel Status Badge
  const status = value as VesselStatus;
  let statusClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (status === 'In Maintenance') {
    statusClasses = 'bg-slate-100 text-slate-700 border-slate-300';
  } else if (status === 'Anchored') {
    statusClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (status === 'Dry Dock') {
    statusClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 ${statusClasses} ${className}`}
    >
      {status}
    </span>
  );
};
