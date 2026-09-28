import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';
import { 
  BrainCircuit, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Wind, 
  CloudRain, 
  TrendingDown, 
  ShieldAlert 
} from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0e193d] border border-meteo-border p-3 rounded-lg shadow-xl text-xs space-y-1">
        <p className="font-bold text-white">{data.feature}</p>
        <p className="text-sky-400 font-extrabold text-sm">
          Contribution: +{data.contribution}%
        </p>
        <p className="text-slate-400 text-[11px] max-w-xs">{data.description}</p>
      </div>
    );
  }
  return null;
};

export default function ExplainabilityPage({
  explainabilityData,
  selectedRegion = 'Odisha',
  leadTime = 5,
  weatherSystem = 'Monsoon Depression',
  variable = 'Rainfall'
}) {
  const defaultContributions = [
    { feature: 'Ensemble Spread', contribution: 28, description: 'Disagreement among perturbed NWP members (GEFS / ECMWF EPS).' },
    { feature: 'Historical Rainfall Error', contribution: 21, description: 'Region-specific systematic bias observed over past 5 monsoon cycles.' },
    { feature: 'Pressure Gradient', contribution: 17, description: 'Steep baroclinic gradients accelerating cyclonic wind circulation.' },
    { feature: 'Moisture Convergence', contribution: 14, description: 'Flux of water vapor trapped by topography or coastal windward convergence.' },
    { feature: 'Wind Shear', contribution: 9, description: 'Vertical difference in wind vectors impairing convective organization.' },
    { feature: 'Temperature Anomaly', contribution: 6, description: 'Boundary layer sensible heat flux divergence altering pressure depths.' },
    { feature: 'Other Topography', contribution: 5, description: 'Sub-grid scale orographic and land-surface interaction terms.' }
  ];

  const contributions = explainabilityData?.featureContributions || defaultContributions;
  const explanation = explainabilityData?.plainLanguageExplanation || 
    `The model has reduced confidence because ensemble members show large disagreement over ${variable.toLowerCase()} intensity at Lead Day ${leadTime} and the historical forecast error for similar monsoon systems is elevated across ${selectedRegion}.`;

  const barColors = [
    '#ef4444', // Red for top driver
    '#f97316', // Orange
    '#f59e0b', // Amber
    '#38bdf8', // Sky
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#64748b'  // Slate
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title Header */}
      <div className="border-b border-meteo-border/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <BrainCircuit className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Explainable AI (XAI) Attribution
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Why does ForecastGuard AI predict a forecast bust? Decoupling algorithmic black-boxes into atmospheric causal factors.
        </p>
      </div>

      {/* Plain Language Operational Explanation Box */}
      <div className="rounded-xl border border-sky-500/40 bg-gradient-to-r from-[#0d1d42] to-[#0c1630] p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold border border-sky-500/40 uppercase">
            Meteorologist Plain-Language Summary
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Subdivision: {selectedRegion} | Horizon: Day {leadTime}
          </span>
        </div>

        <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
          &ldquo;{explanation}&rdquo;
        </p>

        <div className="pt-2 border-t border-sky-900/60 flex flex-wrap items-center gap-4 text-xs text-sky-300">
          <span><strong>Active System:</strong> {weatherSystem}</span>
          <span>&bull;</span>
          <span><strong>Target Variable:</strong> {variable}</span>
          <span>&bull;</span>
          <span><strong>SHAP Attribution:</strong> TreeSHAP Normalized</span>
        </div>
      </div>

      {/* Feature Importance Horizontal Bar Chart */}
      <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-meteo-border/40 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-sky-400" />
              Feature Importance & Meteorological Contribution Vector
            </h3>
            <p className="text-xs text-slate-400">
              Relative percentage weight of each feature driving the forecast bust classifier
            </p>
          </div>

          <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800 self-start sm:self-auto">
            Sum of Relative Contributions: 100%
          </span>
        </div>

        {/* Horizontal Bar Chart Canvas */}
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={contributions}
              margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} opacity={0.6} />
              <XAxis 
                type="number" 
                domain={[0, 35]} 
                stroke="#64748b" 
                fontSize={11} 
                unit="%" 
                tickLine={false} 
              />
              <YAxis 
                type="category" 
                dataKey="feature" 
                stroke="#cbd5e1" 
                fontSize={11} 
                tickLine={false} 
                width={130} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="contribution" radius={[0, 6, 6, 0]}>
                {contributions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Table */}
        <div className="overflow-x-auto pt-3 border-t border-meteo-border/30">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-meteo-border/50 text-[11px] font-mono text-slate-400 uppercase bg-[#080d1e]/80">
                <th className="py-2 px-3">Atmospheric Feature</th>
                <th className="py-2 px-3">Contribution</th>
                <th className="py-2 px-3">Operational Synoptic Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-meteo-border/30">
              {contributions.map((item, idx) => (
                <tr key={item.feature} className="hover:bg-[#12224d]/60">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: barColors[idx % barColors.length] }} />
                    {item.feature}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-sky-400">
                    +{item.contribution}%
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory SIH Scientific Disclaimer */}
      <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 text-xs text-amber-200/90 flex items-start gap-3 leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">Important Operational / Scientific Label:</strong> This explanation is generated by an AI-assisted demonstrator utilizing surrogate TreeSHAP approximations. It provides operational decision support and hypothesis generation for duty meteorologists, rather than scientifically validated causal attribution or peer-reviewed reanalysis certainty.
        </div>
      </div>

    </div>
  );
}
