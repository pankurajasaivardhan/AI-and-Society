# PolluTrace AI Frontend - API Integration Guide

## Overview
This frontend is designed to seamlessly switch between mock data and real API calls. Currently using mock data for development.

## Current Setup
- **Mock Data**: All API calls are mocked in `lib/mockData.ts`
- **Data Service**: `apiService` in `lib/mockData.ts` handles all requests
- **Status**: ✅ Ready for Go backend integration

## API Service Location
```
lib/mockData.ts
├── mockApi (Mock data generators)
├── apiService (Current implementation - uses mock data)
└── Type definitions
```

## Switching to Real API

### Step 1: Update apiService in `lib/mockData.ts`

Replace each method in `apiService` object with real API calls:

```typescript
export const apiService = {
  async getPollution(city: string = 'Delhi') {
    // BEFORE: Mock data
    // return mockApi.getPollution(city);

    // AFTER: Real API
    return fetch(`http://localhost:8080/api/pollution?city=${city}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      });
  },

  async getPredictions(city: string = 'Delhi') {
    return fetch(`http://localhost:8080/api/predict?city=${city}`)
      .then(r => r.json());
  },

  async getAnomalies(city: string = 'Delhi') {
    return fetch(`http://localhost:8080/api/anomalies?city=${city}`)
      .then(r => r.json());
  },

  async getSources(city: string = 'Delhi') {
    return fetch(`http://localhost:8080/api/sources?city=${city}`)
      .then(r => r.json());
  },

  async getMetrics() {
    return fetch(`http://localhost:8080/api/metrics`)
      .then(r => r.json());
  },
};
```

### Step 2: Update API Base URL
If your backend runs on a different port:
```typescript
const API_BASE_URL = 'http://localhost:8080';  // Change port as needed
```

### Step 3: Add Environment Variables (Optional)
Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Then in `lib/mockData.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
```

## API Endpoints Expected

The frontend expects these endpoints from your Go backend:

### 1. **GET /api/pollution**
Parameters: `?city=Delhi`
Response:
```json
[
  {
    "city": "Delhi",
    "date": "2023-01-15",
    "pm25": 187.4,
    "pm10": 245.2,
    "no2": 68.3,
    "co": 2.1,
    "nh3": 25
  }
]
```

### 2. **GET /api/predict**
Parameters: `?city=Delhi`
Response:
```json
[
  {
    "city": "Delhi",
    "date": "2023-01-15",
    "predicted_pm25": 172.3,
    "actual_pm25": 187.4
  }
]
```

### 3. **GET /api/anomalies**
Parameters: `?city=Delhi`
Response:
```json
[
  {
    "city": "Delhi",
    "date": "2019-01-20",
    "pm25": 308.4,
    "severity": "Severe",
    "is_anomaly": true,
    "reconstruction_error": 0.234
  }
]
```

### 4. **GET /api/sources**
Parameters: `?city=Delhi`
Response:
```json
{
  "city": "Delhi",
  "top_source_1": "CO",
  "top_source_2": "PM10",
  "top_source_3": "NO2",
  "pm10_importance": 0.23,
  "co_importance": 0.28,
  "nh3_importance": 0.12,
  "no2_importance": 0.15,
  "confidence": 0.546
}
```

### 5. **GET /api/metrics**
No parameters
Response:
```json
[
  {
    "city": "Delhi",
    "model_type": "LSTM",
    "rmse": 33.42,
    "mae": 21.53,
    "r2_score": 0.8058,
    "accuracy": 81.75,
    "within_20_percent": 72.3
  }
]
```

## Frontend Pages Using Each Endpoint

| Page | Endpoint | Purpose |
|------|----------|---------|
| Dashboard | `/api/pollution` | Display current AQI cards and PM2.5 trend |
| Predictions | `/api/predict`, `/api/metrics` | Show LSTM forecasts and model performance |
| Sources | `/api/sources` | Display pollution source importance |
| Anomalies | `/api/pollution`, `/api/anomalies` | Show anomaly timeline and events |
| Metrics | `/api/metrics` | Display all model performance metrics |

## Error Handling

Current error handling is basic. Consider adding:

1. **Retry Logic** (for failed requests)
```typescript
async function retryFetch(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i))); // Exponential backoff
    }
  }
}
```

2. **Loading States** (already implemented in components)
3. **Error Messages** (already implemented in UI)
4. **CORS Configuration** (ensure backend allows frontend origin)

## CORS Configuration (Backend)

Your Go backend must allow requests from the frontend:

```go
// Add CORS middleware
w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
```

## Testing the Integration

1. Start your Go backend on port 8080
2. Start the Next.js dev server: `pnpm dev`
3. Update `apiService` methods to call your backend
4. Open http://localhost:3000 and check:
   - Dashboard loads with real data
   - City selector updates data
   - All charts populate correctly
   - No console errors

## Component Structure

```
pages/
├── page.tsx (Dashboard)
├── predictions/page.tsx
├── sources/page.tsx
├── anomalies/page.tsx
└── metrics/page.tsx

components/
├── Navigation.tsx (Navigation + City Selector)
├── AQICard.tsx (Individual city cards)
├── PM25TrendChart.tsx (Area chart)
├── PredictionChart.tsx (Dual line chart)
├── SourceAnalysis.tsx (Bar chart + confidence score)
├── AnomalyAnalysis.tsx (Timeline + table)
└── MetricsDashboard.tsx (Tables + comparison charts)

lib/
├── mockData.ts (API service + type definitions)
└── utils/aqiCalculations.ts (AQI color/text utilities)
```

## Type Definitions

All API response types are defined in `lib/mockData.ts`:
- `PollutionData`
- `PredictionData`
- `AnomalyData`
- `SourceData`
- `MetricsData`

These match the expected Go API responses.

## Next Steps

1. ✅ Frontend structure complete
2. ⏳ Backend API development (Go)
3. ⏳ API integration testing
4. ⏳ Performance optimization
5. ⏳ Production deployment

## Support

For API issues:
1. Check browser console (F12) for error messages
2. Verify backend is running on correct port
3. Check CORS headers in browser Network tab
4. Ensure API response format matches expected types
