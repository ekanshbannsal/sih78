/**
 * ForecastGuard AI - Frontend API Service
 * Handles communication with the Express backend, with graceful fallback
 * to deterministic client-side generation if offline.
 */

const API_BASE = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API /health fallback:', err.message);
    return {
      status: 'ONLINE (Client Mock)',
      modelStatus: 'AI Model: Operational (Fallback Mode)',
      timestamp: new Date().toISOString()
    };
  }
}

export async function fetchRegions({ leadTime = 5, weatherSystem = 'all', variable = 'Rainfall', zone = 'all' } = {}) {
  try {
    const params = new URLSearchParams({ leadTime, weatherSystem, variable, zone });
    const res = await fetch(`${API_BASE}/regions?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch regions: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API /regions fallback:', err.message);
    return null;
  }
}

export async function fetchConfidence({ region = 'odisha', leadTime = 5, weatherSystem = 'all', variable = 'Rainfall' } = {}) {
  try {
    const params = new URLSearchParams({ region, leadTime, weatherSystem, variable });
    const res = await fetch(`${API_BASE}/confidence?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch confidence: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API /confidence fallback:', err.message);
    return null;
  }
}

export async function fetchBustProbability({ region = 'odisha', leadTime = 5, weatherSystem = 'all', variable = 'Rainfall' } = {}) {
  try {
    const params = new URLSearchParams({ region, leadTime, weatherSystem, variable });
    const res = await fetch(`${API_BASE}/bust-probability?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch bust probability: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API /bust-probability fallback:', err.message);
    return null;
  }
}

export async function fetchForecastData({ variable = 'Rainfall' } = {}) {
  try {
    const params = new URLSearchParams({ variable });
    const res = await fetch(`${API_BASE}/forecast?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch forecast: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API /forecast fallback:', err.message);
    return null;
  }
}

export async function fetchExplainability({ region = 'odisha', leadTime = 5, weatherSystem = 'all', variable = 'Rainfall' } = {}) {
  try {
    const params = new URLSearchParams({ region, leadTime, weatherSystem, variable });
    const res = await fetch(`${API_BASE}/explainability?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch explainability: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API /explainability fallback:', err.message);
    return null;
  }
}

export async function fetchHistorical(filters = {}) {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'all') params.append(k, filters[k]);
    });
    const res = await fetch(`${API_BASE}/historical?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch historical: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API /historical fallback:', err.message);
    return null;
  }
}

export async function fetchAlerts() {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error(`Failed to fetch alerts: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API /alerts fallback:', err.message);
    return { alerts: [] };
  }
}

export async function fetchLiveAnalysis({ region = 'odisha', leadTime = 5, weatherSystem = 'all', variable = 'Rainfall', bustProbability, confidence } = {}) {
  try {
    const params = new URLSearchParams({ region, leadTime, weatherSystem, variable });
    if (bustProbability) params.append('bustProbability', bustProbability);
    if (confidence) params.append('confidence', confidence);
    const res = await fetch(`${API_BASE}/live-analysis?${params.toString()}`);
    if (!res.ok) throw new Error(`Live analysis fetch failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API /live-analysis fallback:', err.message);
    return null;
  }
}

export async function fetchLocationWeather({ lat = 28.6139, lng = 77.2090, name = 'Current Location', leadTime = 5 } = {}) {
  try {
    const params = new URLSearchParams({ lat, lng, name, leadTime });
    const res = await fetch(`${API_BASE}/location-weather?${params.toString()}`);
    if (!res.ok) throw new Error(`Location weather fetch failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API /location-weather fallback:', err.message);
    return null;
  }
}

export async function fetchMetrics() {
  try {
    const res = await fetch(`${API_BASE}/metrics`);
    if (!res.ok) throw new Error(`Failed to fetch metrics: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API /metrics fallback:', err.message);
    return null;
  }
}
