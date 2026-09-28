import React, { useState, useMemo } from 'react';
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
import { History, Filter, RotateCcw, AlertTriangle, CheckCircle2, CloudRain, Calendar, MapPin } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

export default function HistoricalPage({ historicalData = [] }) {
  const [filterYear, setFilterYear] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterSystem, setFilterSystem] = useState('all');
  const [filterVariable, setFilterVariable] = useState('all');

  // Filter events
  const filteredEvents = useMemo(() => {
    return historicalData.filter(item => {
      if (filterYear !== 'all' && item.year.toString() !== filterYear) return false;
      if (filterRegion !== 'all' && item.region.toLowerCase() !== filterRegion.toLowerCase()) return false;
      if (filterSystem !== 'all' && !item.weatherSystem.toLowerCase().includes(filterSystem.toLowerCase())) return false;
      if (filterVariable !== 'all' && item.variable.toLowerCase() !== filterVariable.toLowerCase()) return false;
      return true;
    });
  }, [historicalData, filterYear, filterRegion, filterSystem, filterVariable]);

  // Unique options for filters
  const years = useMemo(() => ['all', ...new Set(historicalData.map(d => d.year.toString()))], [historicalData]);
  const regions = useMemo(() => ['all', ...new Set(historicalData.map(d => d.region))], [historicalData]);
  const systems = useMemo(() => ['all', ...new Set(historicalData.map(d => d.weatherSystem))], [historicalData]);
  const variables = useMemo(() => ['all', ...new Set(historicalData.map(d => d.variable))], [historicalData]);

  // Aggregate 1: Bust frequency by lead time
  const bustByLead = useMemo(() => {
    const counts = {};
    filteredEvents.forEach(e => {
      const lead = e.forecastLead || `Day ${e.leadDays}`;
      counts[lead] = (counts[lead] || 0) + (e.bust === 'YES' ? 1 : 0);
    });
    return Object.keys(counts).map(k => ({ leadTime: k, count: counts[k] })).sort((a,b) => a.leadTime.localeCompare(b.leadTime));
  }, [filteredEvents]);

  // Aggregate 2: Average error by weather system
  const errorBySystem = useMemo(() => {
    const map = {};
    filteredEvents.forEach(e => {
      if (!map[e.weatherSystem]) map[e.weatherSystem] = { total: 0, count: 0 };
      map[e.weatherSystem].total += e.error;
      map[e.weatherSystem].count += 1;
    });
    return Object.keys(map).map(k => ({
      system: k,
      avgError: Math.round((map[k].total / map[k].count) * 10) / 10
    })).sort((a,b) => b.avgError - a.avgError);
  }, [filteredEvents]);

  // Aggregate 3: Regional bust frequency
  const bustByRegion = useMemo(() => {
    const map = {};
    filteredEvents.forEach(e => {
      map[e.region] = (map[e.region] || 0) + 1;
    });
    return Object.keys(map).map(k => ({
      region: k,
      count: map[k]
    })).sort((a,b) => b.count - a.count);
  }, [filteredEvents]);

  const handleReset = () => {
    setFilterYear('all');
    setFilterRegion('all');
    setFilterSystem('all');
    setFilterVariable('all');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Title */}
      <div className="border-b border-meteo-border/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <History className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Historical Forecast Bust Climatology
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Catalog of major verified medium-range forecast busts across Indian meteorological subdivisions (2022–2025).
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-meteo-border/30 pb-2">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            Historical Archive Filters
          </span>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3 text-sky-400" />
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Year</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full bg-[#080d1e] border border-meteo-border/70 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-400"
            >
              {years.map(y => <option key={y} value={y}>{y === 'all' ? 'All Years' : y}</option>)}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Region</label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full bg-[#080d1e] border border-meteo-border/70 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-400"
            >
              {regions.map(r => <option key={r} value={r}>{r === 'all' ? 'All Regions' : r}</option>)}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Weather System</label>
            <select
              value={filterSystem}
              onChange={(e) => setFilterSystem(e.target.value)}
              className="w-full bg-[#080d1e] border border-meteo-border/70 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-400"
            >
              {systems.map(s => <option key={s} value={s}>{s === 'all' ? 'All Systems' : s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Variable</label>
            <select
              value={filterVariable}
              onChange={(e) => setFilterVariable(e.target.value)}
              className="w-full bg-[#080d1e] border border-meteo-border/70 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-400"
            >
              {variables.map(v => <option key={v} value={v}>{v === 'all' ? 'All Variables' : v}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Aggregate Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Chart 1: Bust Frequency by Lead Time */}
        <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 shadow-lg flex flex-col justify-between">
          <div className="border-b border-meteo-border/40 pb-2 mb-3">
            <h4 className="text-xs font-bold text-white uppercase font-mono">
              Bust Frequency by Lead Time
            </h4>
            <span className="text-[10px] text-slate-400">Total bust events categorized by horizon</span>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bustByLead} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="leadTime" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e193d', borderColor: '#1e3a8a', fontSize: '11px' }} 
                />
                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Average Error by Weather System */}
        <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 shadow-lg flex flex-col justify-between">
          <div className="border-b border-meteo-border/40 pb-2 mb-3">
            <h4 className="text-xs font-bold text-white uppercase font-mono">
              Average Error % by Synoptic System
            </h4>
            <span className="text-[10px] text-slate-400">Magnitude of forecast miss (%)</span>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorBySystem} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} opacity={0.5} />
                <XAxis type="number" stroke="#64748b" fontSize={10} unit="%" tickLine={false} />
                <YAxis type="category" dataKey="system" stroke="#94a3b8" fontSize={9} tickLine={false} width={85} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e193d', borderColor: '#1e3a8a', fontSize: '11px' }} 
                />
                <Bar dataKey="avgError" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Regional Bust Frequency */}
        <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 shadow-lg flex flex-col justify-between">
          <div className="border-b border-meteo-border/40 pb-2 mb-3">
            <h4 className="text-xs font-bold text-white uppercase font-mono">
              Regional Incident Frequency
            </h4>
            <span className="text-[10px] text-slate-400">Top error-prone meteorological stations</span>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bustByRegion.slice(0, 5)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="region" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e193d', borderColor: '#1e3a8a', fontSize: '11px' }} 
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Historical Events Table */}
      <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-meteo-border/40 pb-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono">
            Historical Incident Ledger ({filteredEvents.length} Events)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Ground-Truth AWS / Radar Reanalysis
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-meteo-border/60 text-[11px] font-mono text-slate-400 uppercase bg-[#080d1e]/80">
                <th className="py-2.5 px-3">Event & Date</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">Weather System</th>
                <th className="py-2.5 px-3">Lead Time</th>
                <th className="py-2.5 px-3">Predicted</th>
                <th className="py-2.5 px-3">Observed</th>
                <th className="py-2.5 px-3">Error %</th>
                <th className="py-2.5 px-3 text-right">Bust Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-meteo-border/30">
              {filteredEvents.map((evt) => {
                const isBust = evt.bust === 'YES';
                return (
                  <tr key={evt.id} className="hover:bg-[#12224d]/60 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-white block">{evt.event}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{evt.date}</span>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {evt.region}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                        {evt.weatherSystem}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-sky-400 font-semibold">
                      {evt.forecastLead}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-300">
                      {evt.predictedValue}
                    </td>

                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                      {evt.observedValue}
                    </td>

                    <td className="py-3 px-3 font-mono font-extrabold text-rose-400">
                      +{evt.error}%
                    </td>

                    <td className="py-3 px-3 text-right">
                      {isBust ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold text-[11px]">
                          <AlertTriangle className="w-3 h-3" />
                          BUST
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          VERIFIED
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
