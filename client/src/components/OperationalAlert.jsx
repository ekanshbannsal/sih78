import React, { useState } from 'react';
import { ArrowRight, X, ShieldAlert } from 'lucide-react';

export default function OperationalAlert({ 
  alert = {
    title: 'High Forecast Uncertainty Detected',
    region: 'Odisha & West Bengal',
    leadTime: 'Day 5',
    bustProbability: 68.4,
    reason: 'High ensemble spread + rapid pressure gradient changes + historical rainfall bias.',
    actionRequired: 'Issue operational meteorological advisory to regional disaster management center.'
  },
  onViewAnalysis
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Operational Meteorological Alert"
      className="relative overflow-hidden rounded-xl border border-rose-500/60 bg-gradient-to-r from-rose-950/90 via-[#200f2e] to-[#0c1735] p-4 sm:p-5 shadow-xl shadow-rose-950/30"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Alert Indicator & Text */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-600/30 border border-rose-500/70 text-rose-300 shrink-0 animate-pulse shadow-md shadow-rose-900/40">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-black tracking-wider px-2 py-0.5 rounded bg-rose-600/40 border border-rose-400/60 text-white shadow-sm">
                CRITICAL OPERATIONAL ALERT
              </span>
              <span className="text-xs text-rose-200 font-mono font-bold">
                LEAD TIME: {alert.leadTime}
              </span>
            </div>

            <h3 className="mt-1.5 text-base sm:text-lg font-black text-white flex items-center gap-2 flex-wrap">
              {alert.title}
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-400/50">
                Bust Risk: {alert.bustProbability}%
              </span>
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              <span className="font-bold text-rose-300">Affected:</span> {alert.region} &nbsp;|&nbsp;
              <span className="font-bold text-rose-300"> Reason:</span> {alert.reason}
            </p>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
          <button
            type="button"
            onClick={onViewAnalysis}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-md shadow-rose-900/50 transition-all group"
          >
            <span>View Analysis</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Dismiss Alert"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
