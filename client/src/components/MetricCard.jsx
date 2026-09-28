import React from 'react';
import { Info } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  status,
  statusColor = 'text-slate-400',
  icon: Icon,
  accentColor = 'text-sky-400',
  borderColor = 'border-slate-800',
  bgGradient = 'from-[#111d3d] to-[#0c1630]',
  hint,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border ${borderColor} bg-gradient-to-br ${bgGradient} p-4 sm:p-5 shadow-lg shadow-black/30 glow-card transition-all ${
        onClick ? 'cursor-pointer hover:border-sky-500/60' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm font-medium text-slate-400 truncate tracking-wide">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 ${accentColor}`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {status && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 ${statusColor}`}>
            {status}
          </span>
        )}
      </div>

      {hint && (
        <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{hint}</span>
        </p>
      )}

      {/* Subtle meteorological radar line accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
    </div>
  );
}
