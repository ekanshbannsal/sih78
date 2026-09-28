import React, { useState } from 'react';
import { 
  CloudSun, 
  Binary, 
  History, 
  Compass, 
  Cpu, 
  Scale, 
  Map, 
  BrainCircuit, 
  ShieldCheck, 
  ChevronRight,
  ArrowDown,
  Info
} from 'lucide-react';

export default function PipelineVisualizer() {
  const [activeStep, setActiveStep] = useState(4); // default to ML Classifier

  const steps = [
    {
      step: 1,
      name: 'NWP Forecast',
      subtitle: 'Raw Numerical Ingestion',
      icon: CloudSun,
      color: 'from-blue-500 to-sky-500',
      description: 'Ingests multi-model ensemble outputs (NCMRWF NCUM, IMD GFS, ECMWF EPS) across Day 1 to 10 horizons.',
      tech: 'GRIB2 / NetCDF parser, 12km horizontal grid resolution'
    },
    {
      step: 2,
      name: 'Feature Extraction',
      subtitle: 'Atmospheric Dynamics',
      icon: Binary,
      color: 'from-sky-500 to-cyan-500',
      description: 'Extracts ensemble spread standard deviation, 850 hPa moisture convergence flux, baroclinic pressure gradients, and deep vertical wind shear.',
      tech: 'Spatial gradients, thermodynamic instability indices (CAPE/CIN)'
    },
    {
      step: 3,
      name: 'Historical Error Analysis',
      subtitle: 'Verification Bias Matrix',
      icon: History,
      color: 'from-cyan-500 to-teal-500',
      description: 'Queries 10-year observational ground-truth error catalog (AWS, Doppler Weather Radar, INSAT-3D) to benchmark systematic regional forecast biases.',
      tech: 'Subdivisional error climatology & seasonal bias correction'
    },
    {
      step: 4,
      name: 'Weather System Detection',
      subtitle: 'Synoptic Pattern ID',
      icon: Compass,
      color: 'from-teal-500 to-emerald-500',
      description: 'Classifies active meteorological systems (Monsoon Depression, Cyclone, Western Disturbance, Heat Wave, Active/Break phases) to select specialized sub-models.',
      tech: 'Vorticity centroid tracking & pressure contour classification'
    },
    {
      step: 5,
      name: 'ML Bust Classifier',
      subtitle: 'Ensemble Learning Core',
      icon: Cpu,
      color: 'from-emerald-500 to-amber-500',
      description: 'Gradient Boosted Trees (XGBoost / LightGBM) predict the binary and continuous probability of a forecast bust (error > 50% / 2x standard error).',
      tech: 'Multi-head gradient boosting with cost-sensitive loss weighting'
    },
    {
      step: 6,
      name: 'Probability Calibration',
      subtitle: 'Uncertainty Reliability',
      icon: Scale,
      color: 'from-amber-500 to-orange-500',
      description: 'Calibrates raw machine learning scores using Isotonic Regression and Platt scaling so predicted probabilities match real empirical bust frequencies.',
      tech: 'Brier score optimization & temperature scaling'
    },
    {
      step: 7,
      name: 'Confidence & Risk Map',
      subtitle: 'Spatial Risk Surfaces',
      icon: Map,
      color: 'from-orange-500 to-rose-500',
      description: 'Interpolates confidence levels and error categories onto Leaflet GIS layers across all 36 Indian meteorological sub-divisions.',
      tech: 'Subdivisional GIS geofencing & real-time risk tiering'
    },
    {
      step: 8,
      name: 'Explainable AI Output',
      subtitle: 'Operational Attribution',
      icon: BrainCircuit,
      color: 'from-rose-500 to-purple-600',
      description: 'Computes SHAP feature importance to explain exactly WHY the model is unconfident (e.g. ensemble spread vs moisture divergence), empowering meteorologists.',
      tech: 'TreeSHAP additive attribution & plain-language generator'
    }
  ];

  const current = steps[activeStep];

  return (
    <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-4 sm:p-6 shadow-xl shadow-black/40 space-y-5">
      
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-meteo-border/40 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono text-[10px] font-bold border border-sky-500/30 uppercase">
              SIH End-to-End Workflow Architecture
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              Operational AI Forecast Bust Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click any processing stage to inspect the meteorological logic, AI algorithms, and input/output contracts.
          </p>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40 self-start sm:self-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Pipeline Latency: ~180ms
        </span>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const isSelected = activeStep === idx;
          return (
            <button
              key={st.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#15234d] border-sky-400 shadow-md shadow-sky-500/20 ring-1 ring-sky-400'
                  : 'bg-[#080d1e] border-meteo-border/60 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    0{st.step}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${st.color} text-white`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white leading-tight line-clamp-1 group-hover:text-sky-300">
                  {st.name}
                </h4>
              </div>

              <span className="text-[9px] text-slate-400 font-mono mt-1 line-clamp-1">
                {st.subtitle}
              </span>

              {/* Step indicator arrow for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400 pointer-events-none">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Step Deep Dive Card */}
      <div className="rounded-xl border border-sky-500/30 bg-gradient-to-r from-[#0c1a3b] via-[#101e44] to-[#0c1630] p-4 sm:p-5 shadow-inner">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-sky-500/20 border border-sky-500/40 text-sky-400 font-mono text-xs font-bold flex items-center justify-center">
                {current.step}
              </span>
              <h4 className="text-base font-bold text-white">
                {current.name}: <span className="text-sky-300 font-normal">{current.subtitle}</span>
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {current.description}
            </p>
          </div>

          <div className="bg-[#080d1e] p-3 rounded-lg border border-meteo-border/60 shrink-0 md:min-w-[260px] text-xs">
            <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">
              Underlying Methodology
            </span>
            <p className="font-mono text-sky-300 text-xs font-semibold">
              {current.tech}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
