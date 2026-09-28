import React from 'react';
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  CloudRain, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Compass, 
  Radio,
  Calendar,
  X
} from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function LocationInspector({
  locationData,
  onClose,
  onFocusOnMap
}) {
  if (!locationData) return null;

  const { location, liveWeather, bustProbability, confidence, risk, forecastError, aiBriefing, leadTime } = locationData;

  return (
    <div className="rounded-2xl border border-sky-500/50 bg-gradient-to-br from-[#091838] via-[#0d1e44] to-[#0c1630] p-5 shadow-2xl relative overflow-hidden animate-fadeIn">
      
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-500/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 shrink-0">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {location.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-semibold">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                  LIVE GROUND TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Coordinates: <strong className="text-sky-300">{location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E</strong> &nbsp;|&nbsp; Nearest Subdivision: <strong className="text-slate-100">{location.nearestSubdivision} ({location.zone})</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onFocusOnMap && (
              <button
                type="button"
                onClick={onFocusOnMap}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-300 bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 transition-colors"
              >
                Focus On Map
              </button>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live Weather Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          
          <div className="bg-[#080d1e] p-3 rounded-xl border border-meteo-border/60">
            <span className="text-slate-400 font-mono text-[10px] uppercase flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Temperature
            </span>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-xl font-black text-white">{liveWeather.temperature ?? '--'}</span>
              <span className="text-xs text-slate-400 font-mono">°C</span>
            </div>
            <span className="text-[10px] text-slate-400">Feels like {liveWeather.feelsLike ?? '--'}°C</span>
          </div>

          <div className="bg-[#080d1e] p-3 rounded-xl border border-meteo-border/60">
            <span className="text-slate-400 font-mono text-[10px] uppercase flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              Relative Humidity
            </span>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-xl font-black text-cyan-300">{liveWeather.humidity ?? '--'}</span>
              <span className="text-xs text-slate-400 font-mono">%</span>
            </div>
            <span className="text-[10px] text-cyan-400/80">Boundary layer saturation</span>
          </div>

          <div className="bg-[#080d1e] p-3 rounded-xl border border-meteo-border/60">
            <span className="text-slate-400 font-mono text-[10px] uppercase flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
              Surface Pressure
            </span>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-xl font-black text-purple-300">{liveWeather.surfacePressure ?? '--'}</span>
              <span className="text-xs text-slate-400 font-mono">hPa</span>
            </div>
            <span className="text-[10px] text-purple-400/80">Barometric gradient</span>
          </div>

          <div className="bg-[#080d1e] p-3 rounded-xl border border-meteo-border/60">
            <span className="text-slate-400 font-mono text-[10px] uppercase flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              Surface Wind
            </span>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-xl font-black text-sky-300">{liveWeather.windSpeed ?? '--'}</span>
              <span className="text-xs text-slate-400 font-mono">km/h</span>
            </div>
            <span className="text-[10px] text-sky-400/80">10m anemometer speed</span>
          </div>

          <div className="bg-[#080d1e] p-3 rounded-xl border border-meteo-border/60 col-span-2 sm:col-span-1">
            <span className="text-slate-400 font-mono text-[10px] uppercase flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-emerald-400" />
              Precipitation
            </span>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-400">{liveWeather.precipitation ?? 0}</span>
              <span className="text-xs text-slate-400 font-mono">mm</span>
            </div>
            <span className="text-[10px] text-emerald-400/80">Current rate</span>
          </div>

        </div>

        {/* AI Forecast Bust Evaluation for this Location */}
        <div className="p-4 rounded-xl bg-[#081226]/90 border border-sky-500/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">
                AI Medium-Range Bust Vulnerability Assessment (Lead Day {leadTime})
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-2">
                <span>Forecast Bust Risk:</span>
                <span className={bustProbability >= 40 ? 'text-rose-400' : 'text-amber-400'}>
                  {bustProbability}% ({risk})
                </span>
                <span className="text-xs text-slate-400 font-normal">| Confidence: {confidence}%</span>
              </h4>
            </div>

            <RiskBadge risk={risk} size="md" />
          </div>

          {/* AI Meteorological Advisory */}
          {aiBriefing && (
            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-200">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-emerald-300">Live AI Briefing:</strong> {aiBriefing.operationalAdvisory || aiBriefing.synopticAnalysis}
                </p>
              </div>

              {aiBriefing.decisionSupportAction && (
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Operational Action:</strong> {aiBriefing.decisionSupportAction}</span>
                </div>
              )}
            </div>
          )}

          {/* 7-Day Daily Precipitation Forecast Trend */}
          {liveWeather.dailyForecast && liveWeather.dailyForecast.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">
                7-Day Precipitation Probability Outlook (%)
              </span>
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px]">
                {liveWeather.dailyForecast.slice(0, 7).map((day, idx) => (
                  <div key={day.date} className="p-1.5 bg-[#0b1633] rounded-lg border border-slate-800">
                    <span className="text-slate-400 block font-mono">Day {idx + 1}</span>
                    <span className={`font-bold mt-1 block ${
                      day.precipProb > 60 ? 'text-rose-400' : day.precipProb > 30 ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {day.precipProb}%
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{day.tempMax}° / {day.tempMin}°</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
