import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, X, ShieldAlert, Sparkles } from 'lucide-react';

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
      className="relative overflow-hidden rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-950/70 via-[#18112e] to-[#0c1630] p-4 sm:p-5 shadow-xl shadow-rose-950/20 glow-card"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Alert Indicator & Text */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400 shrink-0 animate-pulse">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-rose-900/60 border border-rose-500/50 text-rose-300">
                CRITICAL OPERATIONAL ALERT
              </span>
              <span className="text-xs text-rose-300/80 font-mono">
                LEAD TIME: {alert.leadTime}
              </span>
            </div>

            <h3 className="mt-1 text-sm sm:text-base font-bold text-white flex items-center gap-2">
              {alert.title}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Bust Risk: {alert.bustProbability}%
              </span>
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-semibold text-rose-200">Affected:</span> {alert.region} &nbsp;|&nbsp;
              <span className="font-semibold text-rose-200"> Reason:</span> {alert.reason}
            </p>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
          <button
            type="button"
            onClick={onViewAnalysis}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 shadow-md shadow-rose-900/40 transition-all group"
          >
            <span>View Analysis</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
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
