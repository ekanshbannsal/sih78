import React from 'react';
import { Info } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  status,
  statusColor = 'text-slate-300',
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
      className={`relative overflow-hidden rounded-xl border ${borderColor} bg-gradient-to-br ${bgGradient} p-4 sm:p-5 shadow-lg shadow-black/40 glow-card transition-all ${
        onClick ? 'cursor-pointer hover:border-sky-400/80 hover:scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs sm:text-sm font-semibold text-slate-200 tracking-wide leading-snug">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 ${accentColor} shrink-0`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {value}
        </span>
        {status && (
          <span className={`text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700/80 ${statusColor}`}>
            {status}
          </span>
        )}
      </div>

      {hint && (
        <p className="mt-2 text-xs text-slate-300 flex items-center gap-1.5 line-clamp-1 font-medium">
          <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>{hint}</span>
        </p>
      )}

      {/* Subtle meteorological radar line accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
    </div>
  );
}
