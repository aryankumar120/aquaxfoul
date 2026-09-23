import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WelcomeBanner: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('Last 6 months');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const periods = ['Last 30 days', 'Last 3 months', 'Last 6 months', 'Last 12 months', 'Year to Date'];

  // Current or mock maritime date
  const displayDate = 'Fri, 19 Sep 2026';

  return (
    <div className="relative bg-gradient-to-r from-white via-white to-sky-50/50 rounded-2xl p-6 border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Subtle background cargo ship silhouette */}
      <div className="absolute right-36 bottom-0 top-0 pointer-events-none opacity-15 hidden lg:flex items-center">
        <svg width="280" height="90" viewBox="0 0 280 90" fill="none">
          <path
            d="M10 75H270L250 85H30L10 75Z"
            fill="#0284c7"
          />
          <path
            d="M35 75L45 55H225L235 75H35Z"
            fill="#0369a1"
          />
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
        <div className="text-xs font-medium text-slate-500 hidden sm:block">
          {displayDate}
        </div>

        {/* Period Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg shadow-sm transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{period}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-dropdown border border-slate-200 py-1.5 z-40">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors ${
                    p === period ? 'bg-aqua-50 text-aqua-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
