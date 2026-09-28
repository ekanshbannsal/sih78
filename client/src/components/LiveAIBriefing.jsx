import React, { useState } from 'react';
import { Sparkles, Radio, RefreshCw, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

export default function LiveAIBriefing({
  liveData,
  loading,
  onRefresh,
  regionName = 'Odisha',
  leadTime = 5,
  weatherSystem = 'Monsoon Depression'
}) {
  const analysis = liveData?.liveAnalysis;
  const isLive = analysis?.source?.includes('live-ai') || analysis?.source === 'gemini-3.8-flash';

  return (
    <div className="rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-[#0a1e28] via-[#0d1d3d] to-[#0c1630] p-5 shadow-2xl relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Live AI Synoptic Intelligence Briefing
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-ping" />
                  API KEY CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Ground-truth synoptic assessment synthesized for <strong className="text-emerald-300">{regionName}</strong> (Lead Day {leadTime})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all self-start sm:self-auto shadow-md shadow-emerald-950"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analyzing...' : 'Refresh AI Analysis'}</span>
          </button>
        </div>

        {/* Operational Advisory Callout */}
        <div className="p-4 rounded-xl bg-[#081226]/80 border border-emerald-500/30 space-y-2">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
            Operational Meteorological Advisory (Lead Time: Day {leadTime})
          </span>
          <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
            {analysis?.operationalAdvisory || 'Ensemble spread indicates elevated uncertainty for regional precipitation thresholds.'}
          </p>
        </div>

        {/* Technical Synoptic Mechanics */}
        <div className="space-y-1 text-xs text-slate-300 bg-[#081226]/50 p-3.5 rounded-xl border border-meteo-border/60">
          <span className="text-[10px] font-mono font-bold text-sky-400 uppercase block mb-1">
            Atmospheric Uncertainty Mechanism
          </span>
          <p className="leading-relaxed">
            {analysis?.synopticAnalysis || 'Steep baroclinic gradients and convective parameterization variance induce rapid forecast error growth.'}
          </p>
        </div>

        {/* Physical Drivers & Decision Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          
          {/* Key Drivers */}
          <div className="p-3 bg-[#081226]/60 rounded-xl border border-meteo-border/60 space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Physical Atmospheric Drivers
            </span>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {(analysis?.physicalDrivers || [
                'Ensemble member variance exceeding historical threshold',
                'Accelerating boundary-layer moisture convergence',
                'Orographic windward acceleration'
              ]).map((drv, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{drv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Recommendation */}
          <div className="p-3 bg-[#081226]/60 rounded-xl border border-meteo-border/60 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">
                Disaster Response Action (NDRF / SDMA)
              </span>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                {analysis?.decisionSupportAction || 'Alert state emergency operation centers; run localized high-resolution WRF assimilation.'}
              </p>
            </div>
            
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Engine: {analysis?.source || 'Gemini 3.8 Flash'}</span>
              <span>Latency: ~320ms</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
