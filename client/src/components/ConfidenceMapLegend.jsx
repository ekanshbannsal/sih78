import React from 'react';
import { Layers, Info } from 'lucide-react';

export default function ConfidenceMapLegend({
  activeLayer = 'Bust Probability',
  setActiveLayer
}) {
  const layers = [
    'Bust Probability',
    'Confidence',
    'Forecast Error',
    'Rainfall',
    'Temperature',
    'Wind'
  ];

  const riskTiers = [
    { label: 'LOW RISK', range: '0–20%', color: 'bg-emerald-500', desc: 'Predictable synoptic pattern' },
    { label: 'MODERATE', range: '20–40%', color: 'bg-amber-500', desc: 'Standard ensemble divergence' },
    { label: 'HIGH', range: '40–60%', color: 'bg-orange-500', desc: 'Significant forecast uncertainty' },
    { label: 'VERY HIGH', range: '60%+', color: 'bg-rose-500', desc: 'Severe forecast bust probability' }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 shadow-lg text-xs">
      
      {/* Risk Color Legend */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-semibold text-slate-300 font-mono flex items-center gap-1.5 uppercase text-[11px]">
          <Info className="w-3.5 h-3.5 text-sky-400" />
          Risk Thresholds:
        </span>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {riskTiers.map((tier) => (
            <div key={tier.label} className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-1 rounded-md border border-slate-800">
              <span className={`w-2.5 h-2.5 rounded-full ${tier.color} shrink-0`} />
              <span className="font-bold text-slate-200">{tier.label}</span>
              <span className="text-slate-400 font-mono text-[10px]">({tier.range})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Layer Switcher */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          Layer:
        </span>
        <select
          value={activeLayer}
          onChange={(e) => setActiveLayer(e.target.value)}
          className="bg-[#080d1e] border border-meteo-border rounded-lg px-2.5 py-1 text-xs text-sky-300 font-semibold focus:outline-none focus:border-sky-400 cursor-pointer"
        >
          {layers.map(layer => (
            <option key={layer} value={layer}>{layer}</option>
          ))}
        </select>
      </div>

    </div>
  );
}
