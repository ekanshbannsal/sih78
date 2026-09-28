import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { AlertOctagon, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isHigh = data.bustProbability >= 40;
    return (
      <div className="bg-[#0e193d] border border-meteo-border p-3 rounded-lg shadow-xl text-xs space-y-1">
        <p className="font-bold text-white font-mono">{label}</p>
        <p className={`font-extrabold text-sm ${isHigh ? 'text-rose-400' : 'text-amber-400'}`}>
          Bust Probability: {data.bustProbability}%
        </p>
        <p className="text-slate-400 font-mono text-[11px]">
          Classification: <strong className="text-slate-200">{data.risk}</strong>
        </p>
        <p className="text-slate-400 font-mono text-[11px]">
          Confidence: {data.confidence}%
        </p>
      </div>
    );
  }
  return null;
};

export default function BustProbabilityChart({ 
  data = [], 
  regionName = 'Odisha', 
  activeLeadTime = 5 
}) {
  return (
    <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 sm:p-5 shadow-xl shadow-black/40 flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-meteo-border/40 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            Forecast Bust Probability Horizon
          </h3>
          <p className="text-xs text-slate-400">
            Lead Time vs Cumulative Bust Probability for <strong className="text-slate-200">{regionName}</strong>
          </p>
        </div>

        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-950/80 border border-rose-600/30 text-rose-400">
          Critical Warning: &gt;40%
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="h-[260px] sm:h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="bustGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.7} />
                <stop offset="50%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
              </linearGradient>
            </defs>

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
            
            {/* Warning lines */}
            <ReferenceLine y={40} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'High Risk (40%)', fill: '#f97316', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Very High (60%)', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine x={`Day ${activeLeadTime}`} stroke="#f43f5e" strokeWidth={2} label={{ value: `Day ${activeLeadTime}`, fill: '#f43f5e', fontSize: 10, position: 'insideTopLeft' }} />

            <Area
              type="monotone"
              dataKey="bustProbability"
              stroke="#f43f5e"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#bustGradient)"
              dot={{ r: 4, fill: '#0b1329', stroke: '#f43f5e', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#f43f5e', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-meteo-border/30 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-rose-300 font-medium">
          <Info className="w-3.5 h-3.5" />
          Steep non-linear growth beyond Day 4 marks ensemble divergence threshold.
        </span>
        <span className="font-mono text-slate-400">
          Model: Logistic Sigmoid Fit
        </span>
      </div>

    </div>
  );
}
