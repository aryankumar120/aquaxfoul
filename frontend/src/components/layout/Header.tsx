import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, ChevronDown, LogOut, User as UserIcon, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDateRange } from '../../context/DateRangeContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { period, setPeriod, periods } = useDateRange();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const periodDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target as Node)) {
        setShowPeriodDropdown(false);
      }
    };
    if (showPeriodDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPeriodDropdown]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/fleet?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vessels, IMO, or manager..."
          className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-lg border border-transparent focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-aqua-500/20 transition-all"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Global Period Selector Dropdown in Header */}
        <div className="relative" ref={periodDropdownRef}>
          <button
            type="button"
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-lg border border-slate-200 transition-all btn-press shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{period}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showPeriodDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showPeriodDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-dropdown border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Filter Timeframe
              </div>
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPeriod(p);
                    setShowPeriodDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                    p === period ? 'bg-aqua-50 text-aqua-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => navigate('/fleet')}
          title="Add or Register Vessel"
          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all btn-press shadow-2xs"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-all btn-press shadow-2xs"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-dropdown border border-slate-200 py-3 px-4 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Fleet Alerts</span>
                <span className="text-[11px] text-aqua-600 font-medium cursor-pointer hover:underline" onClick={() => navigate('/dashboard')}>View All</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs py-1">
                <div className="py-2">
                  <div className="font-medium text-rose-600">Pacific Crown (IMO 9012345)</div>
                  <div className="text-slate-500 mt-0.5">High fouling risk detected • 2d ago</div>
                </div>
                <div className="py-2">
                  <div className="font-medium text-amber-600">Sea Voyager (IMO 9345678)</div>
                  <div className="text-slate-500 mt-0.5">Cleaning due in 15 days • 3d ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 pl-2 pr-2 py-1 rounded-lg hover:bg-slate-100 transition-all btn-press text-left"
          >
            <div className="w-9 h-9 rounded-full bg-[#0a1b24] text-white flex items-center justify-center font-semibold text-xs border border-slate-700">
              {user?.initials || 'AK'}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.name || 'Aryan Kumar'}
              </div>
              <div className="text-[11px] text-slate-400 font-normal">
                {user?.role || 'Administrator'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-dropdown border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>Account Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Shield className="w-4 h-4 text-slate-400" />
                <span>Security & API Keys</span>
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button
                onClick={async () => {
                  setShowProfileMenu(false);
                  await logout();
                  navigate('/login');
                }}
                className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
