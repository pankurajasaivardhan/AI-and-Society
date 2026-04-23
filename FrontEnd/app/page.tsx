'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import AQICard from '@/components/AQICard';
import PM25TrendChart from '@/components/PM25TrendChart';
import { apiService, PollutionData } from '@/lib/mockData';
import { Loader2 } from 'lucide-react';

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad'];

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [pollution, setPollution] = useState<Record<string, PollutionData[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load pollution data for all cities
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const pollutionData: Record<string, PollutionData[]> = {};

        for (const city of CITIES) {
          pollutionData[city] = await apiService.getPollution(city);
        }

        setPollution(pollutionData);
      } catch (err) {
        setError('Failed to load pollution data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get current city data
  const currentCityData = pollution[selectedCity] || [];
  const currentData = currentCityData[currentCityData.length - 1];
  const previousData = currentCityData[currentCityData.length - 2];

  // Determine trend
  const getTrend = () => {
    if (!currentData || !previousData) return 'same';
    if (currentData.pm25 > previousData.pm25) return 'up';
    if (currentData.pm25 < previousData.pm25) return 'down';
    return 'same';
  };

  // Get latest PM2.5 for each city
  const getCityLatestPM25 = (city: string) => {
    const data = pollution[city];
    if (!data || data.length === 0) return 0;
    return data[data.length - 1].pm25;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        currentPage="/"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4" 
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
            Air Quality Dashboard
          </h1>
          <p className="text-lg text-cyan-300/70 font-medium">
            Real-time PM2.5 and AQI overview • 4 Indian cities • 2010-2023
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 mb-6 text-red-300 backdrop-blur-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <p className="text-lg text-cyan-300/70">Loading air quality data...</p>
          </div>
        ) : (
          <>
            {/* AQI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {CITIES.map((city) => (
                <div
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className="cursor-pointer transition-transform"
                >
                  <AQICard
                    city={city}
                    pm25={getCityLatestPM25(city)}
                    trend={city === selectedCity ? getTrend() : 'same'}
                    isSelected={city === selectedCity}
                  />
                </div>
              ))}
            </div>

            {/* PM2.5 Trend Chart */}
            {currentCityData.length > 0 && (
              <PM25TrendChart data={currentCityData} city={selectedCity} />
            )}

            {/* Info Panel */}
            <div className="mt-12 relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 100%)',
                border: '2px solid #00d4ff40',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 60px #00d4ff20, inset 0 1px 0 rgba(0,212,255,0.1)'
              }}
            >
              <div className="relative z-10 p-8">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">◆</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-4" 
                      style={{
                        background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                      About This Data
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      This dashboard presents AI-powered analysis of air quality
                      data across India&apos;s major cities. The data includes PM2.5,
                      PM10, NO2, CO, and NH3 measurements analyzed using advanced
                      machine learning models (LSTM, XGBoost, and Autoencoder).
                    </p>
                    <ul className="space-y-2 text-sm text-cyan-300/70 font-medium">
                      <li>
                        <span className="text-cyan-300">✓</span> <strong>Data Period:</strong> January 2010 - December 2023
                      </li>
                      <li>
                        <span className="text-cyan-300">✓</span> <strong>Total Records:</strong> 19,018 daily measurements
                      </li>
                      <li>
                        <span className="text-cyan-300">✓</span> <strong>Coverage:</strong> Delhi, Mumbai, Bengaluru, Hyderabad
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
