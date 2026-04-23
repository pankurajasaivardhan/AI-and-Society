// Mock Data Service - Replace API calls later
// This service provides mock data that matches the backend API structure

interface PollutionData {
  city: string;
  date: string;
  pm25: number;
  pm10: number;
  no2: number;
  co: number;
  nh3: number;
}

interface PredictionData {
  city: string;
  date: string;
  predicted_pm25: number;
  actual_pm25: number;
}

interface AnomalyData {
  city: string;
  date: string;
  pm25: number;
  severity: 'Moderate' | 'High' | 'Severe';
  is_anomaly: boolean;
  reconstruction_error: number;
}

interface SourceData {
  city: string;
  top_source_1: string;
  top_source_2: string;
  top_source_3: string;
  pm10_importance: number;
  co_importance: number;
  nh3_importance: number;
  no2_importance: number;
  confidence: number;
}

interface MetricsData {
  city: string;
  model_type: string;
  rmse: number;
  mae: number;
  r2_score: number;
  accuracy: number;
  within_20_percent: number;
}

// AQI Levels
export const AQI_COLORS = {
  good: '#00B050',
  satisfactory: '#92D050',
  moderate: '#FFFF00',
  poor: '#FF6600',
  veryPoor: '#FF0000',
  severe: '#7030A0',
};

// Generate mock data for last 90 days
function generateMockPollutionData(city: string, days: number = 90): PollutionData[] {
  const data: PollutionData[] = [];
  const today = new Date();

  const cityBaselines: Record<string, { pm25: number; variance: number }> = {
    Delhi: { pm25: 150, variance: 80 },
    Mumbai: { pm25: 80, variance: 40 },
    Bengaluru: { pm25: 60, variance: 30 },
    Hyderabad: { pm25: 100, variance: 50 },
  };

  const baseline = cityBaselines[city] || { pm25: 100, variance: 40 };

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const pm25 = Math.max(
      10,
      baseline.pm25 + (Math.random() - 0.5) * baseline.variance * 2
    );

    data.push({
      city,
      date: dateStr,
      pm25: Math.round(pm25 * 10) / 10,
      pm10: Math.round(pm25 * 1.5),
      no2: Math.round(Math.random() * 80 + 20),
      co: Math.round((Math.random() * 2 + 0.5) * 10) / 10,
      nh3: Math.round(Math.random() * 30 + 10),
    });
  }

  return data;
}

// Generate mock prediction data
function generateMockPredictionData(city: string, days: number = 365): PredictionData[] {
  const data: PredictionData[] = [];
  const today = new Date();

  const cityBaselines: Record<string, number> = {
    Delhi: 150,
    Mumbai: 80,
    Bengaluru: 60,
    Hyderabad: 100,
  };

  const baseline = cityBaselines[city] || 100;

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const actual = Math.max(10, baseline + (Math.random() - 0.5) * baseline * 0.6);
    const predicted = actual + (Math.random() - 0.5) * 30;

    data.push({
      city,
      date: dateStr,
      actual_pm25: Math.round(actual * 10) / 10,
      predicted_pm25: Math.max(10, Math.round(predicted * 10) / 10),
    });
  }

  return data;
}

// Generate mock anomaly data
function generateMockAnomalyData(city: string): AnomalyData[] {
  const data: AnomalyData[] = [];
  const today = new Date();

  const anomalyDates = [
    { offset: 10, severity: 'Severe', pm25: 280 },
    { offset: 25, severity: 'High', pm25: 180 },
    { offset: 45, severity: 'High', pm25: 190 },
    { offset: 67, severity: 'Severe', pm25: 300 },
    { offset: 85, severity: 'Moderate', pm25: 110 },
  ];

  anomalyDates.forEach((anomaly) => {
    const date = new Date(today);
    date.setDate(date.getDate() - anomaly.offset);
    const dateStr = date.toISOString().split('T')[0];

    data.push({
      city,
      date: dateStr,
      pm25: anomaly.pm25,
      severity: anomaly.severity as 'Moderate' | 'High' | 'Severe',
      is_anomaly: true,
      reconstruction_error: Math.random() * 0.5,
    });
  });

  return data;
}

// Get current AQI for a city
function getCurrentAQI(pm25: number): number {
  if (pm25 <= 50) return 25;
  if (pm25 <= 100) return 75;
  if (pm25 <= 200) return 150;
  if (pm25 <= 300) return 250;
  if (pm25 <= 400) return 350;
  return 450;
}

export const mockApi = {
  // GET /api/pollution?city=Delhi
  getPollution: async (city: string = 'Delhi'): Promise<PollutionData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockPollutionData(city)), 300);
    });
  },

  // GET /api/predict?city=Delhi
  getPredictions: async (city: string = 'Delhi'): Promise<PredictionData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockPredictionData(city)), 300);
    });
  },

  // GET /api/anomalies?city=Delhi
  getAnomalies: async (city: string = 'Delhi'): Promise<AnomalyData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockAnomalyData(city)), 300);
    });
  },

  // GET /api/sources?city=Delhi
  getSources: async (city: string = 'Delhi'): Promise<SourceData> => {
    const sources: Record<string, SourceData> = {
      Delhi: {
        city: 'Delhi',
        top_source_1: 'PM10',
        top_source_2: 'CO',
        top_source_3: 'NO2',
        pm10_importance: 0.35,
        co_importance: 0.28,
        nh3_importance: 0.12,
        no2_importance: 0.15,
        confidence: 0.546,
      },
      Mumbai: {
        city: 'Mumbai',
        top_source_1: 'CO',
        top_source_2: 'PM10',
        top_source_3: 'NO2',
        pm10_importance: 0.28,
        co_importance: 0.32,
        nh3_importance: 0.15,
        no2_importance: 0.18,
        confidence: 0.803,
      },
      Bengaluru: {
        city: 'Bengaluru',
        top_source_1: 'NO2',
        top_source_2: 'PM10',
        top_source_3: 'CO',
        pm10_importance: 0.25,
        co_importance: 0.22,
        nh3_importance: 0.18,
        no2_importance: 0.28,
        confidence: 0.738,
      },
      Hyderabad: {
        city: 'Hyderabad',
        top_source_1: 'PM10',
        top_source_2: 'NO2',
        top_source_3: 'CO',
        pm10_importance: 0.32,
        co_importance: 0.24,
        nh3_importance: 0.14,
        no2_importance: 0.22,
        confidence: 0.694,
      },
    };

    return new Promise((resolve) => {
      setTimeout(
        () => resolve(sources[city] || sources['Delhi']),
        300
      );
    });
  },

  // GET /api/metrics
  getMetrics: async (): Promise<MetricsData[]> => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve([
          {
            city: 'Delhi',
            model_type: 'LSTM',
            rmse: 33.42,
            mae: 21.53,
            r2_score: 0.8058,
            accuracy: 81.75,
            within_20_percent: 72.3,
          },
          {
            city: 'Bengaluru',
            model_type: 'LSTM',
            rmse: 6.15,
            mae: 4.74,
            r2_score: 0.7426,
            accuracy: 85.18,
            within_20_percent: 78.5,
          },
          {
            city: 'Mumbai',
            model_type: 'LSTM',
            rmse: 7.66,
            mae: 5.57,
            r2_score: 0.8774,
            accuracy: 87.55,
            within_20_percent: 82.1,
          },
          {
            city: 'Hyderabad',
            model_type: 'LSTM',
            rmse: 9.03,
            mae: 6.87,
            r2_score: 0.809,
            accuracy: 83.67,
            within_20_percent: 75.4,
          },
        ]),
        300
      );
    });
  },

  getCurrentAQI,
};

// API Service - Switch between mock and real API
export const apiService = {
  async getPollution(city: string = 'Delhi') {
    // Replace with: return fetch(`http://localhost:8080/api/pollution?city=${city}`).then(r => r.json());
    return mockApi.getPollution(city);
  },

  async getPredictions(city: string = 'Delhi') {
    // Replace with: return fetch(`http://localhost:8080/api/predict?city=${city}`).then(r => r.json());
    return mockApi.getPredictions(city);
  },

  async getAnomalies(city: string = 'Delhi') {
    // Replace with: return fetch(`http://localhost:8080/api/anomalies?city=${city}`).then(r => r.json());
    return mockApi.getAnomalies(city);
  },

  async getSources(city: string = 'Delhi') {
    // Replace with: return fetch(`http://localhost:8080/api/sources?city=${city}`).then(r => r.json());
    return mockApi.getSources(city);
  },

  async getMetrics() {
    // Replace with: return fetch(`http://localhost:8080/api/metrics`).then(r => r.json());
    return mockApi.getMetrics();
  },
};

export type { PollutionData, PredictionData, AnomalyData, SourceData, MetricsData };
