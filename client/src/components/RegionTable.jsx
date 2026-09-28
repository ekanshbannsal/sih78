import React from 'react';
import { ShieldAlert, ArrowUpDown, ChevronRight, MapPin, ExternalLink } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function RegionTable({
  regions = [],
  selectedRegionId,
  onSelectRegion,
  leadTime = 5
}) {
  return (
    <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 sm:p-5 shadow-xl shadow-black/40 space-y-3">
      
      {/* Table Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-meteo-border/40 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-400" />
            High Error Probability Regions (Ranked Vulnerability Index)
          </h3>
          <p className="text-xs text-slate-400">
            Subdivisions ranked by AI forecast bust likelihood at Lead Day {leadTime}. Click row to focus station details.
          </p>
        </div>

        <span className="text-xs font-mono font-semibold text-slate-400 self-start sm:self-auto bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
          Showing {regions.length} Meteorological Stations
        </span>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-meteo-border/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider bg-[#080d1e]/80">
              <th className="py-2.5 px-3">Rank & Region</th>
              <th className="py-2.5 px-3">Bust Probability</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3">Forecast Error</th>
              <th className="py-2.5 px-3">Lead Horizon</th>
              <th className="py-2.5 px-3">Primary Variable</th>
              <th className="py-2.5 px-3 text-right">Risk Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-meteo-border/30 text-xs">
            {regions.map((reg, index) => {
              const isSelected = selectedRegionId === reg.id;
              const isHigh = reg.bustProbability >= 40;
              return (
                <tr
                  key={reg.id}
                  onClick={() => onSelectRegion(reg.id)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-sky-500/15 border-l-4 border-l-sky-400'
                      : 'hover:bg-[#12224d]/80'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
                        index < 3 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1">
                          {reg.region || reg.name}
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {reg.zone}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    <span className={`font-extrabold text-sm ${isHigh ? 'text-rose-400' : 'text-amber-400'}`}>
                      {reg.bustProbability}%
                    </span>
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full ${isHigh ? 'bg-rose-500' : 'bg-amber-400'}`}
                        style={{ width: `${Math.min(reg.bustProbability, 100)}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-sky-400 font-bold">
                    {reg.confidence}%
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-300">
                    ±{reg.forecastError}%
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-200">
                      Day {leadTime}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-medium text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/40 text-sky-300 text-[11px]">
                      {reg.primaryVariable}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <RiskBadge risk={reg.risk} size="sm" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
