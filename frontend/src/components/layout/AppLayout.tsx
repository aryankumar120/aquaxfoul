import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Escape to close + lock background scroll while the drawer is open
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [sidebarOpen]);

  // Reset drawer if the viewport grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50/70 font-sans text-slate-800">
      {/* Mobile/tablet backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[45] bg-slate-950/60 backdrop-blur-[2px] lg:hidden backdrop-enter"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (persistent: never remounts between routes) */}
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} menuOpen={sidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto min-w-0">
          <div key={pathname} className="page-enter">
            <Outlet />
          </div>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/80 bg-white/80 py-4 px-4 sm:px-6 md:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1">
            <span className="font-semibold text-slate-700">Aqua-X-Foul</span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span>Maritime Biofouling Management Platform</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-500">
            <a href="#privacy" className="hover:text-slate-800 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-slate-800 transition-colors">Terms</a>
            <a href="#contact" className="hover:text-slate-800 transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
};
