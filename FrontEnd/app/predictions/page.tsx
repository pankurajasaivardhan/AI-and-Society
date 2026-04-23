'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import PredictionChart from '@/components/PredictionChart';
import { apiService, PredictionData } from '@/lib/mockData';
import { Loader2 } from 'lucide-react';

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad'];

export default function PredictionsPage() {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiService.getPredictions(selectedCity);
        setPredictions(data);
      } catch (err) {
        setError('Failed to load prediction data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <Navigation
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        currentPage="/predictions"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Air Quality Predictions
          </h1>
          <p className="text-lg text-gray-600">
            LSTM Model forecasts • Historical accuracy metrics • Next day forecast
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-lg text-gray-600">Loading prediction data...</p>
          </div>
        ) : (
          <PredictionChart data={predictions} city={selectedCity} />
        )}

        {/* About Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-8 border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            About LSTM Predictions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">What is LSTM?</h4>
              <p className="text-gray-700">
                Long Short-Term Memory (LSTM) is a type of recurrent neural
                network that learns long-term dependencies in sequential data.
                It&apos;s ideal for time-series forecasting like PM2.5 predictions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                How accurate are these predictions?
              </h4>
              <p className="text-gray-700">
                Our LSTM model achieves 81-87% accuracy across cities with MAE
                (Mean Absolute Error) of 4-21 units, meaning predictions are
                within ±4 to ±21 μg/m³ of actual values.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
