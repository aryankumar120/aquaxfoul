import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; type?: 'table' | 'card' | 'chart' }> = ({
  rows = 5,
  type = 'table',
}) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 h-32">
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 bg-slate-200 rounded-full" />
              <div className="space-y-2">
                <div className="w-16 h-6 bg-slate-200 rounded" />
                <div className="w-24 h-4 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between">
              <div className="w-20 h-4 bg-slate-100 rounded" />
              <div className="w-14 h-4 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse h-80 flex flex-col justify-between">
        <div className="w-48 h-5 bg-slate-200 rounded" />
        <div className="h-52 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-sm">
          Loading visualization...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse space-y-4">
      <div className="h-6 bg-slate-200 rounded w-1/4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 bg-slate-100 rounded w-full flex items-center px-4 space-x-4">
            <div className="h-4 bg-slate-200 rounded w-1/6" />
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-1/6" />
            <div className="h-4 bg-slate-200 rounded w-1/6" />
            <div className="h-4 bg-slate-200 rounded w-1/6" />
          </div>
        ))}
      </div>
    </div>
  );
};
