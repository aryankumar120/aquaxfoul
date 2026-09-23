import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, CheckCircle2, Search } from 'lucide-react';
import { reportApi } from '../../services/reportApi';
import { ReportItem } from '../../types';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    reportApi.getReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  const handleDownload = async (report: ReportItem) => {
    setDownloadingId(report.id);
    try {
      await reportApi.downloadReport(report.id);
      setDownloadSuccess(`Downloaded ${report.title}`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = reports.filter((r) => {
    if (selectedType === 'All') return true;
    return r.type === selectedType;
  });

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <FileText className="w-6 h-6 text-aqua-600" />
            <span>Maritime Compliance & Fleet Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Export official regulatory audits, IMO DCS carbon intensity logs, and biofouling performance dossiers.
          </p>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* Reports Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-card card-subtle p-6 space-y-4">
        {/* Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Category:</span>
            {['All', 'Fleet Biofouling Audit', 'Vessel Performance', 'Cleaning ROI', 'IMO DCS Emissions'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedType(cat)}
                  className={`px-3 py-1 rounded-md transition-all btn-press ${
                    selectedType === cat
                      ? 'bg-slate-900 text-white font-medium shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">Report Dossier Title</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Period</th>
                <th className="py-2.5 px-4">Generated Date</th>
                <th className="py-2.5 px-4">Format</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/90 transition-all duration-150">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>{r.title}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{r.type}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{r.period}</td>
                  <td className="py-3.5 px-4 text-slate-500">{r.generatedDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {r.format} ({r.fileSizeBytes})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDownload(r)}
                      disabled={downloadingId === r.id}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all btn-press disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadingId === r.id ? 'Exporting...' : 'Download'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
