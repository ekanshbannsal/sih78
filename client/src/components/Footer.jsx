import { ShieldAlert, GitBranch, ExternalLink, Activity, Info } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-meteo-border/60 bg-[#080d1e] text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-white font-sans text-sm">
                ForecastGuard AI <span className="text-sky-400">· SIH-79</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 text-[10px] font-mono border border-sky-800">
                PROTOTYPE
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              AI-Powered Medium-Range Forecast Bust Detection for Operational Meteorology
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
              Dashboard
            </button>
            <button onClick={() => onNavigate('bust-detection')} className="hover:text-white transition-colors">
              Bust Detection
            </button>
            <button onClick={() => onNavigate('explainability')} className="hover:text-white transition-colors">
              Explainability
            </button>
            <button onClick={() => onNavigate('historical')} className="hover:text-white transition-colors">
              Historical Analysis
            </button>
            <button onClick={() => onNavigate('model')} className="hover:text-white transition-colors">
              AI Model Card
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
              About & Roadmap
            </button>
          </div>
        </div>

        {/* SIH Disclaimer & Operational Boundary Box */}
        <div className="p-3.5 rounded-lg bg-[#0d1633] border border-meteo-border/60 flex items-start gap-2.5 text-[11px] text-slate-300 leading-relaxed">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Smart India Hackathon (SIH) Prototype Note:</strong> This application demonstrates an operational meteorological decision-support architecture. Simulated predictions, ensemble spreads, and validation metrics are grounded in physically plausible demo datasets to showcase how operational numerical weather prediction (NWP) models (NCMRWF NCUM, IMD GFS, ECMWF EPS) can be augmented with AI-based uncertainty classifiers.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
          <span>&copy; {new Date().getFullYear()} ForecastGuard AI. Built for Smart India Hackathon.</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Operational Backend v1.4.0 (Express + Node.js)
          </span>
        </div>

      </div>
    </footer>
  );
}
