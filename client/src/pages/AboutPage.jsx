import React from 'react';
import { 
  HelpCircle, 
  Target, 
  Lightbulb, 
  Cpu, 
  Workflow, 
  TrendingUp, 
  Compass, 
  CheckCircle2, 
  Layers, 
  ShieldAlert, 
  CloudSun 
} from 'lucide-react';

export default function AboutPage() {
  const futureScopeItems = [
    { title: 'IMD / NCMRWF Direct Integration', desc: 'Direct GRIB2 pipe into India Meteorological Department (IMD) high-resolution regional NWP forecasts.' },
    { title: 'Real-Time INSAT-3D/3DR Satellite Data', desc: 'Ingestion of rapid-scan infrared and water vapor brightness temperature anomalies to detect convective ignition.' },
    { title: 'Full Ensemble Member Ingestion', desc: 'Direct assimilation of all 21 GEFS and 50 ECMWF EPS perturbation members for real standard deviation.' },
    { title: 'Automated Post-Event Model Retraining', desc: 'Continuous feedback loop automatically ingesting daily IMD AWS rain-gauge observations to correct regional biases.' },
    { title: 'Expanded Weather Variables', desc: 'Expanding beyond rainfall, temp, and wind to include lightning density, hail probability, and visibility.' },
    { title: 'District & Block-Level Downscaling', desc: 'Spatial AI downscaling from 12 km grid cells to 700+ Indian revenue districts and agricultural blocks.' },
    { title: 'CAP-Compliant Operational Alerting', desc: 'Integration with Common Alerting Protocol (CAP) and NDMA disaster response SMS broadcast networks.' },
    { title: 'Enterprise OpenAPI / Webhook SDK', desc: 'Restful OpenAPI specification allowing state disaster management authorities (SDMAs) to plug in alert feeds.' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="border-b border-meteo-border/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <HelpCircle className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            About ForecastGuard AI
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Smart India Hackathon Prototype: AI-Based Forecast Bust Detection for Medium-Range Weather Forecasts (Problem #79).
        </p>
      </div>

      {/* Grid: Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* The Problem */}
        <div className="rounded-xl border border-rose-500/30 bg-gradient-to-br from-[#1d122b] to-[#0c1630] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            The Operational Challenge
          </div>
          <h2 className="text-lg font-bold text-white">
            Medium-Range Forecast Busts in Rapidly Evolving Weather Systems
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Medium-range numerical weather prediction (NWP) models (Days 3–10) are the cornerstone of disaster preparedness, agriculture, and water management in India. However, during rapidly evolving synoptic events—such as monsoon depressions, cloudbursts, western disturbances, cyclones, and active/break monsoon transitions—global and regional models can experience sudden catastrophic failure ("forecast busts").
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Without reliable uncertainty quantification, emergency authorities either under-prepare for extreme deluges or suffer from warning fatigue due to false alarms.
          </p>
        </div>

        {/* The Solution */}
        <div className="rounded-xl border border-sky-500/30 bg-gradient-to-br from-[#0e2147] to-[#0c1630] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            Our AI-Driven Solution
          </div>
          <h2 className="text-lg font-bold text-white">
            Proactive Bust Probability & Explainable Meteorological Confidence
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong>ForecastGuard AI</strong> acts as an intelligent supervisor over raw numerical models. Instead of attempting to replace numerical physics, our system analyzes multi-model ensemble spread, atmospheric instability indices, and 10 years of historical verification error climatology to detect when a forecast is entering an unstable regime.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            By highlighting error-prone regions and lead times 4–6 days in advance—accompanied by plain-language meteorological reasoning—forecasters receive actionable operational decision support.
          </p>
        </div>

      </div>

      {/* AI Approach & Data Flow Architecture */}
      <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2 border-b border-meteo-border/40 pb-2">
          <Workflow className="w-4 h-4 text-sky-400" />
          AI Approach & Operational Data Flow
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#080d1e] p-4 rounded-xl border border-meteo-border/60 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-sky-400 flex items-center justify-center font-bold">1</div>
            <h4 className="font-bold text-white text-sm">Dynamic Feature Engineering</h4>
            <p className="text-slate-300 leading-relaxed">
              Computes ensemble spread across perturbation members, low-level moisture convergence, and sharp baroclinic pressure gradients to capture sub-grid convective chaos.
            </p>
          </div>

          <div className="bg-[#080d1e] p-4 rounded-xl border border-meteo-border/60 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">2</div>
            <h4 className="font-bold text-white text-sm">Calibrated Gradient Boosting</h4>
            <p className="text-slate-300 leading-relaxed">
              Gradient-boosted decision trees evaluate binary and continuous bust risk, calibrated via isotonic regression so a 40% probability corresponds to a 40% empirical historical bust rate.
            </p>
          </div>

          <div className="bg-[#080d1e] p-4 rounded-xl border border-meteo-border/60 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">3</div>
            <h4 className="font-bold text-white text-sm">Explainability & Decision Support</h4>
            <p className="text-slate-300 leading-relaxed">
              Calculates TreeSHAP local attributions to generate human-readable justifications, preventing black-box skepticism among senior operational meteorologists.
            </p>
          </div>
        </div>
      </div>

      {/* Expected Benefits */}
      <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-5 shadow-xl space-y-3">
        <h3 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2 border-b border-meteo-border/40 pb-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Expected Societal & Operational Benefits
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#080d1e] rounded-lg border border-meteo-border/60">
            <h4 className="font-bold text-white mb-1">Disaster Management</h4>
            <p className="text-slate-400">Pre-positioning NDRF and SDRF rescue assets 4–6 days ahead of time when bust probabilities signal high risk.</p>
          </div>
          <div className="p-3 bg-[#080d1e] rounded-lg border border-meteo-border/60">
            <h4 className="font-bold text-white mb-1">Agriculture & Sowing</h4>
            <p className="text-slate-400">Guiding farmers on whether to delay fertilizer or sowing operations during high-uncertainty monsoon transitions.</p>
          </div>
          <div className="p-3 bg-[#080d1e] rounded-lg border border-meteo-border/60">
            <h4 className="font-bold text-white mb-1">Reservoir Management</h4>
            <p className="text-slate-400">Preventing premature flood-gate releases or unexpected dam overflows through calibrated probabilistic safety bands.</p>
          </div>
          <div className="p-3 bg-[#080d1e] rounded-lg border border-meteo-border/60">
            <h4 className="font-bold text-white mb-1">Aviation & Energy</h4>
            <p className="text-slate-400">Planning renewable wind/solar dispatch and flight rerouting around high-gradient squall lines.</p>
          </div>
        </div>
      </div>

      {/* Future Scope Grid */}
      <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-5 shadow-xl space-y-4">
        <div className="border-b border-meteo-border/40 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Future Roadmap & Operational Scaling
            </h3>
            <p className="text-xs text-slate-400">Planned technical evolutions for national production deployment</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
            Next Milestones
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {futureScopeItems.map((item, i) => (
            <div key={i} className="bg-[#080d1e] p-3.5 rounded-lg border border-meteo-border/60 space-y-1.5 hover:border-sky-500/50 transition-colors">
              <span className="text-[10px] font-mono text-sky-400 font-bold block">0{i+1} PHASE</span>
              <h4 className="font-bold text-white">{item.title}</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
