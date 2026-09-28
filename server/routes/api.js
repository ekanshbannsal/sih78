const express = require('express');
const router = express.Router();

const regionsData = require('../data/regions.json');
const weatherSystemsData = require('../data/weatherSystems.json');
const forecastData = require('../data/forecast.json');
const historicalData = require('../data/historical.json');
const {
  evaluateForecastBust,
  getLeadTimeCurve,
  getRankedRegions
} = require('../services/forecastBustModel');
const { generateLiveSynopticAnalysis, hasApiKey } = require('../services/geminiService');

// System Health
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ForecastGuard AI Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    modelStatus: 'AI Model: Operational (FBC-v1.4)',
    liveAIConnector: hasApiKey ? 'ACTIVE (Gemini 3.8 Flash Connected)' : 'STANDBY',
    apiKeyConfigured: hasApiKey,
    version: '1.4.0-sih-prototype',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Live Synoptic AI Analysis Endpoint
router.get('/live-analysis', async (req, res) => {
  const {
    region = 'Odisha',
    leadTime = 5,
    weatherSystem = 'Monsoon Depression',
    variable = 'Rainfall',
    bustProbability,
    confidence
  } = req.query;

  const resolvedLead = parseInt(leadTime, 10) || 5;
  const evalResult = evaluateForecastBust({
    regionId: region,
    leadTime: resolvedLead,
    weatherSystem,
    variable
  });

  const analysis = await generateLiveSynopticAnalysis({
    region: evalResult.region || region,
    leadTime: resolvedLead,
    weatherSystem: evalResult.weatherSystem || weatherSystem,
    variable: evalResult.variable || variable,
    bustProbability: bustProbability || evalResult.bustProbability,
    confidence: confidence || evalResult.confidence
  });

  res.json({
    evaluation: evalResult,
    liveAnalysis: analysis
  });
});

// Live Location Weather & AI Bust Detection Endpoint
router.get('/location-weather', async (req, res) => {
  try {
    const { lat = 28.6139, lng = 77.2090, name = 'Delhi NCR', leadTime = 5 } = req.query;
    const { getLocationWeatherAndBust } = require('../services/locationWeatherService');
    const result = await getLocationWeatherAndBust({
      lat,
      lng,
      locationName: name,
      leadTime
    });
    res.json(result);
  } catch (err) {
    console.error('Location weather error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Regions metadata & evaluated scores
router.get('/regions', (req, res) => {
  const { leadTime = 5, weatherSystem = 'all', variable = 'Rainfall', zone = 'all' } = req.query;
  const ranked = getRankedRegions({
    leadTime: parseInt(leadTime, 10) || 5,
    weatherSystem,
    variable,
    zone
  });
  res.json({
    count: ranked.length,
    regions: ranked,
    rawRegions: regionsData
  });
});

// Weather systems list
router.get('/weather-systems', (req, res) => {
  res.json(weatherSystemsData);
});

// Confidence query
// Example: GET /api/confidence?region=odisha&day=5
router.get('/confidence', (req, res) => {
  const {
    region = 'odisha',
    day = 5,
    leadTime,
    weatherSystem = 'all',
    variable = 'Rainfall'
  } = req.query;

  const resolvedLeadTime = parseInt(leadTime || day, 10) || 5;
  const evaluation = evaluateForecastBust({
    regionId: region,
    leadTime: resolvedLeadTime,
    weatherSystem,
    variable
  });

  res.json(evaluation);
});

// Bust Probability and Lead-Time Curve
router.get('/bust-probability', (req, res) => {
  const {
    region = 'odisha',
    day = 5,
    leadTime,
    weatherSystem = 'all',
    variable = 'Rainfall'
  } = req.query;

  const resolvedLeadTime = parseInt(leadTime || day, 10) || 5;
  const current = evaluateForecastBust({
    regionId: region,
    leadTime: resolvedLeadTime,
    weatherSystem,
    variable
  });
  const curve = getLeadTimeCurve({
    regionId: region,
    weatherSystem,
    variable
  });

  res.json({
    current,
    curve,
    leadTime: resolvedLeadTime,
    region
  });
});

// Forecast vs Observed & NWP variable trajectories
router.get('/forecast', (req, res) => {
  const { variable = 'Rainfall' } = req.query;
  const dataset = forecastData.observedVsForecastDatasets[variable] || forecastData.observedVsForecastDatasets['Rainfall'];

  res.json({
    variable,
    leadTimes: forecastData.leadTimes,
    defaultBaselineConfidence: forecastData.defaultBaselineConfidence,
    defaultBaselineBustProb: forecastData.defaultBaselineBustProb,
    forecastVsObserved: dataset,
    availableVariables: Object.keys(forecastData.observedVsForecastDatasets)
  });
});

// Explainability API
router.get('/explainability', (req, res) => {
  const {
    region = 'odisha',
    day = 5,
    leadTime,
    weatherSystem = 'all',
    variable = 'Rainfall'
  } = req.query;

  const resolvedLeadTime = parseInt(leadTime || day, 10) || 5;
  const evaluation = evaluateForecastBust({
    regionId: region,
    leadTime: resolvedLeadTime,
    weatherSystem,
    variable
  });

  res.json({
    region: evaluation.region,
    leadTime: evaluation.leadTime,
    variable: evaluation.variable,
    weatherSystem: evaluation.weatherSystem,
    confidence: evaluation.confidence,
    bustProbability: evaluation.bustProbability,
    risk: evaluation.risk,
    factors: evaluation.factors,
    featureContributions: evaluation.featureContributions,
    reasons: evaluation.reasons,
    plainLanguageExplanation: evaluation.plainLanguageExplanation,
    disclaimer: 'AI-assisted demo explanation based on mock ensemble feature importance rather than scientifically validated causal attribution.'
  });
});

// Historical analysis & records
router.get('/historical', (req, res) => {
  const { year, region, weatherSystem, variable } = req.query;

  let filtered = [...historicalData];

  if (year && year !== 'all') {
    filtered = filtered.filter(item => item.year.toString() === year.toString());
  }
  if (region && region !== 'all') {
    filtered = filtered.filter(item => item.region.toLowerCase() === region.toLowerCase());
  }
  if (weatherSystem && weatherSystem !== 'all') {
    filtered = filtered.filter(item => item.weatherSystem.toLowerCase().includes(weatherSystem.toLowerCase()));
  }
  if (variable && variable !== 'all') {
    filtered = filtered.filter(item => item.variable.toLowerCase() === variable.toLowerCase());
  }

  // Aggregate charts:
  // 1. Bust frequency by lead time
  const leadTimeFreq = {};
  filtered.forEach(item => {
    const lead = item.forecastLead || `Day ${item.leadDays}`;
    leadTimeFreq[lead] = (leadTimeFreq[lead] || 0) + (item.bust === 'YES' ? 1 : 0);
  });
  const bustByLeadTime = Object.keys(leadTimeFreq).map(k => ({
    leadTime: k,
    bustCount: leadTimeFreq[k]
  }));

  // 2. Average error by weather system
  const systemErrors = {};
  filtered.forEach(item => {
    if (!systemErrors[item.weatherSystem]) {
      systemErrors[item.weatherSystem] = { totalError: 0, count: 0 };
    }
    systemErrors[item.weatherSystem].totalError += item.error;
    systemErrors[item.weatherSystem].count += 1;
  });
  const avgErrorBySystem = Object.keys(systemErrors).map(k => ({
    weatherSystem: k,
    averageError: Math.round((systemErrors[k].totalError / systemErrors[k].count) * 10) / 10
  }));

  // 3. Regional bust frequency
  const regionFreq = {};
  filtered.forEach(item => {
    regionFreq[item.region] = (regionFreq[item.region] || 0) + 1;
  });
  const bustByRegion = Object.keys(regionFreq).map(k => ({
    region: k,
    events: regionFreq[k]
  }));

  res.json({
    totalEvents: filtered.length,
    events: filtered,
    aggregates: {
      bustByLeadTime,
      avgErrorBySystem,
      bustByRegion
    }
  });
});

// Operational Alerts
router.get('/alerts', (req, res) => {
  const alerts = [
    {
      id: 'ALT-9041',
      severity: 'HIGH',
      title: 'High Forecast Uncertainty Detected',
      region: 'Odisha',
      leadTime: 'Day 5',
      bustProbability: 68.4,
      confidence: 31.6,
      variable: 'Rainfall',
      weatherSystem: 'Monsoon Depression',
      reason: 'High ensemble spread + rapid pressure gradient changes + historical rainfall bias.',
      timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
      actionRequired: 'Issue operational meteorological advisory to regional disaster management center.'
    },
    {
      id: 'ALT-9042',
      severity: 'HIGH',
      title: 'Convective Cell Displacement Warning',
      region: 'West Bengal',
      leadTime: 'Day 5',
      bustProbability: 61.2,
      confidence: 38.8,
      variable: 'Rainfall',
      weatherSystem: 'Monsoon Depression',
      reason: 'Ensemble QPF members show >120mm variance over Gangetic delta.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      actionRequired: 'Run high-resolution local WRF assimilation.'
    },
    {
      id: 'ALT-9043',
      severity: 'MODERATE',
      title: 'Thermal Boundary Layer Spread',
      region: 'Rajasthan',
      leadTime: 'Day 4',
      bustProbability: 31.5,
      confidence: 68.5,
      variable: 'Temperature',
      weatherSystem: 'Heat Wave',
      reason: 'Continental advection boundary uncertainty between Thar desert and Punjab.',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      actionRequired: 'Monitor automated weather station (AWS) ground temperatures.'
    }
  ];

  res.json({
    count: alerts.length,
    alerts
  });
});

// AI Model Metrics & Architecture
router.get('/metrics', (req, res) => {
  res.json({
    modelName: 'Forecast Bust Classifier (FBC-v1.4)',
    type: 'Machine Learning / Ensemble-Based Gradient Boosted Classification',
    trainingData: 'IMD Historical Reanalysis (2015-2024) + NCMRWF / ECMWF EPS Ensembles (Demo Grounded)',
    metrics: {
      accuracy: 87,
      precision: 82,
      recall: 79,
      f1Score: 80,
      aucRoc: 0.91,
      calibrationBrierScore: 0.12
    },
    label: 'Demo / validation metrics (Prototype evaluation)',
    inputFeatures: [
      'NWP forecast variables (Rainfall, Temp, Wind, Pressure, Humidity)',
      'Ensemble spread (GEFS / EPS perturbation standard deviation)',
      'Historical regional forecast error & bias metrics',
      'Weather-system synoptic classification (Monsoon Depression, Cyclone, etc.)',
      'Atmospheric pressure gradient & 850 hPa moisture divergence',
      'Vertical wind shear (850-200 hPa)',
      'Forecast lead time (Day 1 to 10)'
    ],
    outputTargets: [
      'Bust Probability (0 - 100%)',
      'Forecast Confidence Score (0 - 100%)',
      'Expected Forecast Error Margin (%)',
      'Operational Risk Classification (LOW, MODERATE, HIGH, VERY HIGH)',
      'Explainable Meteorological Contribution Vector (SHAP values)'
    ],
    pipelineSteps: [
      { step: 1, name: 'NWP Forecast Ingestion', desc: 'Raw ensemble forecasts (GFS, ECMWF, NCUM) ingested via GRIB2/NetCDF.' },
      { step: 2, name: 'Feature Extraction', desc: 'Calculation of ensemble spread, pressure gradients, moisture flux, and thermodynamic indices.' },
      { step: 3, name: 'Historical Error Analysis', desc: 'Lookup against 10-year historical verification error matrix per region and season.' },
      { step: 4, name: 'Weather System Detection', desc: 'Synoptic classification: Depression, Cyclone, Western Disturbance, Heat Wave.' },
      { step: 5, name: 'ML Bust Classifier', desc: 'Ensemble Gradient Boosted Trees evaluate probability of large forecast busts.' },
      { step: 6, name: 'Probability Calibration', desc: 'Isotonic regression calibrates raw probabilities into reliable risk percentages.' },
      { step: 7, name: 'Confidence & Risk Map', desc: 'Spatial interpolation and sub-divisional risk assignment across all regions.' },
      { step: 8, name: 'Explainable AI Output', desc: 'Feature importance decomposition provides meteorologist-interpretable justifications.' }
    ]
  });
});

module.exports = router;
