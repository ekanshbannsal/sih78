import React from 'react';

export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  if (type === 'metric') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4" />
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="h-[320px] rounded-xl bg-slate-800/50 border border-slate-700/50 p-6 animate-pulse flex flex-col justify-between">
        <div className="h-4 bg-slate-700/60 rounded w-1/3" />
        <div className="h-44 bg-slate-800/80 rounded w-full" />
        <div className="h-3 bg-slate-700/40 rounded w-1/2" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 space-y-3 animate-pulse">
        <div className="h-5 bg-slate-700/60 rounded w-1/4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800/90 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-slate-800/50 border border-slate-700/50" />
      ))}
    </div>
  );
}
