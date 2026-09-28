/**
 * ForecastGuard AI - Mock AI Inference Engine
 * 
 * Service: forecastBustModel.js
 * Description: Deterministic mock AI inference layer simulating an ensemble-based
 * forecast bust classifier. Calculates confidence, bust probability, expected forecast
 * error, operational risk classification, and explainability factors.
 * 
 * NOTE: Demo data for SIH prototype — designed with a clean contract so it can easily
 * be replaced by an external Python ML API / FastAPI / PyTorch / ONNX model service.
 */

const regionsData = require('../data/regions.json');
const weatherSystemsData = require('../data/weatherSystems.json');

// Risk thresholds
const RISK_THRESHOLDS = {
  LOW: 20,
  MODERATE: 40,
  HIGH: 60
};

/**
 * Determine risk level based on bust probability
 * @param {number} bustProb - 0 to 100 percentage
 * @returns {"LOW" | "MODERATE" | "HIGH" | "VERY HIGH"}
 */
function getRiskCategory(bustProb) {
  if (bustProb < RISK_THRESHOLDS.LOW) return 'LOW';
  if (bustProb < RISK_THRESHOLDS.MODERATE) return 'MODERATE';
  if (bustProb < RISK_THRESHOLDS.HIGH) return 'HIGH';
  return 'VERY HIGH';
}

/**
 * Calculate deterministic AI evaluation for a region and filter context
 * @param {Object} params
 * @param {string} params.regionId - Region ID or 'all'/'india'
 * @param {number} params.leadTime - Lead time in days (1 to 10)
 * @param {string} params.weatherSystem - Weather system identifier or 'all'
 * @param {string} params.variable - Weather variable (Rainfall, Temperature, Wind, etc.)
 */
function evaluateForecastBust({ regionId = 'odisha', leadTime = 5, weatherSystem = 'all', variable = 'Rainfall' }) {
  const normLead = Math.min(Math.max(parseInt(leadTime, 10) || 5, 1), 10);
  
  // Find region object
  const region = regionsData.find(r => r.id === regionId.toLowerCase()) || regionsData[0];
  
  // Find weather system multiplier
  const ws = weatherSystemsData.find(w => 
    w.id === weatherSystem.toLowerCase() || 
    w.name.toLowerCase() === weatherSystem.toLowerCase()
  );
  
  const systemMultiplier = ws ? ws.riskMultiplier : (region.activeSystem === 'Cyclone' ? 1.45 : 1.3);

  // Variable risk weighting
  const variableWeights = {
    'rainfall': 1.35,
    'temperature': 1.1,
    'wind': 1.25,
    'pressure': 1.15,
    'humidity': 1.05
  };
  const varWeight = variableWeights[variable.toLowerCase()] || 1.2;

  // Region base weight
  const baseWeight = region.baseRiskWeight || 1.2;

  // Lead-time non-linear uncertainty growth curve (logistic-like growth)
  // Day 1 ~ 4%, Day 5 ~ 30-40%, Day 10 ~ 65-75%
  const leadFactor = Math.pow(normLead / 10, 1.4);
  const rawBust = 4 + (leadFactor * 58) * (baseWeight * 0.7) * (systemMultiplier * 0.7) * (varWeight * 0.7);
  const clampedBust = Math.min(Math.max(Math.round(rawBust * 10) / 10, 3.5), 89.5);

  // Confidence is inversely related to bust probability, with slight dampening
  const clampedConfidence = Math.min(Math.max(Math.round((100 - (clampedBust * 1.05)) * 10) / 10, 10.5), 96.0);

  // Forecast Error percentage (e.g. 18.7%)
  const forecastError = Math.round((clampedBust * 0.48 + normLead * 1.1) * 10) / 10;

  const risk = getRiskCategory(clampedBust);

  // Meteorological Explainability Factors (0-100 scale)
  // Reflect physical dynamics of medium-range NWP busts
  const ensembleSpread = Math.min(Math.round(25 + normLead * 6.5 * baseWeight), 95);
  const historicalError = Math.min(Math.round(20 + baseWeight * 38), 92);
  const pressureGradient = Math.min(Math.round(30 + (systemMultiplier - 1) * 70 + (normLead % 3) * 8), 90);
  const moistureConvergence = Math.min(Math.round(35 + (variable.toLowerCase() === 'rainfall' ? 45 : 15)), 94);
  const rainfallGradient = Math.min(Math.round(28 + (variable.toLowerCase() === 'rainfall' ? 50 : 20)), 91);
  const trackUncertainty = Math.min(Math.round(20 + normLead * 7.2 * (systemMultiplier > 1.3 ? 1.2 : 0.8)), 88);
  const windShear = Math.min(Math.round(22 + normLead * 5.2), 85);
  const temperatureAnomaly = Math.min(Math.round(18 + normLead * 4.8), 80);

  // SHAP-like Feature Importance decomposition for explainability page
  const rawFeatures = [
    { feature: 'Ensemble Spread', weight: ensembleSpread * 1.3 },
    { feature: 'Historical Rainfall Error', weight: historicalError * 1.1 },
    { feature: 'Pressure Gradient', weight: pressureGradient * 0.9 },
    { feature: 'Moisture Convergence', weight: moistureConvergence * 0.85 },
    { feature: 'Wind Shear', weight: windShear * 0.6 },
    { feature: 'Temperature Anomaly', weight: temperatureAnomaly * 0.45 },
    { feature: 'Other Localized Topography', weight: 35 }
  ];

  const totalWeight = rawFeatures.reduce((acc, curr) => acc + curr.weight, 0);
  const featureContributions = rawFeatures.map(f => ({
    feature: f.feature,
    contribution: Math.round((f.weight / totalWeight) * 100),
    description: getFeatureDescription(f.feature)
  }));

  // Ensure contributions sum nicely
  const sumContrib = featureContributions.reduce((acc, curr) => acc + curr.contribution, 0);
  if (sumContrib !== 100 && featureContributions.length > 0) {
    featureContributions[0].contribution += (100 - sumContrib);
  }

  // Meteorological reasons for UI
  const reasons = [
    `${ensembleSpread > 70 ? 'High' : 'Moderate'} ensemble forecast spread across perturbation members`,
    `${moistureConvergence > 70 ? 'Intense' : 'Elevated'} moisture convergence in lower troposphere (850 hPa)`,
    `Rapid local surface pressure gradient changes (${pressureGradient}th percentile)`,
    `Known regional historical NWP bias (${region.historicalBias})`
  ];

  if (systemMultiplier > 1.3) {
    reasons.push(`Synoptic vulnerability: Active ${region.activeSystem} system creates non-linear track deviation`);
  }

  return {
    region: region.name,
    regionId: region.id,
    zone: region.zone,
    leadTime: normLead,
    weatherSystem: ws ? ws.name : region.activeSystem,
    variable,
    confidence: clampedConfidence,
    bustProbability: clampedBust,
    forecastError,
    risk,
    factors: {
      ensembleSpread: { score: ensembleSpread, level: getFactorLevel(ensembleSpread) },
      historicalError: { score: historicalError, level: getFactorLevel(historicalError) },
      pressureGradient: { score: pressureGradient, level: getFactorLevel(pressureGradient) },
      moistureConvergence: { score: moistureConvergence, level: getFactorLevel(moistureConvergence) },
      rainfallGradient: { score: rainfallGradient, level: getFactorLevel(rainfallGradient) },
      trackUncertainty: { score: trackUncertainty, level: getFactorLevel(trackUncertainty) },
      windShear: { score: windShear, level: getFactorLevel(windShear) },
      temperatureAnomaly: { score: temperatureAnomaly, level: getFactorLevel(temperatureAnomaly) }
    },
    featureContributions,
    reasons,
    plainLanguageExplanation: `The model has reduced confidence because ensemble members show large disagreement over ${variable.toLowerCase()} intensity at Lead Day ${normLead}, and the historical forecast error for similar ${ws ? ws.name : region.activeSystem} systems is elevated across ${region.name}.`
  };
}

function getFactorLevel(score) {
  if (score < 40) return 'Low';
  if (score < 70) return 'Moderate';
  return 'High';
}

function getFeatureDescription(feature) {
  switch (feature) {
    case 'Ensemble Spread':
      return 'Disagreement among perturbed NWP ensemble forecasts (e.g. GEFS / ECMWF EPS).';
    case 'Historical Rainfall Error':
      return 'Region-specific systematic bias observed over past 5 monsoon cycles.';
    case 'Pressure Gradient':
      return 'Steep baroclinic gradients that accelerate cyclonic wind circulation.';
    case 'Moisture Convergence':
      return 'Flux of water vapor trapped by topography or coastal windward convergence.';
    case 'Wind Shear':
      return 'Vertical difference in wind vectors impairing convective organization.';
    case 'Temperature Anomaly':
      return 'Boundary layer sensible heat flux divergence altering pressure depths.';
    default:
      return 'Sub-grid scale orographic and land-surface interaction terms.';
  }
}

/**
 * Generate 1-10 day curve for a specific region and filters
 */
function getLeadTimeCurve({ regionId = 'odisha', weatherSystem = 'all', variable = 'Rainfall' }) {
  const curve = [];
  for (let day = 1; day <= 10; day++) {
    const evalResult = evaluateForecastBust({ regionId, leadTime: day, weatherSystem, variable });
    curve.push({
      day: `Day ${day}`,
      leadTime: day,
      confidence: evalResult.confidence,
      bustProbability: evalResult.bustProbability,
      forecastError: evalResult.forecastError,
      risk: evalResult.risk
    });
  }
  return curve;
}

/**
 * Get ranked table of regions sorted by bust probability
 */
function getRankedRegions({ leadTime = 5, weatherSystem = 'all', variable = 'Rainfall', zone = 'all' }) {
  let regions = regionsData;
  if (zone && zone.toLowerCase() !== 'all' && zone.toLowerCase() !== 'india') {
    regions = regions.filter(r => r.zone.toLowerCase() === zone.toLowerCase());
  }

  const evaluated = regions.map(r => {
    const res = evaluateForecastBust({
      regionId: r.id,
      leadTime,
      weatherSystem: weatherSystem === 'all' ? r.activeSystem : weatherSystem,
      variable
    });

    return {
      id: r.id,
      region: r.name,
      zone: r.zone,
      lat: r.lat,
      lng: r.lng,
      bustProbability: res.bustProbability,
      confidence: res.confidence,
      forecastError: res.forecastError,
      leadTime: `Day ${leadTime}`,
      leadDay: leadTime,
      primaryVariable: r.primaryVariable || variable,
      activeSystem: res.weatherSystem,
      risk: res.risk,
      reasons: res.reasons,
      vulnerabilities: r.vulnerabilities
    };
  });

  // Sort descending by bustProbability
  return evaluated.sort((a, b) => b.bustProbability - a.bustProbability);
}

module.exports = {
  evaluateForecastBust,
  getLeadTimeCurve,
  getRankedRegions,
  RISK_THRESHOLDS
};
