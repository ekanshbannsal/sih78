import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  BarChart3, 
  BrainCircuit, 
  History, 
  HelpCircle, 
  Cpu, 
  Menu, 
  X, 
  Clock, 
  Radio
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  isLiveMode, 
  setIsLiveMode, 
  onLiveModeNotice,
  alertCount = 3 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeString] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC';
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'forecast-analysis', label: 'Forecasts', fullLabel: 'Forecast Analysis', icon: BarChart3 },
    { id: 'bust-detection', label: 'Bust Detection', fullLabel: 'Bust Detection', icon: ShieldAlert },
    { id: 'explainability', label: 'Explainability', fullLabel: 'AI Explainability', icon: BrainCircuit },
    { id: 'historical', label: 'Historical', fullLabel: 'Historical Analysis', icon: History },
    { id: 'model', label: 'AI Model', fullLabel: 'AI Architecture', icon: Cpu },
    { id: 'about', label: 'About', fullLabel: 'About System', icon: HelpCircle },
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModeToggle = (mode) => {
    if (mode === 'live') {
      onLiveModeNotice();
    } else {
      setIsLiveMode(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-500/20 bg-[#080d1e]/95 backdrop-blur-md shadow-lg shadow-black/40">
      <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 lg:gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 p-0.5 shadow-md shadow-sky-900/40 shrink-0">
              <div className="w-full h-full bg-[#080d1e] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-black text-base sm:text-lg tracking-tight text-white font-sans flex items-center">
                  ForecastGuard<span className="text-sky-400 ml-1">AI</span>
                </span>
                <span className="inline-flex text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-950/90 border border-sky-500/40 text-sky-300 whitespace-nowrap shadow-sm">
                  SIH-79
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium tracking-normal hidden xl:block whitespace-nowrap">
                AI-Powered Medium-Range Forecast Bust Detection
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 shrink-0" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.fullLabel || item.label}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50 shadow-sm shadow-sky-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Live vs Demo Stream Toggle */}
            <div className="flex items-center bg-[#0d1838] border border-sky-500/30 rounded-lg p-0.5 text-[11px] font-semibold shadow-inner">
              <button
                type="button"
                onClick={() => setIsLiveMode(false)}
                className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap font-bold ${
                  !isLiveMode
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DEMO DATA
              </button>
              <button
                type="button"
                onClick={() => setIsLiveMode(true)}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap font-bold ${
                  isLiveMode
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                    : 'text-emerald-400 hover:text-emerald-300'
                }`}
                title="Live Synoptic AI Enabled via API Key"
              >
                <Radio className="w-3 h-3 text-emerald-300 animate-pulse shrink-0" />
                <span>LIVE AI FEED</span>
              </button>
            </div>

            {/* System Status Online Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>ONLINE</span>
            </div>

            {/* Last Data Update */}
            <div className="hidden 2xl:flex items-center gap-1 text-xs text-slate-400 font-mono whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{timeString}</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sky-500/20 bg-[#0b1329] px-4 pt-3 pb-5 space-y-3 animate-fadeIn shadow-2xl">
          {/* Mobile Live/Demo Switch */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-300 font-medium">Operational Stream:</span>
            <div className="flex items-center bg-[#080d1e] border border-sky-500/30 rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => handleModeToggle('demo')}
                className={`px-3 py-1 rounded font-bold ${!isLiveMode ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
              >
                DEMO DATA
              </button>
              <button
                onClick={() => handleModeToggle('live')}
                className={`px-3 py-1 rounded font-bold ${isLiveMode ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                LIVE DATA
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{item.fullLabel || item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              STATUS: OPERATIONAL
            </span>
            <span>UPDATED: {timeString}</span>
          </div>
        </div>
      )}
    </header>
  );
}
