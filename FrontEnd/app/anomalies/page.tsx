'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import AnomalyAnalysis from '@/components/AnomalyAnalysis';
import { apiService, PollutionData, AnomalyData } from '@/lib/mockData';
import { Loader2 } from 'lucide-react';

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad'];

export default function AnomaliesPage() {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [pollution, setPollution] = useState<PollutionData[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [pollutionData, anomalyData] = await Promise.all([
          apiService.getPollution(selectedCity),
          apiService.getAnomalies(selectedCity),
        ]);
        setPollution(pollutionData);
        setAnomalies(anomalyData);
      } catch (err) {
        setError('Failed to load anomaly data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-slate-50">
      <Navigation
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        currentPage="/anomalies"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Anomaly Detection
          </h1>
          <p className="text-lg text-gray-600">
            Autoencoder model • Unusual pollution events • Severity classification
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
            <p className="text-lg text-gray-600">Loading anomaly detection...</p>
          </div>
        ) : (
          <AnomalyAnalysis
            pollutionData={pollution}
            anomalyData={anomalies}
            city={selectedCity}
          />
        )}

        {/* About Section */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl shadow-lg p-8 border border-red-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            About Anomaly Detection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                What is an Anomaly?
              </h4>
              <p className="text-gray-700">
                An anomaly is a pollution spike that deviates significantly from
                normal patterns. Detected using an Autoencoder neural network that
                learns the &quot;normal&quot; distribution and flags unusual events.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Why do anomalies occur?
              </h4>
              <p className="text-gray-700">
                Major fire events (crop burning, industrial fires), sudden weather
                changes, or unusual traffic patterns can cause unexpected pollution
                spikes. Early detection helps with public health warnings.
              </p>
            </div>
          </div>

          {/* Severity Legend */}
          <div className="mt-6 border-t border-red-200 pt-6">
            <h4 className="font-semibold text-gray-800 mb-4">Severity Levels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <div>
                  <p className="font-semibold text-gray-800">Moderate</p>
                  <p className="text-sm text-gray-600">60-100 μg/m³</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-red-600" />
                <div>
                  <p className="font-semibold text-gray-800">High</p>
                  <p className="text-sm text-gray-600">100-200 μg/m³</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-purple-700" />
                <div>
                  <p className="font-semibold text-gray-800">Severe</p>
                  <p className="text-sm text-gray-600">{'>'}200 μg/m³</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
