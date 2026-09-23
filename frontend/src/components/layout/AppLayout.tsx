import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50/70 font-sans text-slate-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer matching Reference Image */}
        <footer className="border-t border-slate-200/80 bg-white/80 py-4 px-6 md:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Aqua-X-Foul</span>
            <span className="text-slate-300">|</span>
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
