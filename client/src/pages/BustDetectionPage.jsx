import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CloudRain, 
  Compass, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Flame,
  Activity,
  Layers
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

export default function BustDetectionPage({
  confidenceData,
  selectedRegion = 'Odisha',
  leadTime = 5,
  weatherSystem = 'Monsoon Depression',
  variable = 'Rainfall',
  onNavigate
}) {
  const currentRisk = confidenceData?.risk || 'HIGH';
  const bustProb = confidenceData?.bustProbability ?? 68.4;
  const confScore = confidenceData?.confidence ?? 31.6;
  const regionName = confidenceData?.region || selectedRegion;

  // Explainability factors
  const factors = confidenceData?.factors || {
    ensembleSpread: { score: 86, level: 'High' },
    historicalError: { score: 79, level: 'High' },
    pressureGradient: { score: 58, level: 'Moderate' },
    moistureConvergence: { score: 88, level: 'High' },
    rainfallGradient: { score: 82, level: 'High' },
    trackUncertainty: { score: 62, level: 'Moderate' }
  };

  const factorItems = [
    {
      id: 'ensembleSpread',
      name: '1. Ensemble Spread',
      score: factors.ensembleSpread?.score || 86,
      level: factors.ensembleSpread?.level || 'High',
      desc: 'Severe divergence among perturbation members regarding intensity center.'
    },
    {
      id: 'historicalError',
      name: '2. Historical Error',
      score: factors.historicalError?.score || 79,
      level: factors.historicalError?.level || 'High',
      desc: 'Systematic underprediction documented across past 5 monsoon cycles in this region.'
    },
    {
      id: 'pressureGradient',
      name: '3. Rapid Pressure Change',
      score: factors.pressureGradient?.score || 58,
      level: factors.pressureGradient?.level || 'Moderate',
      desc: 'Accelerating isobars near coastline exceeding standard geostrophic balance.'
    },
    {
      id: 'moistureConvergence',
      name: '4. Moisture Convergence',
      score: factors.moistureConvergence?.score || 88,
      level: factors.moistureConvergence?.level || 'High',
      desc: 'Massive low-level tropospheric water vapor pooling (850 hPa jet flux).'
    },
    {
      id: 'rainfallGradient',
      name: '5. Rainfall Gradient',
      score: factors.rainfallGradient?.score || 82,
      level: factors.rainfallGradient?.level || 'High',
      desc: 'Extremely sharp transition between moderate drizzle and torrential deluge.'
    },
    {
      id: 'trackUncertainty',
      name: '6. Track Uncertainty',
      score: factors.trackUncertainty?.score || 62,
      level: factors.trackUncertainty?.level || 'Moderate',
      desc: 'Ensemble depression cone spans 180 km longitudinal spread at Day 5.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="border-b border-meteo-border/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            AI Bust Detection & Vulnerability Assessment
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Specialized real-time evaluation identifying when and why medium-range NWP predictions are expected to fail.
        </p>
      </div>

      {/* Hero Assessment Card */}
      <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-br from-[#1d122e] via-[#101b3d] to-[#0c1630] p-6 shadow-2xl relative overflow-hidden">
        
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-300 font-bold bg-rose-950/80 px-2.5 py-1 rounded border border-rose-600/40">
                Operational AI Assessment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Forecast Bust Risk: <span className="text-rose-400">{currentRisk}</span>
              </h2>
            </div>

            <RiskBadge risk={currentRisk} size="lg" />
          </div>

          {/* Grid of Key Assessment Attributes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <div className="bg-[#091024]/80 p-3.5 rounded-xl border border-meteo-border/60">
              <span className="text-[11px] text-slate-400 font-mono block">Bust Probability</span>
              <span className="text-2xl font-black text-rose-400 mt-1 block">
                {bustProb}%
              </span>
              <span className="text-[10px] text-rose-300">Failure likelihood</span>
            </div>

            <div className="bg-[#091024]/80 p-3.5 rounded-xl border border-meteo-border/60">
              <span className="text-[11px] text-slate-400 font-mono block">Affected Region</span>
              <span className="text-base font-bold text-white mt-1 block truncate">
                {regionName} & West Bengal
              </span>
              <span className="text-[10px] text-sky-400">Bay of Bengal coast</span>
            </div>

            <div className="bg-[#091024]/80 p-3.5 rounded-xl border border-meteo-border/60">
              <span className="text-[11px] text-slate-400 font-mono block">Lead Time Window</span>
              <span className="text-xl font-bold text-sky-300 mt-1 block">
                Day {leadTime}–{leadTime + 1}
              </span>
              <span className="text-[10px] text-slate-400">Medium-range horizon</span>
            </div>

            <div className="bg-[#091024]/80 p-3.5 rounded-xl border border-meteo-border/60">
              <span className="text-[11px] text-slate-400 font-mono block">Primary Variable</span>
              <span className="text-xl font-bold text-cyan-300 mt-1 block">
                {variable}
              </span>
              <span className="text-[10px] text-cyan-400">QPF precipitation</span>
            </div>

            <div className="bg-[#091024]/80 p-3.5 rounded-xl border border-meteo-border/60">
              <span className="text-[11px] text-slate-400 font-mono block">Weather System</span>
              <span className="text-sm font-bold text-amber-300 mt-1 block truncate">
                {weatherSystem}
              </span>
              <span className="text-[10px] text-amber-400">Synoptic depression</span>
            </div>

            <div className="bg-[#091024]/80 p-3.5 rounded-xl border border-meteo-border/60">
              <span className="text-[11px] text-slate-400 font-mono block">Model Confidence</span>
              <span className="text-2xl font-black text-slate-200 mt-1 block">
                {confScore}%
              </span>
              <span className="text-[10px] text-rose-400">Severe uncertainty</span>
            </div>

          </div>

          {/* Plain Language Summary */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong className="text-sky-300">Meteorological Advisory:</strong> Numerical weather prediction (NWP) models indicate elevated failure risk for <span className="text-white font-semibold">{regionName}</span> around <span className="text-white font-semibold">Day {leadTime}</span>. High ensemble spread and strong moisture convergence suggest that local rainfall intensity may exceed model output by over <span className="text-rose-400 font-bold">50–80 mm</span>. Operational forecasters should issue precautionary alerts rather than relying on deterministic point forecasts.
          </div>
        </div>

      </div>

      {/* Prominent Section: "Why is the model uncertain?" */}
      <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-meteo-border/40 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-400" />
              Why is the model uncertain?
            </h3>
            <p className="text-xs text-slate-400">
              Explainable meteorological breakdown isolating key synoptic and statistical uncertainty drivers
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('explainability')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-400 bg-sky-950/80 border border-sky-600/40 hover:bg-sky-900 transition-colors self-start sm:self-auto"
          >
            <span>Full Feature SHAP Decomposition</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Horizontal Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factorItems.map((factor) => {
            const isHigh = factor.score >= 70;
            const isMod = factor.score >= 40 && factor.score < 70;
            return (
              <div
                key={factor.id}
                className="bg-[#091024] p-4 rounded-xl border border-meteo-border/60 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wide">
                    {factor.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-xs font-bold text-slate-200">
                      {factor.score}%
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isHigh ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      isMod ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {factor.level}
                    </span>
                  </div>
                </div>

                {/* Horizontal Progress Bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isHigh
                        ? 'bg-gradient-to-r from-orange-500 to-rose-500'
                        : isMod
                        ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  {factor.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Explainability Footnote */}
        <div className="pt-2 border-t border-meteo-border/30 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            Computed via <strong className="text-sky-300">TreeSHAP + Atmospheric Instability Index</strong>
          </span>
          <span className="font-mono text-slate-400">
            FBC-v1.4 Attribution Engine
          </span>
        </div>

      </div>

    </div>
  );
}
