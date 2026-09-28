import React from 'react';
import HeroSummary from '../components/HeroSummary';
import ControlPanel from '../components/ControlPanel';
import ConfidenceMapLegend from '../components/ConfidenceMapLegend';
import ForecastMap from '../components/ForecastMap';
import ConfidenceChart from '../components/ConfidenceChart';
import BustProbabilityChart from '../components/BustProbabilityChart';
import ForecastVsObserved from '../components/ForecastVsObserved';
import RegionTable from '../components/RegionTable';
import PipelineVisualizer from '../components/PipelineVisualizer';
import OperationalAlert from '../components/OperationalAlert';
import LoadingSkeleton from '../components/LoadingSkeleton';
import LiveAIBriefing from '../components/LiveAIBriefing';
import LocationInspector from '../components/LocationInspector';

export default function DashboardPage({
  loading,
  regions,
  selectedRegionId,
  setSelectedRegionId,
  selectedZone,
  setSelectedZone,
  leadTime,
  setLeadTime,
  weatherSystem,
  setWeatherSystem,
  variable,
  setVariable,
  activeLayer,
  setActiveLayer,
  confidenceData,
  leadTimeCurve,
  forecastData,
  onResetFilters,
  onNavigate,
  isLiveMode,
  liveData,
  liveLoading,
  onRefreshLive,
  userLocation,
  locating,
  onLocateMe,
  onSelectCity,
  onMapClick,
  onClearLocation
}) {
  const currentRegion = regions.find(r => r.id === selectedRegionId) || regions[0] || {};
  const currentConfidence = confidenceData?.confidence ?? 72;
  const currentBustProb = confidenceData?.bustProbability ?? 18.4;
  const highRiskCount = regions.filter(r => r.bustProbability >= 40).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Live AI Synoptic Briefing when Live Mode is toggled */}
      {isLiveMode && (
        <LiveAIBriefing
          liveData={liveData}
          loading={liveLoading}
          onRefresh={onRefreshLive}
          regionName={currentRegion.name || currentRegion.region}
          leadTime={leadTime}
          weatherSystem={weatherSystem}
        />
      )}

      {/* Critical Operational Alert */}
      <OperationalAlert
        alert={{
          title: 'High Forecast Uncertainty Detected',
          region: 'Odisha & Gangetic West Bengal',
          leadTime: `Day ${leadTime}`,
          bustProbability: currentBustProb >= 40 ? currentBustProb : 68.4,
          reason: 'Rapid pressure gradient change + intense 850 hPa moisture convergence + historical NWP bias.',
          actionRequired: 'Issue operational meteorological advisory to regional disaster management center.'
        }}
        onViewAnalysis={() => onNavigate('bust-detection')}
      />

      {/* Hero Summary Section */}
      <HeroSummary
        confidence={currentConfidence}
        bustProbability={currentBustProb}
        highRiskCount={highRiskCount}
        leadTime={leadTime}
        selectedRegionName={currentRegion.name || currentRegion.region || 'India (Aggregate)'}
        onViewBustDetection={() => onNavigate('bust-detection')}
      />

      {/* Control Panel */}
      <ControlPanel
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        selectedRegion={selectedRegionId}
        setSelectedRegion={setSelectedRegionId}
        regionsList={regions}
        leadTime={leadTime}
        setLeadTime={setLeadTime}
        weatherSystem={weatherSystem}
        setWeatherSystem={setWeatherSystem}
        variable={variable}
        setVariable={setVariable}
        onReset={onResetFilters}
      />

      {/* Map Legend & Layer Controls */}
      <ConfidenceMapLegend
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
      />

      {/* Live Location Weather & AI Bust Inspector */}
      {userLocation && (
        <LocationInspector
          locationData={userLocation}
          onClose={onClearLocation}
          onFocusOnMap={() => {
            const el = document.getElementById('forecast-map-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Map */}
      <div id="forecast-map-section">
        <ForecastMap
          regions={regions}
          selectedRegionId={selectedRegionId}
          onSelectRegion={(id) => setSelectedRegionId(id)}
          activeLayer={activeLayer}
          leadTime={leadTime}
          weatherSystem={weatherSystem}
          variable={variable}
          userLocation={userLocation}
          onLocateMe={onLocateMe}
          onSelectCity={onSelectCity}
          onMapClick={onMapClick}
          locating={locating}
        />
      </div>

      {/* Charts Row: Forecast Confidence Chart & Bust Probability Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfidenceChart
          data={leadTimeCurve}
          regionName={currentRegion.name || currentRegion.region || 'Odisha'}
          activeLeadTime={leadTime}
        />
        <BustProbabilityChart
          data={leadTimeCurve}
          regionName={currentRegion.name || currentRegion.region || 'Odisha'}
          activeLeadTime={leadTime}
        />
      </div>

      {/* Forecast vs Observed Verification */}
      <ForecastVsObserved
        activeVariable={variable}
        forecastVsObservedData={forecastData?.forecastVsObserved}
        onVariableChange={(v) => setVariable(v)}
      />

      {/* Error-Prone Area Ranked Table */}
      <RegionTable
        regions={regions}
        selectedRegionId={selectedRegionId}
        onSelectRegion={(id) => setSelectedRegionId(id)}
        leadTime={leadTime}
      />

      {/* SIH Presentation Workflow Pipeline */}
      <PipelineVisualizer />

    </div>
  );
}
