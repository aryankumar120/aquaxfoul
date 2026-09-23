import React from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDateRange } from '../../context/DateRangeContext';

export const WelcomeBanner: React.FC = () => {
  const { user } = useAuth();
  const { period, setPeriod } = useDateRange();

  const displayDate = 'Fri, 19 Sep 2026';

  const pillOptions = [
    { label: '30D', value: 'Last 30 days', title: 'Last 30 days' },
    { label: '3M', value: 'Last 3 months', title: 'Last 3 months' },
    { label: '6M', value: 'Last 6 months', title: 'Last 6 months' },
    { label: '1Y', value: 'Last 12 months', title: 'Last 12 months' },
    { label: 'YTD', value: 'Year to Date', title: 'Year to Date' },
  ];

  return (
    <div className="relative z-10 bg-gradient-to-r from-white via-white to-sky-50/50 rounded-2xl p-6 border border-slate-200/90 shadow-card card-subtle flex flex-col md:flex-row md:items-center justify-between gap-6 group">
      {/* Background decorations safely clipped to rounded corners */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        {/* Subtle background cargo ship silhouette with gentle hover parallax */}
        <div className="absolute right-36 bottom-0 top-0 opacity-15 hidden lg:flex items-center group-hover:translate-x-1 transition-transform duration-500 ease-out">
          <svg width="280" height="90" viewBox="0 0 280 90" fill="none">
            <path d="M10 75H270L250 85H30L10 75Z" fill="#0284c7" />
            <path d="M35 75L45 55H225L235 75H35Z" fill="#0369a1" />
            <rect x="55" y="38" width="18" height="17" rx="1" fill="#00c9a7" />
            <rect x="76" y="38" width="18" height="17" rx="1" fill="#0284c7" />
            <rect x="97" y="38" width="18" height="17" rx="1" fill="#f97316" />
            <rect x="118" y="38" width="18" height="17" rx="1" fill="#00c9a7" />
            <rect x="139" y="38" width="18" height="17" rx="1" fill="#0284c7" />
            <rect x="160" y="38" width="18" height="17" rx="1" fill="#3b82f6" />
            <rect x="195" y="24" width="26" height="31" rx="2" fill="#334155" />
            <rect x="202" y="14" width="6" height="10" fill="#64748b" />
          </svg>
        </div>
      </div>

      {/* Greeting info */}
      <div className="z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Good morning, {user?.name?.split(' ')[0] || 'Aryan'}
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Here's an overview of your fleet and biofouling status.
        </p>
      </div>

      {/* Date & Period controls */}
      <div className="z-10 flex flex-wrap items-center gap-4 self-start md:self-auto">
        {/* Subtle tagline */}
        <div className="hidden xl:block text-right pr-2">
          <div className="text-xs font-semibold text-slate-600">
            Cleaner Vessels.
          </div>
          <div className="text-xs text-aqua-600 font-medium">
            Greener Oceans.
          </div>
        </div>

        {/* Date string */}
        <div className="text-xs font-medium text-slate-500 hidden sm:flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{displayDate}</span>
        </div>

        {/* Inline Segmented Period Switcher (Zero overlap on cards below) */}
        <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-2xs">
          {pillOptions.map((opt) => {
            const isActive = period === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                title={opt.title}
                onClick={() => setPeriod(opt.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all btn-press ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-bold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
