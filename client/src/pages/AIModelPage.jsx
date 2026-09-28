import React from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Database, 
  Activity, 
  Binary, 
  Code, 
  Server,
  Sparkles
} from 'lucide-react';
import PipelineVisualizer from '../components/PipelineVisualizer';

export default function AIModelPage({ metrics }) {
  const modelMetrics = metrics?.metrics || {
    accuracy: 87,
    precision: 82,
    recall: 79,
    f1Score: 80,
    aucRoc: 0.91,
    calibrationBrierScore: 0.12
  };

  const inputFeatures = [
    'NWP Forecast Variables (QPF Rainfall, 2m Temp, 10m Wind, MSLP Pressure, Surface Humidity)',
    'Ensemble Spread (Perturbation standard deviation across 21 GEFS / 50 ECMWF members)',
    'Historical Forecast Error Climatology (10-year verification error matrix per region/season)',
    'Synoptic Weather System Classification (Depression, Cyclone, Western Disturbance, Heat Wave)',
    'Thermodynamic & Baroclinic Indices (CAPE, CIN, 850 hPa Moisture Divergence, Thickness)',
    'Deep Tropospheric Vertical Wind Shear (850 hPa to 200 hPa vector difference)',
    'Forecast Horizon Lead Time (Continuous Day 1 to Day 10 steps)'
  ];

  const outputTargets = [
    'Continuous Bust Probability (0.0% to 100.0%) via calibrated sigmoid output',
    'Forecast Confidence Score (0.0% to 100.0%) inversely proportional to ensemble divergence',
    'Expected Forecast Error Margin (± % absolute deviation from observational truth)',
    'Operational Alert Risk Tier (LOW, MODERATE, HIGH, VERY HIGH)',
    'SHAP Feature Contribution Vector for explainable operational decision-support'
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Title */}
      <div className="border-b border-meteo-border/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <Cpu className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            AI Model Architecture & Performance
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Technical specifications of the Forecast Bust Classifier (FBC-v1.4) ensemble machine learning model.
        </p>
      </div>

      {/* Mandatory SIH Demo Metrics Warning Label */}
      <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 text-xs text-amber-200/90 flex items-start gap-3 leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">Important Prototype Notice:</strong> The performance scores below represent <strong className="underline">Demo / validation metrics</strong> on simulated test partitions. They are designed to demonstrate operational decision-support feasibility for the Smart India Hackathon and do NOT claim scientifically validated IMD operational verification.
        </div>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Accuracy */}
        <div className="rounded-xl border border-sky-500/40 bg-[#0d1738] p-4 text-center">
          <span className="text-xs text-slate-400 font-mono uppercase block">Model Accuracy</span>
          <div className="mt-2 text-3xl sm:text-4xl font-black text-sky-400">
            {modelMetrics.accuracy}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            Demo / validation metrics
          </span>
        </div>

        {/* Precision */}
        <div className="rounded-xl border border-emerald-500/40 bg-[#0d1738] p-4 text-center">
          <span className="text-xs text-slate-400 font-mono uppercase block">Precision</span>
          <div className="mt-2 text-3xl sm:text-4xl font-black text-emerald-400">
            {modelMetrics.precision}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            Demo / validation metrics
          </span>
        </div>

        {/* Recall */}
        <div className="rounded-xl border border-amber-500/40 bg-[#0d1738] p-4 text-center">
          <span className="text-xs text-slate-400 font-mono uppercase block">Recall (Sensitivity)</span>
          <div className="mt-2 text-3xl sm:text-4xl font-black text-amber-400">
            {modelMetrics.recall}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            Demo / validation metrics
          </span>
        </div>

        {/* F1 Score */}
        <div className="rounded-xl border border-purple-500/40 bg-[#0d1738] p-4 text-center">
          <span className="text-xs text-slate-400 font-mono uppercase block">F1 Harmonic Score</span>
          <div className="mt-2 text-3xl sm:text-4xl font-black text-purple-400">
            {modelMetrics.f1Score}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            Demo / validation metrics
          </span>
        </div>

      </div>

      {/* Model Specification Card */}
      <div className="rounded-xl border border-meteo-border/60 bg-[#0d1738]/95 p-5 shadow-xl space-y-4">
        <div className="border-b border-meteo-border/40 pb-3">
          <h3 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            Model Specifications: Forecast Bust Classifier
          </h3>
          <span className="text-xs text-slate-400">
            Architecture: Multi-Head Gradient Boosted Ensemble + Platt Probability Calibration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Input Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-sky-300 uppercase flex items-center gap-1.5">
              <Binary className="w-4 h-4 text-sky-400" />
              Input Feature Matrix (N = 7 Atmospheric Domains)
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {inputFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 bg-[#080d1e] p-2.5 rounded-lg border border-meteo-border/60">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Output Targets */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Calibrated Inference Outputs
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {outputTargets.map((out, i) => (
                <li key={i} className="flex items-start gap-2 bg-[#080d1e] p-2.5 rounded-lg border border-meteo-border/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* End-to-End Visual Workflow Pipeline */}
      <PipelineVisualizer />

    </div>
  );
}
