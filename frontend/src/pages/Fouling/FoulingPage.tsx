import React, { useState, useEffect } from 'react';
import { Waves, ShieldAlert, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { vesselApi } from '../../services/vesselApi';
import { Vessel } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useNavigate } from 'react-router-dom';

export const FoulingPage: React.FC = () => {
  const navigate = useNavigate();
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    vesselApi.getVessels({ limit: 142 }).then((res) => {
      setVessels(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = vessels.filter((v) => {
    const matchesRisk = selectedRisk === 'All' || v.foulingRisk === selectedRisk;
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.imo.includes(searchTerm);
    return matchesRisk && matchesSearch;
  });

  const criticalCount = vessels.filter((v) => v.foulingRisk === 'Critical').length;
  const highCount = vessels.filter((v) => v.foulingRisk === 'High').length;
  const moderateCount = vessels.filter((v) => v.foulingRisk === 'Moderate').length;
  const lowCount = vessels.filter((v) => v.foulingRisk === 'Low').length;

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
          <Waves className="w-6 h-6 text-aqua-600" />
          <span>Fleet Biofouling Intelligence</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time biofouling risk distribution, optical inspection findings, and hydrodynamic drag severity.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedRisk('Critical')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedRisk === 'Critical'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-600 font-semibold">
            <span>Critical Risk</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">{criticalCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Requires immediate dry dock/ROV</p>
        </div>

        <div
          onClick={() => setSelectedRisk('High')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedRisk === 'High'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-600 font-semibold">
            <span>High Risk</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">{highCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Scheduled for next port window</p>
        </div>

        <div
          onClick={() => setSelectedRisk('Moderate')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedRisk === 'Moderate'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-blue-600 font-semibold">
            <span>Moderate Risk</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">{moderateCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Monitored for slime progression</p>
        </div>

        <div
          onClick={() => setSelectedRisk('Low')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedRisk === 'Low'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold">
            <span>Low Risk (Clean)</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">{lowCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Optimal coating performance</p>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by vessel or IMO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-aqua-500"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500">Filter:</span>
            {['All', 'Critical', 'High', 'Moderate', 'Low'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRisk(r)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedRisk === r
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">IMO</th>
                <th className="py-2.5 px-4">Vessel Name</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Biofouling Coverage</th>
                <th className="py-2.5 px-4">Risk Tier</th>
                <th className="py-2.5 px-4">Last Inspection</th>
                <th className="py-2.5 px-4">Next Target Cleaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => navigate(`/vessels/${v.id}?tab=fouling`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-slate-500">{v.imo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 hover:text-aqua-600">
                    {v.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{v.type}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-800">{v.foulingRating}%</span>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            v.foulingRating > 60
                              ? 'bg-rose-500'
                              : v.foulingRating > 30
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${v.foulingRating}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge type="risk" value={v.foulingRisk} />
                  </td>
                  <td className="py-3 px-4 text-slate-500">{v.lastInspectionDate}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{v.nextCleaningDueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
