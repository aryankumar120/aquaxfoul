import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Ship,
  Waves,
  Droplets,
  LineChart,
  FileText,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navLinkClass = (isActive: boolean) =>
  `nav-link group flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
    isActive
      ? 'is-active bg-[#0e3838] text-white shadow-sm border-[#00c9a7]/20 font-semibold'
      : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-[#cfd2d4]/15'
  }`;

export const Sidebar: React.FC<SidebarProps> = ({ open = false, onClose }) => {
  const [videoError, setVideoError] = useState(false);
  const { pathname } = useLocation();

  const mainNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Fleet', path: '/fleet', icon: Ship },
    { label: 'Fouling', path: '/fouling', icon: Waves },
    { label: 'Cleaning', path: '/cleaning', icon: Droplets },
    { label: 'Projections', path: '/projections', icon: LineChart },
    { label: 'Reports', path: '/reports', icon: FileText },
  ];

  const secondaryNavItems = [
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Help', path: '/help', icon: HelpCircle },
  ];

  return (
    <aside
      id="app-sidebar"
      aria-label="Primary navigation"
      className={`w-64 max-w-[85vw] bg-[#0a1319] text-slate-300 flex flex-col justify-between shrink-0 border-r border-[#14232e] select-none overflow-hidden
        fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl
        lg:sticky lg:top-0 lg:h-screen lg:z-30 lg:translate-x-0 lg:shadow-none
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Full Sidebar Looping Video Background */}
      {!videoError && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen pointer-events-none z-0"
        >
          <source src="/videos/ocean.mp4" type="video/mp4" />
        </video>
      )}

      {/* Dark Oceanic Overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1319]/90 via-[#0a1319]/75 to-[#071017]/95 pointer-events-none z-0" />

      {/* Top Header & Navigation Links */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 sm:p-6 pb-5 flex items-center justify-between border-b border-[#14232e]/60">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow-sm">
              <img src="/logo.png" alt="Aqua-X-Foul Logo" className="w-full h-full object-cover" />
            </div>
            <div className="text-white font-bold text-lg tracking-tight leading-none truncate">
              Aqua-X-Foul
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="px-3 py-4 space-y-1" aria-label="Main">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                navLinkClass(isActive || (item.path === '/fleet' && pathname.startsWith('/vessels')))
              }
            >
              <item.icon className="nav-icon w-4 h-4 shrink-0 text-slate-300" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Divider & Secondary Nav */}
        <div className="px-4 py-2">
          <div className="h-px bg-[#14232e]" />
        </div>
        <div className="px-3 py-1 space-y-1">
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => navLinkClass(isActive)}
            >
              <item.icon className="nav-icon w-4 h-4 shrink-0 text-slate-400" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Ocean Banner Card at Bottom */}
      <div className="relative z-10 p-3 m-3 mt-auto rounded-xl overflow-hidden border border-[#1a3344] hover:border-[#00c9a7]/40 bg-[#0c1a24]/85 backdrop-blur-sm shadow-inner group card-subtle">
        <div className="p-2">
          <div className="h-1 w-6 bg-[#00c9a7] rounded mb-2 transition-all duration-300 group-hover:w-10" />
          <p className="text-xs font-semibold text-slate-200 leading-snug">
            Sustainable Shipping
          </p>
          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
            for a Cleaner Tomorrow
          </p>
        </div>
      </div>
    </aside>
  );
};
