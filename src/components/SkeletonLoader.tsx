import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full space-y-5 animate-pulse" id="weather-skeleton-loader">
      {/* Current Hero Card Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 h-64 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-7 w-48 bg-slate-800 rounded-lg" />
            <div className="h-4 w-32 bg-slate-800/80 rounded" />
            <div className="h-10 w-40 bg-slate-800/60 rounded-xl mt-4" />
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <div className="h-16 w-32 bg-slate-800 rounded-xl" />
            <div className="h-4 w-28 bg-slate-800/80 rounded" />
          </div>
        </div>
        <div className="h-4 w-64 bg-slate-800/50 rounded" />
      </div>

      {/* Micro-metrics Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="h-3 w-16 bg-slate-800 rounded" />
            <div className="h-6 w-20 bg-slate-800/80 rounded" />
          </div>
        ))}
      </div>

      {/* Hourly Timeline Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 h-48 space-y-4">
        <div className="h-4 w-44 bg-slate-800 rounded" />
        <div className="flex space-x-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 w-20 rounded-xl bg-slate-800/50 flex-shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
};
