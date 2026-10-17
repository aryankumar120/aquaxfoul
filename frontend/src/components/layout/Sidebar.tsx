import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ship,
  Waves,
  Droplets,
  LineChart,
  FileText,
  Settings,
  HelpCircle,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [videoError, setVideoError] = useState(false);

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
    <aside className="w-64 bg-[#0a1319] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-[#14232e] select-none z-30 relative overflow-hidden">
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
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Brand Header */}
        <div className="p-6 pb-5 flex items-center space-x-3 border-b border-[#14232e]/60">
          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow-sm">
            <img src="/logo.png" alt="Aqua-X-Foul Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-white font-bold text-lg tracking-tight leading-none flex items-center gap-1">
              Aqua-X-Foul
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1 ${isActive
                  ? 'bg-[#0e3838] text-white shadow-sm border border-[#00c9a7]/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#cfd2d4]/20'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0 text-slate-300" />
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
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1 ${isActive
                  ? 'bg-[#0e3838] text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#cfd2d4]/20'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0 text-slate-400" />
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
