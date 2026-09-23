import React, { useState } from 'react';
import { Settings, Shield, Server, Bell, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [apiBaseUrl, setApiBaseUrl] = useState(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
          <Settings className="w-6 h-6 text-aqua-600" />
          <span>Platform Settings & API Configurations</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage FastAPI backend endpoint connections, authentication parameters, and notification alerts.
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Configuration preferences saved successfully.</span>
        </div>
      )}

      {/* User Info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Shield className="w-4 h-4 text-aqua-600" />
          <span>Authenticated Account</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Name</span>
            <span className="font-semibold text-slate-800">{user?.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Email</span>
            <span className="font-mono text-slate-800">{user?.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Assigned Role</span>
            <span className="font-semibold text-aqua-700 bg-aqua-50 px-2 py-0.5 rounded border border-aqua-200 inline-block">
              {user?.role}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Session Token</span>
            <span className="font-mono text-slate-500">Active (Mock JWT valid)</span>
          </div>
        </div>
      </div>

      {/* FastAPI Backend Endpoint */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Server className="w-4 h-4 text-aqua-600" />
          <span>FastAPI Backend Connection</span>
        </h2>
        <p className="text-xs text-slate-500">
          Set the target REST API URL. When the backend service is offline, the client automatically defaults to high-fidelity mock data.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              VITE_API_BASE_URL
            </label>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-aqua-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
