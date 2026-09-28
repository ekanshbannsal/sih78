import React from 'react';
import { 
  Gauge, 
  AlertOctagon, 
  MapPin, 
  Calendar, 
  Cpu, 
  TrendingUp, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import MetricCard from './MetricCard';

export default function HeroSummary({
  confidence = 72,
  bustProbability = 18.4,
  highRiskCount = 7,
  leadTime = 5,
  modelStatus = 'AI Model: Operational',
  selectedRegionName = 'India (Aggregate)',
  onViewBustDetection
}) {
  const getConfidenceStatus = (conf) => {
    if (conf >= 80) return { label: 'High', color: 'text-emerald-400' };
    if (conf >= 55) return { label: 'Moderate', color: 'text-amber-400' };
    return { label: 'Low', color: 'text-rose-400' };
  };

  const getBustStatus = (prob) => {
    if (prob < 20) return { label: 'Low Risk', color: 'text-emerald-400' };
    if (prob < 40) return { label: 'Moderate', color: 'text-amber-400' };
    if (prob < 60) return { label: 'High Risk', color: 'text-orange-400' };
    return { label: 'Very High', color: 'text-rose-400' };
  };

  const confStatus = getConfidenceStatus(confidence);
  const bustStatus = getBustStatus(bustProbability);

  return (
    <section className="space-y-4">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-meteo-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Medium-Range Forecast Confidence
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            AI-assisted detection of regions and lead times with elevated forecast uncertainty.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          <span>Scope: <strong className="text-slate-200">{selectedRegionName}</strong></span>
          <span className="text-slate-600">|</span>
          <span>Lead: <strong className="text-sky-300">Day {leadTime}</strong></span>
        </div>
      </div>

      {/* 5 Dynamic Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Card 1: Overall Forecast Confidence */}
        <MetricCard
          title="Forecast Confidence"
          value={`${confidence}%`}
          status={confStatus.label}
          statusColor={confStatus.color}
          icon={Gauge}
          accentColor="text-sky-400"
          borderColor="border-sky-800/40"
          bgGradient="from-[#111e42] to-[#0c1630]"
          hint="Inverse of ensemble dispersion"
        />

        {/* Card 2: Forecast Bust Probability */}
        <MetricCard
          title="Bust Probability"
          value={`${bustProbability}%`}
          status={bustStatus.label}
          statusColor={bustStatus.color}
          icon={AlertOctagon}
          accentColor="text-rose-400"
          borderColor="border-rose-900/40"
          bgGradient="from-[#21132f] to-[#0c1630]"
          hint="Chance of forecast failure"
          onClick={onViewBustDetection}
        />

        {/* Card 3: High-Risk Regions */}
        <MetricCard
          title="High-Risk Regions"
          value={`${highRiskCount}`}
          status={`${highRiskCount > 5 ? 'Elevated' : 'Guarded'}`}
          statusColor={highRiskCount > 5 ? 'text-amber-400' : 'text-emerald-400'}
          icon={MapPin}
          accentColor="text-amber-400"
          borderColor="border-amber-800/40"
          bgGradient="from-[#1e1b30] to-[#0c1630]"
          hint="Regions exceeding 40% risk"
        />

        {/* Card 4: Current Lead Time */}
        <MetricCard
          title="Current Lead Time"
          value={`Day ${leadTime}`}
          status={`${leadTime >= 6 ? 'Extended' : 'Synoptic'}`}
          statusColor="text-cyan-400"
          icon={Calendar}
          accentColor="text-cyan-400"
          borderColor="border-cyan-800/40"
          bgGradient="from-[#0f233f] to-[#0c1630]"
          hint="Forecast horizon evaluated"
        />

        {/* Card 5: Model Status */}
        <div className="col-span-2 md:col-span-1">
          <MetricCard
            title="Model Engine"
            value="FBC-v1.4"
            status="Operational"
            statusColor="text-emerald-400"
            icon={Cpu}
            accentColor="text-emerald-400"
            borderColor="border-emerald-800/40"
            bgGradient="from-[#0c242e] to-[#0c1630]"
            hint="Ensemble classifier ready"
          />
        </div>

      </div>
    </section>
  );
}
