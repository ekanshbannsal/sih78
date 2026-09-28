import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { TrendingDown, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0e193d] border border-meteo-border p-3 rounded-lg shadow-xl text-xs space-y-1">
        <p className="font-bold text-white font-mono">{label}</p>
        <p className="text-sky-400 font-extrabold text-sm">
          Confidence: {data.confidence}%
        </p>
        <p className="text-slate-400 font-mono text-[11px]">
          Risk Category: <span className="text-amber-300 font-semibold">{data.risk}</span>
        </p>
        <p className="text-slate-400 font-mono text-[11px]">
          Estimated Error: ±{data.forecastError}%
        </p>
      </div>
    );
  }
  return null;
};

export default function ConfidenceChart({ 
  data = [], 
  regionName = 'Odisha', 
  activeLeadTime = 5 
}) {
  return (
    <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 sm:p-5 shadow-xl shadow-black/40 flex flex-col justify-between">
      
      {/* Chart Header */}
      <div className="flex items-center justify-between border-b border-meteo-border/40 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-sky-400" />
            Forecast Confidence Decay Curve
          </h3>
          <p className="text-xs text-slate-400">
            Region: <strong className="text-slate-200">{regionName}</strong> | Lead Horizon: Day 1 → Day 10
          </p>
        </div>

        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-950/80 border border-sky-600/30 text-sky-400">
          Threshold: 60% Min Operational
        </span>
      </div>

      {/* Recharts Canvas */}
      <div className="h-[260px] sm:h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis 
              dataKey="day" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              unit="%" 
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Critical 60% confidence baseline */}
            <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '60% Confidence Threshold', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
            
            {/* Highlight current selected lead time */}
            <ReferenceLine x={`Day ${activeLeadTime}`} stroke="#38bdf8" strokeWidth={2} label={{ value: `Selected Day ${activeLeadTime}`, fill: '#38bdf8', fontSize: 10, position: 'insideTopLeft' }} />

            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ r: 4, fill: '#0b1329', stroke: '#38bdf8', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Insight */}
      <div className="mt-3 pt-2 border-t border-meteo-border/30 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-sky-400/90 font-medium">
          <Info className="w-3.5 h-3.5" />
          Rapid drop occurs between Day 4 & Day 6 due to synoptic chaos.
        </span>
        <span className="font-mono text-slate-400">
          Source: FBC-v1.4 Calibration
        </span>
      </div>

    </div>
  );
}
