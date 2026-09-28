import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { CloudRain, Thermometer, Wind, CheckCircle2, AlertTriangle, Calculator } from 'lucide-react';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    const forecast = payload.find(p => p.dataKey === 'forecast')?.value;
    const observed = payload.find(p => p.dataKey === 'observed')?.value;
    const diff = Math.round((observed - forecast) * 10) / 10;
    const diffPct = forecast ? Math.round(((observed - forecast) / forecast) * 100) : 0;

    return (
      <div className="bg-[#0e193d] border border-meteo-border p-3 rounded-lg shadow-xl text-xs space-y-1.5">
        <p className="font-bold text-white font-mono">{label}</p>
        <div className="space-y-0.5">
          <p className="text-sky-400 font-semibold flex justify-between gap-4">
            <span>Forecast:</span> <strong>{forecast} {unit}</strong>
          </p>
          <p className="text-emerald-400 font-semibold flex justify-between gap-4">
            <span>Observed:</span> <strong>{observed} {unit}</strong>
          </p>
        </div>
        <div className="pt-1 border-t border-slate-700/80 font-mono text-[11px] flex justify-between gap-3 text-amber-300">
          <span>Error (Obs - Fcst):</span>
          <span>{diff > 0 ? `+${diff}` : diff} {unit} ({diffPct > 0 ? `+${diffPct}` : diffPct}%)</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function ForecastVsObserved({
  activeVariable = 'Rainfall',
  forecastVsObservedData,
  onVariableChange
}) {
  const [selectedVar, setSelectedVar] = useState(activeVariable || 'Rainfall');

  const variables = [
    { id: 'Rainfall', label: 'Rainfall (mm/24h)', icon: CloudRain, unit: 'mm' },
    { id: 'Temperature', label: 'Temperature (°C)', icon: Thermometer, unit: '°C' },
    { id: 'Wind Speed', label: 'Wind Speed (km/h)', icon: Wind, unit: 'km/h' }
  ];

  const handleVarClick = (varId) => {
    setSelectedVar(varId);
    if (onVariableChange) onVariableChange(varId);
  };

  const currentDataset = forecastVsObservedData?.[selectedVar] || {
    unit: selectedVar === 'Temperature' ? '°C' : selectedVar === 'Wind Speed' ? 'km/h' : 'mm',
    days: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    forecast: selectedVar === 'Temperature' ? [38.2, 39.5, 41.0, 42.8, 43.5, 44.1, 42.0] : selectedVar === 'Wind Speed' ? [28, 35, 48, 65, 82, 70, 45] : [72, 85, 110, 125, 145, 130, 95],
    observed: selectedVar === 'Temperature' ? [38.0, 39.1, 42.4, 44.9, 46.2, 45.8, 43.1] : selectedVar === 'Wind Speed' ? [27, 33, 56, 84, 105, 88, 52] : [70, 89, 140, 168, 190, 162, 105],
    mae: selectedVar === 'Temperature' ? 1.7 : selectedVar === 'Wind Speed' ? 13.9 : 24.8,
    rmse: selectedVar === 'Temperature' ? 2.1 : selectedVar === 'Wind Speed' ? 16.8 : 31.4,
    bias: selectedVar === 'Temperature' ? -1.4 : selectedVar === 'Wind Speed' ? -11.2 : -19.6,
    correlation: selectedVar === 'Temperature' ? 0.94 : selectedVar === 'Wind Speed' ? 0.91 : 0.89
  };

  // Build chart-ready data points
  const chartPoints = currentDataset.days.map((day, idx) => ({
    day,
    forecast: currentDataset.forecast[idx],
    observed: currentDataset.observed[idx]
  }));

  return (
    <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 sm:p-5 shadow-xl shadow-black/40 space-y-4">
      
      {/* Header and Variable Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-meteo-border/40 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
            <Calculator className="w-4 h-4 text-sky-400" />
            Forecast vs Observed Ground Truth Verification
          </h3>
          <p className="text-xs text-slate-400">
            Assessing systematic medium-range underestimation & forecast bust divergence
          </p>
        </div>

        {/* Variable Switcher */}
        <div className="flex items-center gap-1.5 bg-[#080d1e] p-1 rounded-lg border border-meteo-border/70 self-start sm:self-auto">
          {variables.map(v => {
            const Icon = v.icon;
            const isActive = selectedVar.toLowerCase() === v.id.toLowerCase();
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleVarClick(v.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Row: MAE, RMSE, Bias, Correlation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        
        {/* MAE */}
        <div className="bg-[#0b1329] border border-meteo-border/60 rounded-lg p-3">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Mean Absolute Error (MAE)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-white">{currentDataset.mae}</span>
            <span className="text-xs text-slate-400 font-mono">{currentDataset.unit}</span>
          </div>
          <span className="text-[10px] text-amber-400">Reflects average error magnitude</span>
        </div>

        {/* RMSE */}
        <div className="bg-[#0b1329] border border-meteo-border/60 rounded-lg p-3">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Root Mean Square Error (RMSE)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-rose-400">{currentDataset.rmse}</span>
            <span className="text-xs text-slate-400 font-mono">{currentDataset.unit}</span>
          </div>
          <span className="text-[10px] text-rose-300">Penalizes large outlier busts</span>
        </div>

        {/* Bias */}
        <div className="bg-[#0b1329] border border-meteo-border/60 rounded-lg p-3">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Systematic Bias</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-cyan-400">{currentDataset.bias}</span>
            <span className="text-xs text-slate-400 font-mono">{currentDataset.unit}</span>
          </div>
          <span className="text-[10px] text-cyan-300">Negative = Underprediction</span>
        </div>

        {/* Correlation */}
        <div className="bg-[#0b1329] border border-meteo-border/60 rounded-lg p-3">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Pearson Correlation (r)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-emerald-400">{currentDataset.correlation}</span>
            <span className="text-xs text-slate-400 font-mono">/ 1.0</span>
          </div>
          <span className="text-[10px] text-emerald-300">Pattern trend tracking fidelity</span>
        </div>

      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartPoints} margin={{ top: 10, right: 20, left: -5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit={` ${currentDataset.unit}`} />
            <Tooltip content={<CustomTooltip unit={currentDataset.unit} />} />
            <Legend 
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} 
              formatter={(value) => (
                <span className="text-slate-300 font-semibold">{value.toUpperCase()}</span>
              )}
            />

            {/* NWP Forecast Line */}
            <Line
              type="monotone"
              name="Forecast"
              dataKey="forecast"
              stroke="#38bdf8"
              strokeWidth={3}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#080d1e', stroke: '#38bdf8', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#38bdf8' }}
            />

            {/* Observed Ground Truth Line */}
            <Line
              type="monotone"
              name="Observed"
              dataKey="observed"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#080d1e', stroke: '#10b981', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Ground Truth Explanation */}
      <div className="pt-2 border-t border-meteo-border/30 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <span>
          <strong className="text-slate-200">Meteorological Diagnosis:</strong> Forecasted {selectedVar.toLowerCase()} diverged sharply starting Day 3–5 as convection was under-resolved by the global hydrostatic core.
        </span>
        <span className="font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
          Source: IMD AWS Reanalysis Benchmark
        </span>
      </div>

    </div>
  );
}
