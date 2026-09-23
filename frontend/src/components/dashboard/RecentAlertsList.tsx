import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AlertItem } from '../../types';

interface RecentAlertsListProps {
  alerts: AlertItem[];
}

export const RecentAlertsList: React.FC<RecentAlertsListProps> = ({ alerts }) => {
  const navigate = useNavigate();

  const getBorderColor = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-l-rose-500';
      case 'high':
      case 'warning':
        return 'border-l-amber-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-slate-400';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Alerts</h2>
        <button
          onClick={() => navigate('/fleet')}
          className="text-xs font-semibold text-aqua-600 hover:text-aqua-700 flex items-center space-x-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => navigate(`/vessels/${alert.vesselId}`)}
            className={`border-l-4 ${getBorderColor(
              alert.severity
            )} pl-3 py-1.5 hover:bg-slate-50 rounded-r-lg cursor-pointer transition-colors flex items-center justify-between group`}
          >
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-aqua-600 transition-colors">
                {alert.vesselName}{' '}
                <span className="font-normal text-slate-400 text-[11px]">
                  (IMO {alert.imo})
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{alert.message}</div>
            </div>
            <div className="text-[11px] text-slate-400 whitespace-nowrap ml-3">
              {alert.timeAgo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
