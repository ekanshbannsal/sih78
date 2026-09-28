import React from 'react';
import { 
  Filter, 
  Map, 
  Clock, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Gauge, 
  Droplets,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function ControlPanel({
  selectedZone,
  setSelectedZone,
  selectedRegion,
  setSelectedRegion,
  regionsList = [],
  leadTime,
  setLeadTime,
  weatherSystem,
  setWeatherSystem,
  variable,
  setVariable,
  onReset
}) {
  const zones = [
    { id: 'all', label: 'All India' },
    { id: 'North India', label: 'North India' },
    { id: 'Central India', label: 'Central India' },
    { id: 'South India', label: 'South India' },
    { id: 'Northeast India', label: 'Northeast India' },
    { id: 'West India', label: 'West India' },
    { id: 'East India', label: 'East India' }
  ];

  const weatherSystems = [
    { id: 'all', label: 'All Systems' },
    { id: 'Monsoon Depression', label: 'Monsoon Depression' },
    { id: 'Heavy Rainfall', label: 'Heavy Rainfall' },
    { id: 'Cyclone', label: 'Cyclone' },
    { id: 'Western Disturbance', label: 'Western Disturbance' },
    { id: 'Heat Wave', label: 'Heat Wave' },
    { id: 'Active Monsoon', label: 'Active Monsoon' },
    { id: 'Break Monsoon', label: 'Break Monsoon' }
  ];

  const variables = [
    { id: 'Rainfall', label: 'Rainfall', icon: CloudRain },
    { id: 'Temperature', label: 'Temperature', icon: Thermometer },
    { id: 'Wind', label: 'Wind', icon: Wind },
    { id: 'Pressure', label: 'Pressure', icon: Gauge },
    { id: 'Humidity', label: 'Humidity', icon: Droplets }
  ];

  // Filter available regions by zone
  const filteredRegions = selectedZone === 'all' 
    ? regionsList 
    : regionsList.filter(r => r.zone.toLowerCase() === selectedZone.toLowerCase());

  return (
    <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 sm:p-5 shadow-xl shadow-black/40 space-y-4">
      
      {/* Top Header of Control Panel */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-meteo-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Operational Filter & Horizon Controls
            </h2>
            <p className="text-[11px] text-slate-400">
              Tune meteorological variables to simulate AI bust vulnerability
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-colors"
          title="Reset to default operational baseline"
        >
          <RotateCcw className="w-3 h-3 text-sky-400" />
          <span>Reset Controls</span>
        </button>
      </div>

      {/* Row 1: Zone & Region + Weather System + Variable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Region & Zone Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-sky-400" />
              Meteorological Region
            </span>
            <span className="text-[10px] text-sky-400/80 font-mono">
              {filteredRegions.length} available
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedZone}
              onChange={(e) => {
                setSelectedZone(e.target.value);
                setSelectedRegion('all');
              }}
              className="w-full bg-[#080d1e] border border-meteo-border/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors font-medium"
            >
              {zones.map(z => (
                <option key={z.id} value={z.id}>{z.label}</option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#080d1e] border border-meteo-border/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors font-medium"
            >
              <option value="all">All Subdivisions</option>
              {filteredRegions.map(r => (
                <option key={r.id} value={r.id}>{r.name || r.region}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Weather System Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Active Synoptic System
          </label>
          <select
            value={weatherSystem}
            onChange={(e) => setWeatherSystem(e.target.value)}
            className="w-full bg-[#080d1e] border border-meteo-border/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors font-medium"
          >
            {weatherSystems.map(ws => (
              <option key={ws.id} value={ws.id}>{ws.label}</option>
            ))}
          </select>
        </div>

        {/* Meteorological Variable Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            Primary Evaluated Variable
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {variables.map(v => {
              const Icon = v.icon;
              const isActive = variable.toLowerCase() === v.id.toLowerCase();
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariable(v.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white font-semibold shadow-sm shadow-sky-500/30'
                      : 'bg-[#080d1e] text-slate-300 hover:text-white border border-meteo-border/60 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 2: Forecast Lead Time (Day 1 -> Day 10) Interactive Pills */}
      <div className="space-y-2 pt-2 border-t border-meteo-border/30">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            Forecast Lead Time Horizon
          </label>
          <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-600/30">
            Selected: Day {leadTime} ({leadTime * 24} Hours Out)
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => {
            const isSelected = leadTime === day;
            const isHighVulnerability = day >= 5;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setLeadTime(day)}
                className={`py-2 px-1 rounded-lg text-center transition-all flex flex-col items-center justify-center relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-sky-500 to-blue-600 text-white font-bold shadow-md shadow-sky-600/30 ring-2 ring-sky-400'
                    : 'bg-[#080d1e] text-slate-300 hover:text-white border border-meteo-border/70 hover:border-sky-500/50'
                }`}
              >
                <span className="text-[10px] uppercase font-mono tracking-tight text-slate-400 group-hover:text-slate-200">
                  {day === 1 ? 'Short' : day <= 4 ? 'Medium' : 'Extended'}
                </span>
                <span className="text-xs sm:text-sm font-extrabold">
                  Day {day}
                </span>
                {isHighVulnerability && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 absolute top-1 right-1" title="Elevated medium-range error spread" />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
