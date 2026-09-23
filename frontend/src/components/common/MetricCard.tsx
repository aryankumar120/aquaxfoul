import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Sparkline } from './Sparkline';

interface MetricCardProps {
  title: string;
  value: string | number;
  changePct: number;
  trend: number[];
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  sparklineColor?: string;
  unit?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  changePct,
  trend,
  icon: Icon,
  iconBgColor = 'bg-emerald-50',
  iconColor = 'text-emerald-600',
  sparklineColor = '#10b981',
}) => {
  const isPositive = changePct >= 0;
  // For 'Requiring Attention', an increase might be displayed with red styling
  const isNegativeContext = iconBgColor.includes('rose') || iconBgColor.includes('red');

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-full ${iconBgColor} ${iconColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-right flex-1 ml-4">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">{title}</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs">
          <span
            className={`font-semibold flex items-center ${
              isNegativeContext ? 'text-rose-600' : isPositive ? 'text-emerald-600' : 'text-slate-600'
            }`}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(changePct)}%
          </span>
          <span className="text-slate-400 font-normal">vs. previous period</span>
        </div>
        <div className="flex items-center">
          <Sparkline data={trend} color={sparklineColor} width={56} height={20} />
        </div>
      </div>
    </div>
  );
};
