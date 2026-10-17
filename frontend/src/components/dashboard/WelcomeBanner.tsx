import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDateRange } from '../../context/DateRangeContext';

export const WelcomeBanner: React.FC = () => {
  const { user } = useAuth();
  const { period, setPeriod } = useDateRange();

  const pillOptions = [
    { label: '30D', value: 'Last 30 days', title: 'Last 30 days' },
    { label: '3M', value: 'Last 3 months', title: 'Last 3 months' },
    { label: '6M', value: 'Last 6 months', title: 'Last 6 months' },
    { label: '1Y', value: 'Last 12 months', title: 'Last 12 months' },
    { label: 'YTD', value: 'Year to Date', title: 'Year to Date' },
  ];

  return (
    <div className="relative z-10 bg-gradient-to-r from-white via-white to-sky-50/50 rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-card card-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 group">
      {/* Clean subtle ambient gradient backdrop */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none bg-gradient-to-r from-transparent via-transparent to-sky-100/30" />

      {/* Greeting info */}
      <div className="z-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
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


        {/* Inline Segmented Period Switcher (Zero overlap on cards below) */}
        <div className="inline-flex max-w-full overflow-x-auto items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-2xs">
          {pillOptions.map((opt) => {
            const isActive = period === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                title={opt.title}
                onClick={() => setPeriod(opt.value)}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all btn-press ${isActive
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
