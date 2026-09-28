import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  Layers, 
  MapPin, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Gauge, 
  Droplets,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';
import ConfidenceChart from '../components/ConfidenceChart';
import BustProbabilityChart from '../components/BustProbabilityChart';
import RiskBadge from '../components/RiskBadge';

export default function ForecastAnalysisPage({
  regions = [],
  selectedRegionId,
  setSelectedRegionId,
  leadTime,
  setLeadTime,
  leadTimeCurve,
  variable,
  setVariable,
  weatherSystem
}) {
  const currentRegion = regions.find(r => r.id === selectedRegionId) || regions[0] || {};

  const variableComparison = [
    { name: 'Rainfall (QPF)', errorRisk: 'HIGH (42%)', sensitivity: 'Ensemble moisture dispersion & convection', bias: '-19.6 mm' },
    { name: 'Temperature (2m)', errorRisk: 'MODERATE (22%)', sensitivity: 'Boundary layer solar radiation absorption', bias: '-1.4 °C' },
    { name: 'Surface Wind (10m)', errorRisk: 'HIGH (38%)', sensitivity: 'Ghats & coastal orographic frictional drag', bias: '-11.2 km/h' },
    { name: 'Atmospheric Pressure', errorRisk: 'LOW (14%)', sensitivity: 'Synoptic scale barometric depressions', bias: '+3.7 hPa' },
    { name: 'Relative Humidity', errorRisk: 'MODERATE (26%)', sensitivity: 'Low level sea-breeze moisture inflow', bias: '-3.8 %' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title */}
      <div className="border-b border-meteo-border/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Medium-Range Forecast Horizon & Error Analysis
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Detailed error propagation mechanics from Day 1 synoptic certainty to Day 10 non-linear divergence.
        </p>
      </div>

      {/* Target Focus Selector */}
      <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-sky-400" />
          <div>
            <span className="text-xs text-slate-400 font-mono block">Selected Subdivision</span>
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="bg-[#080d1e] border border-meteo-border rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-sky-400"
            >
              {regions.map(r => (
                <option key={r.id} value={r.id}>{r.region || r.name} ({r.zone})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Synoptic Context:</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-bold border border-slate-700">
            {currentRegion.activeSystem || weatherSystem}
          </span>
        </div>
      </div>

      {/* Side-by-side Dual Decay Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfidenceChart
          data={leadTimeCurve}
          regionName={currentRegion.name || currentRegion.region}
          activeLeadTime={leadTime}
        />
        <BustProbabilityChart
          data={leadTimeCurve}
          regionName={currentRegion.name || currentRegion.region}
          activeLeadTime={leadTime}
        />
      </div>

      {/* Cross-Variable Uncertainty Sensitivity Analysis */}
      <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-meteo-border/40 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Multi-Variable Bust Sensitivity Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Comparative forecast vulnerability across core meteorological variables for {currentRegion.name || currentRegion.region}
            </p>
          </div>
          <span className="text-xs font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
            Medium-Range (Day 4–7)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-meteo-border/60 text-[11px] font-mono text-slate-400 uppercase bg-[#080d1e]/80">
                <th className="py-2.5 px-3">Atmospheric Variable</th>
                <th className="py-2.5 px-3">Bust Vulnerability</th>
                <th className="py-2.5 px-3">Key Dynamic Sensitivity</th>
                <th className="py-2.5 px-3 text-right">Systematic Climatological Bias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-meteo-border/30">
              {variableComparison.map((v) => (
                <tr key={v.name} className="hover:bg-[#12224d]/60">
                  <td className="py-3 px-3 font-bold text-white">
                    {v.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-rose-400">
                      {v.errorRisk}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {v.sensitivity}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-amber-300 font-semibold">
                    {v.bias}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
