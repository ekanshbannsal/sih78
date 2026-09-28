import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { 
  ShieldAlert, 
  LocateFixed, 
  Search, 
  MapPin
} from 'lucide-react';
import RiskBadge from './RiskBadge';

// Helper component to center map on selection
function MapController({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

// Map Click Listener to inspect arbitrary coordinates
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

const INDIAN_CITIES = [
  { name: 'New Delhi (NCR)', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Bhubaneswar, Odisha', lat: 20.2961, lng: 85.8245 },
  { name: 'Guwahati, Assam', lat: 26.1445, lng: 91.7362 },
  { name: 'Srinagar, J&K', lat: 34.0837, lng: 74.7973 },
  { name: 'Kochi, Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Lucknow, Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Patna, Bihar', lat: 25.5941, lng: 85.1376 },
  { name: 'Bhopal, Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Chandigarh, Punjab', lat: 30.7333, lng: 76.7794 },
  { name: 'Dehradun, Uttarakhand', lat: 30.3165, lng: 78.0322 },
  { name: 'Shimla, Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
  { name: 'Ranchi, Jharkhand', lat: 23.3441, lng: 85.3096 },
  { name: 'Raipur, Chhattisgarh', lat: 21.2514, lng: 81.6296 },
  { name: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185 }
];

export default function ForecastMap({
  regions = [],
  selectedRegionId,
  onSelectRegion,
  activeLayer = 'Bust Probability',
  leadTime = 5,
  weatherSystem = 'all',
  variable = 'Rainfall',
  userLocation,
  onLocateMe,
  onSelectCity,
  onMapClick,
  locating = false
}) {
  const mapCenter = useMemo(() => [22.8, 80.5], []);
  const defaultZoom = 4.8;

  // Selected region coordinates if specific
  const selectedRegion = useMemo(() => {
    if (!selectedRegionId || selectedRegionId === 'all') return null;
    return regions.find(r => r.id === selectedRegionId);
  }, [regions, selectedRegionId]);

  // Priority target coordinate for map centering
  const activeFocus = useMemo(() => {
    if (userLocation?.location) {
      return [userLocation.location.latitude, userLocation.location.longitude];
    }
    if (selectedRegion) {
      return [selectedRegion.lat, selectedRegion.lng];
    }
    return null;
  }, [userLocation, selectedRegion]);

  // Color generator based on current activeLayer and score
  const getMarkerStyle = (region) => {
    const isSelected = selectedRegionId === region.id;
    let fillColor = '#10b981'; // green default
    let scoreText = `${region.bustProbability}%`;
    let val = region.bustProbability;

    if (activeLayer === 'Confidence') {
      val = region.confidence;
      scoreText = `${region.confidence}%`;
      if (val >= 75) fillColor = '#10b981';
      else if (val >= 50) fillColor = '#f59e0b';
      else if (val >= 35) fillColor = '#f97316';
      else fillColor = '#ef4444';
    } else if (activeLayer === 'Forecast Error') {
      val = region.forecastError;
      scoreText = `±${region.forecastError}%`;
      if (val < 15) fillColor = '#10b981';
      else if (val < 25) fillColor = '#f59e0b';
      else if (val < 35) fillColor = '#f97316';
      else fillColor = '#ef4444';
    } else {
      // Default: Bust Probability
      if (val < 20) fillColor = '#10b981';
      else if (val < 40) fillColor = '#f59e0b';
      else if (val < 60) fillColor = '#f97316';
      else fillColor = '#ef4444';
    }

    return {
      fillColor,
      color: isSelected ? '#ffffff' : fillColor,
      weight: isSelected ? 3 : 1.5,
      fillOpacity: isSelected ? 0.85 : 0.65,
      radius: isSelected ? 22 : 16,
      scoreText,
      isVeryHigh: region.bustProbability >= 60
    };
  };

  return (
    <div className="relative rounded-xl border border-meteo-border/60 bg-[#0b1329] overflow-hidden shadow-2xl shadow-black/50">
      
      {/* Map Header Bar with Location Search & GPS Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-[#0e193d] border-b border-meteo-border/60 text-xs">
        
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200 tracking-wide font-mono uppercase">
            Interactive India Meteorological Bust-Risk Surface
          </span>
          <span className="hidden md:inline-block text-[11px] text-sky-400 font-mono">
            Layer: {activeLayer}
          </span>
        </div>

        {/* Location & GPS Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Quick Indian City Selector */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              onChange={(e) => {
                const city = INDIAN_CITIES.find(c => c.name === e.target.value);
                if (city && onSelectCity) {
                  onSelectCity(city.lat, city.lng, city.name);
                }
              }}
              defaultValue=""
              className="bg-[#080d1e] border border-meteo-border/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="" disabled>Search Indian City...</option>
              {INDIAN_CITIES.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* GPS Auto-Detect Button */}
          {onLocateMe && (
            <button
              type="button"
              onClick={onLocateMe}
              disabled={locating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 transition-all shadow-md shadow-sky-950"
              title="Detect current GPS location via browser"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? 'Locating...' : 'Locate Me'}</span>
            </button>
          )}

        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="h-[480px] sm:h-[540px] w-full relative">
        <MapContainer
          center={mapCenter}
          zoom={defaultZoom}
          zoomSnap={0.1}
          scrollWheelZoom={true}
          className="h-full w-full"
          minZoom={4}
          maxZoom={10}
        >
          {/* OpenStreetMap standard tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onMapClick={onMapClick} />

          {activeFocus && (
            <MapController center={activeFocus} zoom={7} />
          )}

          {/* User's Exact Detected/Searched Location Pin */}
          {userLocation?.location && (
            <CircleMarker
              center={[userLocation.location.latitude, userLocation.location.longitude]}
              radius={18}
              pathOptions={{
                fillColor: '#06b6d4',
                fillOpacity: 0.9,
                color: '#ffffff',
                weight: 3
              }}
            >
              <Popup>
                <div className="p-1 space-y-2 text-slate-100 min-w-[240px]">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
                    <span className="font-bold text-white text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {userLocation.location.name}
                    </span>
                    <RiskBadge risk={userLocation.risk} size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p>Live Temp: <strong className="text-amber-300">{userLocation.liveWeather?.temperature}°C</strong></p>
                    <p>Live Humidity: <strong className="text-cyan-300">{userLocation.liveWeather?.humidity}%</strong></p>
                    <p>Bust Probability: <strong className="text-rose-400">{userLocation.bustProbability}%</strong></p>
                    <p>Forecast Confidence: <strong className="text-sky-400">{userLocation.confidence}%</strong></p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )}

          {/* Render All 22 Meteorological Regions */}
          {regions.map((reg) => {
            const style = getMarkerStyle(reg);
            return (
              <CircleMarker
                key={reg.id}
                center={[reg.lat, reg.lng]}
                radius={style.radius}
                pathOptions={{
                  fillColor: style.fillColor,
                  fillOpacity: style.fillOpacity,
                  color: style.color,
                  weight: style.weight,
                }}
                eventHandlers={{
                  click: () => onSelectRegion(reg.id)
                }}
              >
                <Popup className="meteo-popup">
                  <div className="p-1 space-y-2 text-slate-100 min-w-[240px]">
                    <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {reg.region || reg.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Subdivision: {reg.zone}
                        </span>
                      </div>
                      <RiskBadge risk={reg.risk} size="sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">Confidence</span>
                        <span className="font-extrabold text-sky-400 text-sm">{reg.confidence}%</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">Bust Prob.</span>
                        <span className="font-extrabold text-rose-400 text-sm">{reg.bustProbability}%</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">Forecast Error</span>
                        <span className="font-bold text-amber-400 text-sm">±{reg.forecastError}%</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">Lead Horizon</span>
                        <span className="font-bold text-slate-200 text-sm">Day {leadTime}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Dominant Variable:</span>
                        <strong className="text-sky-300">{reg.primaryVariable || variable}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Weather System:</span>
                        <strong className="text-amber-300">{reg.activeSystem || weatherSystem}</strong>
                      </div>
                    </div>

                    {/* Meteorological reasons list */}
                    {reg.reasons && reg.reasons.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-800">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                          Vulnerability Factors:
                        </span>
                        <ul className="text-[10px] text-slate-300 space-y-0.5 list-disc pl-3">
                          {reg.reasons.slice(0, 3).map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectRegion(reg.id)}
                      className="w-full mt-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-bold transition-colors"
                    >
                      Focus Subdivision Analysis
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Floating live inspection indicator */}
        <div className="absolute bottom-4 left-4 z-[400] bg-[#0c1630]/90 backdrop-blur-md border border-meteo-border/80 rounded-lg p-2.5 text-xs shadow-lg max-w-[280px] pointer-events-none">
          <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Operational Radar View</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Click any subdivision marker or click anywhere on the map to evaluate live coordinates. Use &ldquo;Locate Me&rdquo; or the city search above.
          </p>
        </div>
      </div>

    </div>
  );
}
