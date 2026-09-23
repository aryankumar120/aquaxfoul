import React, { useState } from 'react';
import { Anchor, Compass, Info, Radio, ShieldCheck, Wind } from 'lucide-react';

interface MarineBackgroundProps {
  defaultOpacity?: number; // 0.3 to 0.4
}

export const MarineBackground: React.FC<MarineBackgroundProps> = ({ defaultOpacity = 0.35 }) => {
  const [opacity, setOpacity] = useState<number>(defaultOpacity);
  const [speedFast, setSpeedFast] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hoveredContainer, setHoveredContainer] = useState<string | null>(null);
  const [showShipTelemetry, setShowShipTelemetry] = useState<boolean>(false);
  const [buoyClicked, setBuoyClicked] = useState<boolean>(false);

  // Container stack specifications for the vessel
  const containers = [
    // Bottom row
    { id: 'C1', x: 70, y: 56, w: 22, h: 14, color: '#0284c7', label: 'AX-101 • Eco Bio-Paint' },
    { id: 'C2', x: 94, y: 56, w: 22, h: 14, color: '#00c9a7', label: 'AX-102 • Clean Hull Sensors' },
    { id: 'C3', x: 118, y: 56, w: 22, h: 14, color: '#f97316', label: 'AX-103 • Silicon Coating' },
    { id: 'C4', x: 142, y: 56, w: 22, h: 14, color: '#2563eb', label: 'AX-104 • Ultrasonic Transducers' },
    { id: 'C5', x: 166, y: 56, w: 22, h: 14, color: '#059669', label: 'AX-105 • Hydrogel FRC' },
    { id: 'C6', x: 190, y: 56, w: 22, h: 14, color: '#334155', label: 'AX-106 • High-Density Reefer' },
    { id: 'C7', x: 214, y: 56, w: 22, h: 14, color: '#0284c7', label: 'AX-107 • AIS Telemetry Gear' },
    { id: 'C8', x: 238, y: 56, w: 22, h: 14, color: '#00c9a7', label: 'AX-108 • Fuel Flow Monitors' },
    { id: 'C9', x: 262, y: 56, w: 22, h: 14, color: '#f97316', label: 'AX-109 • Cavitation Cleaner' },

    // Middle row
    { id: 'C10', x: 94, y: 40, w: 22, h: 14, color: '#059669', label: 'AX-201 • Bio-Robotics' },
    { id: 'C11', x: 118, y: 40, w: 22, h: 14, color: '#0284c7', label: 'AX-202 • Drone Inspection' },
    { id: 'C12', x: 142, y: 40, w: 22, h: 14, color: '#334155', label: 'AX-203 • Spare Propeller Blades' },
    { id: 'C13', x: 166, y: 40, w: 22, h: 14, color: '#00c9a7', label: 'AX-204 • Anti-Fouling Lab' },
    { id: 'C14', x: 190, y: 40, w: 22, h: 14, color: '#f97316', label: 'AX-205 • Water Sampling Kit' },
    { id: 'C15', x: 214, y: 40, w: 22, h: 14, color: '#2563eb', label: 'AX-206 • Fleet Route Logs' },
    { id: 'C16', x: 238, y: 40, w: 22, h: 14, color: '#059669', label: 'AX-207 • IMO Compliance Logs' },

    // Top row
    { id: 'C17', x: 118, y: 24, w: 22, h: 14, color: '#00c9a7', label: 'AX-301 • Green Marine TEU' },
    { id: 'C18', x: 142, y: 24, w: 22, h: 14, color: '#f97316', label: 'AX-302 • Biofouling Sensors' },
    { id: 'C19', x: 166, y: 24, w: 22, h: 14, color: '#0284c7', label: 'AX-303 • Low-Carbon Biofuel' },
    { id: 'C20', x: 190, y: 24, w: 22, h: 14, color: '#059669', label: 'AX-304 • Sonic Transceiver' },
    { id: 'C21', x: 214, y: 24, w: 22, h: 14, color: '#334155', label: 'AX-305 • Ballast Water Units' },
  ];

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Ocean Depth Horizon Gradient & Subtle Currents */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-sky-200/25 via-sky-100/10 to-transparent pointer-events-none" />

      {/* Gentle stylized ambient sea wave lines */}
      <div className="absolute inset-x-0 bottom-14 h-12 overflow-hidden opacity-40">
        <svg className="w-[200%] h-full animate-marine-wake" viewBox="0 0 1200 48" preserveAspectRatio="none" fill="none">
          <path
            d="M0 24 Q 75 10, 150 24 T 300 24 T 450 24 T 600 24 T 750 24 T 900 24 T 1050 24 T 1200 24"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <path
            d="M0 32 Q 75 18, 150 32 T 300 32 T 450 32 T 600 32 T 750 32 T 900 32 T 1050 32 T 1200 32"
            stroke="#00c9a7"
            strokeWidth="1"
            strokeDasharray="8 8"
          />
        </svg>
      </div>

      {/* Interactive Anchored Oceanic Sensor Buoy */}
      <div
        className="absolute bottom-24 right-1/4 pointer-events-auto cursor-pointer group"
        onClick={() => setBuoyClicked(!buoyClicked)}
        title="Offshore Biofouling Monitoring Buoy #14"
      >
        <div className="animate-buoy-bob flex flex-col items-center">
          {/* Buoy beacon pulse */}
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-ping mb-1" />
          <svg width="24" height="34" viewBox="0 0 24 34" fill="none">
            <path d="M12 2V12M8 12H16M6 18H18L15 28H9L6 18Z" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="18" r="4" fill="#f97316" />
            <path d="M4 28C8 30 16 30 20 28" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {/* Subtle water ring */}
          <div className="w-8 h-2 rounded-full border border-sky-400/40 animate-pulse mt-0.5" />
        </div>

        {/* Hover / Click telemetry badge for Buoy */}
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-slate-900/90 text-white text-[11px] rounded-lg shadow-xl backdrop-blur-md border border-slate-700 pointer-events-none transition-all duration-200 ${
            buoyClicked ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
            <Radio className="w-3.5 h-3.5" />
            <span>Offshore Buoy #14</span>
          </div>
          <div className="space-y-0.5 text-slate-300">
            <div>Water Temp: <span className="text-white font-medium">19.4°C</span></div>
            <div>Salinity: <span className="text-white font-medium">35.2 PSU</span></div>
            <div>Bio-Activity: <span className="text-emerald-300 font-medium">Low (Safe)</span></div>
          </div>
        </div>
      </div>

      {/* Main Sailing Marine Vessel & Containers */}
      <div
        className={`absolute bottom-16 left-0 pointer-events-auto transition-transform ${
          speedFast ? 'animate-marine-sail-fast' : 'animate-marine-sail'
        }`}
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        <div
          className="relative animate-marine-bob cursor-pointer"
          onMouseEnter={() => setShowShipTelemetry(true)}
          onMouseLeave={() => setShowShipTelemetry(false)}
        >
          {/* Vessel AIS Hover HUD Telemetry Card */}
          <div
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 p-3 bg-slate-900/95 text-white rounded-xl shadow-2xl backdrop-blur-md border border-sky-500/40 pointer-events-auto transition-all duration-300 ${
              showShipTelemetry ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <Anchor className="w-4 h-4 text-aqua-400" />
                <span className="font-bold text-xs tracking-wider text-white">M/V AQUA GUARDIAN</span>
              </div>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-semibold rounded">
                AIS ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-300 mb-2">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Speed Over Ground</span>
                <span className="font-semibold text-white">{speedFast ? '24.2 kts' : '17.8 kts'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Heading / Course</span>
                <span className="font-semibold text-white">084° ENE</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Biofouling Index</span>
                <span className="font-semibold text-emerald-400">4.2% (Optimal)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Coating Type</span>
                <span className="font-semibold text-sky-300">FRC Silicone</span>
              </div>
            </div>

            {hoveredContainer && (
              <div className="mt-1.5 pt-1.5 border-t border-slate-700/60 flex items-center gap-1.5 text-[10px] text-amber-300">
                <Info className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{hoveredContainer}</span>
              </div>
            )}

            <div className="mt-2 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="hover:text-aqua-300 underline"
              >
                {isPaused ? '▶ Resume Cruise' : '⏸ Pause Vessel'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSpeedFast(!speedFast);
                }}
                className="hover:text-aqua-300 underline"
              >
                {speedFast ? '⚡ Fast Speed' : '🚢 Normal Speed'}
              </button>
            </div>
          </div>

          {/* SVG Marine Container Vessel */}
          <svg
            width="420"
            height="115"
            viewBox="0 0 420 115"
            fill="none"
            className="drop-shadow-[0_8px_16px_rgba(2,132,199,0.15)]"
          >
            {/* Stern Wake & Water Dispersal Lines */}
            <g className="animate-marine-wake">
              <path d="M0 98 C 25 96, 50 102, 75 99" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 4" />
              <path d="M15 104 C 45 102, 70 106, 95 103" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 6" />
              <path d="M30 110 C 60 108, 90 112, 120 109" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 8" />
            </g>

            {/* Vessel Hull - Bulbous bow and streamlined marine architecture */}
            {/* Keel & Underwater hull with anti-fouling red/copper line */}
            <path
              d="M45 92 L70 108 H360 L388 95 L405 92 H45Z"
              fill="#0284c7"
              stroke="#0369a1"
              strokeWidth="1.5"
            />
            {/* Main topside hull */}
            <path
              d="M35 72 L45 92 H405 L415 72 H35Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1"
            />
            {/* Hull Waterline Stripe - Aqua Eco Coating indication */}
            <path
              d="M38 91 H408"
              stroke="#00c9a7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Bow spray waves */}
            <path
              d="M405 92 C 412 90, 418 86, 420 84"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-pulse"
            />

            {/* Deck / Coaming rail */}
            <rect x="52" y="70" width="350" height="2.5" fill="#64748b" />

            {/* Individual Interactive Cargo Containers */}
            {containers.map((c) => {
              const isHovered = hoveredContainer === c.label;
              return (
                <g
                  key={c.id}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => setHoveredContainer(c.label)}
                  onMouseLeave={() => setHoveredContainer(null)}
                >
                  <rect
                    x={c.x}
                    y={c.y}
                    width={c.w}
                    height={c.h}
                    rx="1.5"
                    fill={c.color}
                    stroke={isHovered ? '#ffffff' : '#1e293b'}
                    strokeWidth={isHovered ? '2' : '0.8'}
                    style={{
                      transform: isHovered ? 'translateY(-2px)' : 'none',
                      filter: isHovered ? 'brightness(1.2)' : 'none',
                    }}
                  />
                  {/* Container vertical corrugated ribs */}
                  <line x1={c.x + 6} y1={c.y + 2} x2={c.x + 6} y2={c.y + 12} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                  <line x1={c.x + 11} y1={c.y + 2} x2={c.x + 11} y2={c.y + 12} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                  <line x1={c.x + 16} y1={c.y + 2} x2={c.x + 16} y2={c.y + 12} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                </g>
              );
            })}

            {/* Aft Bridge / Superstructure & Radar Navigation Mast */}
            {/* Superstructure multi-tier bridge tower */}
            <rect x="295" y="28" width="46" height="44" rx="2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <rect x="300" y="34" width="36" height="6" rx="1" fill="#0284c7" opacity="0.8" />
            {/* Bridge windows */}
            <rect x="303" y="35" width="6" height="4" rx="0.5" fill="#0f172a" />
            <rect x="312" y="35" width="6" height="4" rx="0.5" fill="#0f172a" />
            <rect x="321" y="35" width="6" height="4" rx="0.5" fill="#0f172a" />
            <rect x="329" y="35" width="5" height="4" rx="0.5" fill="#0f172a" />

            {/* Funnel / Exhaust Stack with Aqua-X-Foul emblem */}
            <rect x="286" y="24" width="9" height="34" rx="1" fill="#0f172a" />
            <rect x="286" y="27" width="9" height="5" fill="#00c9a7" />
            {/* Clean eco-exhaust vapour plume */}
            <ellipse cx="290.5" cy="18" rx="4" ry="2" fill="#e2e8f0" opacity="0.4" className="animate-pulse" />

            {/* Navigation Radar Mast & Scanner */}
            <line x1="318" y1="28" x2="318" y2="12" stroke="#64748b" strokeWidth="2" />
            <line x1="312" y1="12" x2="324" y2="12" stroke="#00c9a7" strokeWidth="2" strokeLinecap="round" />
            {/* Blinking green starboard navigation beacon */}
            <circle cx="324" cy="12" r="1.5" fill="#10b981" className="animate-ping" />
            {/* Forward anchor pocket */}
            <circle cx="395" cy="79" r="2.5" fill="#334155" />
          </svg>
        </div>
      </div>

      {/* Interactive Bottom Control Pill (Allows switching 30% / 40% Opacity & Controls) */}
      <div className="fixed bottom-3 right-4 pointer-events-auto z-20 hidden md:flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-full px-3 py-1.5 shadow-sm text-xs text-slate-600 hover:shadow-md transition-all">
        <Compass className="w-3.5 h-3.5 text-aqua-600" />
        <span className="font-medium text-[11px] text-slate-700">Marine Visual:</span>

        {/* 30% vs 40% Opacity Quick Switcher */}
        <button
          type="button"
          onClick={() => setOpacity(0.30)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
            opacity === 0.30 ? 'bg-aqua-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Set background opacity to 30%"
        >
          30%
        </button>
        <button
          type="button"
          onClick={() => setOpacity(0.40)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
            opacity === 0.40 ? 'bg-aqua-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Set background opacity to 40%"
        >
          40%
        </button>

        <span className="text-slate-300">|</span>

        {/* Play / Pause Motion Button */}
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="text-[11px] text-slate-600 hover:text-aqua-600 transition-colors"
          title="Pause or Resume vessel motion"
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>
    </div>
  );
};
