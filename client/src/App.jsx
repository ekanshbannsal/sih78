import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import ForecastAnalysisPage from './pages/ForecastAnalysisPage';
import BustDetectionPage from './pages/BustDetectionPage';
import ExplainabilityPage from './pages/ExplainabilityPage';
import HistoricalPage from './pages/HistoricalPage';
import AIModelPage from './pages/AIModelPage';
import AboutPage from './pages/AboutPage';
import LoadingSkeleton from './components/LoadingSkeleton';
import { 
  fetchHealth, 
  fetchRegions, 
  fetchConfidence, 
  fetchBustProbability, 
  fetchForecastData, 
  fetchExplainability, 
  fetchHistorical, 
  fetchAlerts, 
  fetchMetrics,
  fetchLiveAnalysis,
  fetchLocationWeather
} from './services/api';
import { 
  AlertCircle, 
  RotateCcw, 
  Radio, 
  X, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Mode: Demo Mode (default) vs Live Mode
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);

  // Filters State
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedRegionId, setSelectedRegionId] = useState('odisha');
  const [leadTime, setLeadTime] = useState(5);
  const [weatherSystem, setWeatherSystem] = useState('Monsoon Depression');
  const [variable, setVariable] = useState('Rainfall');
  const [activeLayer, setActiveLayer] = useState('Bust Probability');

  // Data State
  const [regions, setRegions] = useState([]);
  const [confidenceData, setConfidenceData] = useState(null);
  const [leadTimeCurve, setLeadTimeCurve] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [explainabilityData, setExplainabilityData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [liveData, setLiveData] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);

  // System Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // GPS Geolocation Handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      handleSelectCity(28.6139, 77.2090, 'Delhi NCR (Default Location)');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetchLocationWeather({
          lat: latitude,
          lng: longitude,
          name: 'My Current Location',
          leadTime
        });
        if (res) {
          setUserLocation(res);
        }
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation permission error or unavailable:', err);
        // Fallback to Delhi NCR smoothly so user immediately sees location weather
        handleSelectCity(28.6139, 77.2090, 'Delhi NCR (Default Location)');
        setLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Indian City Selector Handler
  const handleSelectCity = async (lat, lng, name) => {
    setLocating(true);
    const res = await fetchLocationWeather({ lat, lng, name, leadTime });
    if (res) {
      setUserLocation(res);
    }
    setLocating(false);
  };

  // Map Click Coordinate Inspector
  const handleMapClick = async (lat, lng) => {
    setLocating(true);
    const res = await fetchLocationWeather({
      lat,
      lng,
      name: `Pin (${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E)`,
      leadTime
    });
    if (res) {
      setUserLocation(res);
    }
    setLocating(false);
  };

  const fetchLiveBriefing = useCallback(async () => {
    try {
      setLiveLoading(true);
      const res = await fetchLiveAnalysis({
        region: selectedRegionId,
        leadTime,
        weatherSystem,
        variable,
        bustProbability: confidenceData?.bustProbability,
        confidence: confidenceData?.confidence
      });
      if (res) setLiveData(res);
    } catch (err) {
      console.warn('Failed to load live briefing:', err);
    } finally {
      setLiveLoading(false);
    }
  }, [selectedRegionId, leadTime, weatherSystem, variable, confidenceData]);

  useEffect(() => {
    if (isLiveMode) {
      fetchLiveBriefing();
    }
  }, [isLiveMode, selectedRegionId, leadTime, weatherSystem, variable, fetchLiveBriefing]);

  // Load all primary data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch regions ranked list
      const regRes = await fetchRegions({
        leadTime,
        weatherSystem,
        variable,
        zone: selectedZone
      });

      if (regRes?.regions) {
        setRegions(regRes.regions);
      }

      // Fetch current confidence & bust probability for selected region
      const [confRes, bustRes, fcstRes, expRes, histRes, metRes, altRes] = await Promise.all([
        fetchConfidence({ region: selectedRegionId, leadTime, weatherSystem, variable }),
        fetchBustProbability({ region: selectedRegionId, leadTime, weatherSystem, variable }),
        fetchForecastData({ variable }),
        fetchExplainability({ region: selectedRegionId, leadTime, weatherSystem, variable }),
        fetchHistorical(),
        fetchMetrics(),
        fetchAlerts()
      ]);

      if (confRes) setConfidenceData(confRes);
      if (bustRes?.curve) setLeadTimeCurve(bustRes.curve);
      if (fcstRes) setForecastData(fcstRes);
      if (expRes) setExplainabilityData(expRes);
      if (histRes?.events) setHistoricalData(histRes.events);
      if (metRes) setModelMetrics(metRes);
      if (altRes?.alerts) setAlerts(altRes.alerts);

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to synchronize with meteorological inference service. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  }, [selectedZone, selectedRegionId, leadTime, weatherSystem, variable]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Auto-initialize location on first mount so user immediately sees real-time coordinates and telemetry
  useEffect(() => {
    if (!userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const res = await fetchLocationWeather({
              lat: latitude,
              lng: longitude,
              name: 'My Current Location (GPS)',
              leadTime: 5
            });
            if (res) setUserLocation(res);
          },
          async () => {
            // Geolocation fallback: default to New Delhi (NCR)
            const res = await fetchLocationWeather({
              lat: 28.6139,
              lng: 77.2090,
              name: 'New Delhi (NCR)',
              leadTime: 5
            });
            if (res) setUserLocation(res);
          },
          { timeout: 5000, enableHighAccuracy: true }
        );
      } else {
        fetchLocationWeather({
          lat: 28.6139,
          lng: 77.2090,
          name: 'New Delhi (NCR)',
          leadTime: 5
        }).then(res => {
          if (res) setUserLocation(res);
        });
      }
    }
  }, []);

  // Reset filters handler
  const handleResetFilters = () => {
    setSelectedZone('all');
    setSelectedRegionId('odisha');
    setLeadTime(5);
    setWeatherSystem('Monsoon Depression');
    setVariable('Rainfall');
    setActiveLayer('Bust Probability');
  };

  const handleLiveModeNotice = () => {
    setShowLiveModal(true);
  };

  return (
    <div className="min-h-screen bg-[#080d1e] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isLiveMode={isLiveMode}
        setIsLiveMode={setIsLiveMode}
        onLiveModeNotice={handleLiveModeNotice}
        alertCount={alerts.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        
        {/* Network / Connection Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-rose-500/60 bg-rose-950/40 text-rose-200 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Tab Routing */}
        {loading && !regions.length ? (
          <div className="space-y-6 pt-4">
            <LoadingSkeleton type="metric" />
            <LoadingSkeleton type="chart" />
            <LoadingSkeleton type="table" />
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardPage
                loading={loading}
                regions={regions}
                selectedRegionId={selectedRegionId}
                setSelectedRegionId={setSelectedRegionId}
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
                leadTime={leadTime}
                setLeadTime={setLeadTime}
                weatherSystem={weatherSystem}
                setWeatherSystem={setWeatherSystem}
                variable={variable}
                setVariable={setVariable}
                activeLayer={activeLayer}
                setActiveLayer={setActiveLayer}
                confidenceData={confidenceData}
                leadTimeCurve={leadTimeCurve}
                forecastData={forecastData}
                onResetFilters={handleResetFilters}
                onNavigate={(tab) => setCurrentTab(tab)}
                isLiveMode={isLiveMode}
                liveData={liveData}
                liveLoading={liveLoading}
                onRefreshLive={fetchLiveBriefing}
                userLocation={userLocation}
                locating={locating}
                onLocateMe={handleLocateMe}
                onSelectCity={handleSelectCity}
                onMapClick={handleMapClick}
                onClearLocation={() => setUserLocation(null)}
              />
            )}

            {currentTab === 'forecast-analysis' && (
              <ForecastAnalysisPage
                regions={regions}
                selectedRegionId={selectedRegionId}
                setSelectedRegionId={setSelectedRegionId}
                leadTime={leadTime}
                setLeadTime={setLeadTime}
                leadTimeCurve={leadTimeCurve}
                variable={variable}
                setVariable={setVariable}
                weatherSystem={weatherSystem}
              />
            )}

            {currentTab === 'bust-detection' && (
              <BustDetectionPage
                confidenceData={confidenceData}
                selectedRegion={selectedRegionId}
                leadTime={leadTime}
                weatherSystem={weatherSystem}
                variable={variable}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'explainability' && (
              <ExplainabilityPage
                explainabilityData={explainabilityData}
                selectedRegion={selectedRegionId}
                leadTime={leadTime}
                weatherSystem={weatherSystem}
                variable={variable}
              />
            )}

            {currentTab === 'historical' && (
              <HistoricalPage
                historicalData={historicalData}
              />
            )}

            {currentTab === 'model' && (
              <AIModelPage
                metrics={modelMetrics}
              />
            )}

            {currentTab === 'about' && (
              <AboutPage />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setCurrentTab(tab)} />

      {/* Live Mode Notice Modal */}
      {showLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0e193d] border border-meteo-border max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-meteo-border/40 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Live Data Connector Configuration</span>
              </div>
              <button
                onClick={() => setShowLiveModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <p className="font-semibold text-white">
                Live NWP/observation data connector is not configured.
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                This is a Smart India Hackathon operational prototype. In production, live connections will ingest real-time NetCDF/GRIB2 feeds from IMD National Climate Centre and NCMRWF ensemble forecasts via authenticated SFTP/S3 buckets.
              </p>
              <div className="p-3 bg-[#080d1e] rounded-lg border border-slate-800 text-xs font-mono text-sky-300">
                ACTIVE STATUS: DEMO_MODE = ENABLED (Deterministically calibrated meteorological mock).
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLiveModal(false)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Acknowledge & Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
