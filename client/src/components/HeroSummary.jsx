import React from 'react';
import { 
  Gauge, 
  AlertOctagon, 
  MapPin, 
  Calendar, 
  Cpu, 
  Activity
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
    if (conf >= 80) return { label: 'High', color: 'text-emerald-300' };
    if (conf >= 55) return { label: 'Moderate', color: 'text-amber-300' };
    return { label: 'Low', color: 'text-rose-300' };
  };

  const getBustStatus = (prob) => {
    if (prob < 20) return { label: 'Low Risk', color: 'text-emerald-300' };
    if (prob < 40) return { label: 'Moderate', color: 'text-amber-300' };
    if (prob < 60) return { label: 'High Risk', color: 'text-orange-300' };
    return { label: 'Very High', color: 'text-rose-300' };
  };

  const confStatus = getConfidenceStatus(confidence);
  const bustStatus = getBustStatus(bustProbability);

  return (
    <section className="space-y-4">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse shadow-sm shadow-sky-400/80" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Medium-Range Forecast Confidence
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">
            AI-assisted detection of regions and lead times with elevated forecast uncertainty.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-[#0d1b3a] px-3.5 py-1.5 rounded-lg border border-sky-500/30 shadow-sm shrink-0">
          <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Scope: <strong className="text-white font-bold">{selectedRegionName}</strong></span>
          <span className="text-sky-600">|</span>
          <span>Lead: <strong className="text-sky-300 font-bold">Day {leadTime}</strong></span>
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
          borderColor="border-sky-800/60"
          bgGradient="from-[#112048] to-[#0c1630]"
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
          borderColor="border-rose-900/60"
          bgGradient="from-[#241334] to-[#0c1630]"
          hint="Chance of forecast failure"
          onClick={onViewBustDetection}
        />

        {/* Card 3: High-Risk Regions */}
        <MetricCard
          title="High-Risk Regions"
          value={`${highRiskCount}`}
          status={`${highRiskCount > 5 ? 'Elevated' : 'Guarded'}`}
          statusColor={highRiskCount > 5 ? 'text-amber-300' : 'text-emerald-300'}
          icon={MapPin}
          accentColor="text-amber-400"
          borderColor="border-amber-850/60"
          bgGradient="from-[#241d33] to-[#0c1630]"
          hint="Regions exceeding 40% risk"
        />

        {/* Card 4: Current Lead Time */}
        <MetricCard
          title="Current Lead Time"
          value={`Day ${leadTime}`}
          status={`${leadTime >= 6 ? 'Extended' : 'Synoptic'}`}
          statusColor="text-cyan-300"
          icon={Calendar}
          accentColor="text-cyan-400"
          borderColor="border-cyan-800/60"
          bgGradient="from-[#0f284a] to-[#0c1630]"
          hint="Forecast horizon evaluated"
        />

        {/* Card 5: Model Status */}
        <div className="col-span-2 md:col-span-1">
          <MetricCard
            title="Model Engine"
            value="FBC-v1.4"
            status="Operational"
            statusColor="text-emerald-300"
            icon={Cpu}
            accentColor="text-emerald-400"
            borderColor="border-emerald-800/60"
            bgGradient="from-[#0d2a35] to-[#0c1630]"
            hint="Ensemble classifier ready"
          />
        </div>

      </div>
    </section>
  );
}
