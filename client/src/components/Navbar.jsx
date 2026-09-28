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
  Bell, 
  Database,
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
    { id: 'forecast-analysis', label: 'Forecast Analysis', icon: BarChart3 },
    { id: 'bust-detection', label: 'Bust Detection', icon: ShieldAlert },
    { id: 'explainability', label: 'Explainability', icon: BrainCircuit },
    { id: 'historical', label: 'Historical Analysis', icon: History },
    { id: 'model', label: 'AI Model', icon: Cpu },
    { id: 'about', label: 'About', icon: HelpCircle },
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
    <header className="sticky top-0 z-50 w-full border-b border-meteo-border/60 bg-[#080d1e]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Subtitle */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 p-0.5 shadow-md shadow-sky-900/40">
              <div className="w-full h-full bg-[#080d1e] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-sans">
                  ForecastGuard <span className="text-sky-400">AI</span>
                </span>
                <span className="hidden md:inline-flex text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-600/40 text-sky-300">
                  SIH-79
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 tracking-normal hidden sm:block">
                AI-Powered Medium-Range Forecast Bust Detection
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/40 shadow-sm shadow-sky-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Live vs Demo Toggle */}
            <div className="hidden sm:flex items-center bg-[#0d1838] border border-meteo-border/60 rounded-lg p-0.5 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setIsLiveMode(false)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  !isLiveMode
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                DEMO DATA
              </button>
              <button
                type="button"
                onClick={() => setIsLiveMode(true)}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  isLiveMode
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                    : 'text-emerald-400 hover:text-emerald-300'
                }`}
                title="Live Synoptic AI Enabled via API Key"
              >
                <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
                <span>LIVE AI FEED</span>
              </button>
            </div>

            {/* System Status Online Pill */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONLINE</span>
            </div>

            {/* Last Data Update */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeString}</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-meteo-border/60 bg-[#0b1329] px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {/* Mobile Live/Demo Switch */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Data Stream:</span>
            <div className="flex items-center bg-[#080d1e] border border-meteo-border/60 rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => handleModeToggle('demo')}
                className={`px-3 py-1 rounded ${!isLiveMode ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
              >
                DEMO DATA
              </button>
              <button
                onClick={() => handleModeToggle('live')}
                className={`px-3 py-1 rounded ${isLiveMode ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-sky-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
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
