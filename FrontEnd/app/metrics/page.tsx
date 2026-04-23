'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import MetricsDashboard from '@/components/MetricsDashboard';
import { apiService, MetricsData } from '@/lib/mockData';
import { Loader2 } from 'lucide-react';

export default function MetricsPage() {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [metrics, setMetrics] = useState<MetricsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiService.getMetrics();
        setMetrics(data);
      } catch (err) {
        setError('Failed to load metrics');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-50">
      <Navigation
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        currentPage="/metrics"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Model Performance Metrics
          </h1>
          <p className="text-lg text-gray-600">
            Technical transparency • AI model evaluation • Performance benchmarks
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
            <p className="text-lg text-gray-600">Loading metrics...</p>
          </div>
        ) : (
          <MetricsDashboard metrics={metrics} />
        )}

        {/* Technical Details */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-xl p-8 border border-slate-700 text-white">
          <h3 className="text-2xl font-bold mb-6">Model Definitions & Metrics</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="font-bold text-cyan-400 mb-3">RMSE (Root Mean Square Error)</h4>
              <p className="text-gray-300 text-sm mb-3">
                Measures average magnitude of prediction errors. Lower is better.
                Penalizes large errors heavily.
              </p>
              <p className="text-xs text-gray-400 font-mono">
                Formula: √(Σ(actual - predicted)² / n)
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="font-bold text-cyan-400 mb-3">MAE (Mean Absolute Error)</h4>
              <p className="text-gray-300 text-sm mb-3">
                Average absolute difference between predictions and actual values.
                More interpretable than RMSE.
              </p>
              <p className="text-xs text-gray-400 font-mono">
                Formula: Σ|actual - predicted| / n
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="font-bold text-cyan-400 mb-3">R² Score</h4>
              <p className="text-gray-300 text-sm mb-3">
                Coefficient of determination. Indicates what proportion of variance
                in dependent variable is predictable. Range: 0 to 1.
              </p>
              <p className="text-xs text-gray-400 font-mono">
                Higher values indicate better fit to data
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="font-bold text-cyan-400 mb-3">Within 20% Accuracy</h4>
              <p className="text-gray-300 text-sm mb-3">
                Percentage of predictions within ±20% of actual values. Useful for
                categorical accuracy assessment.
              </p>
              <p className="text-xs text-gray-400 font-mono">
                Higher percentage indicates more reliable predictions
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="font-bold text-purple-400 mb-3">Precision & Recall (Anomaly Detection)</h4>
              <p className="text-gray-300 text-sm mb-3">
                Precision: Ratio of correctly detected anomalies to all detected events.
                Recall: Ratio of detected anomalies to all actual anomalies.
              </p>
              <p className="text-xs text-gray-400">
                F1 Score balances both metrics
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="font-bold text-pink-400 mb-3">Feature Importance (SHAP)</h4>
              <p className="text-gray-300 text-sm mb-3">
                SHAP values explain how each feature contributes to model predictions.
                Provides interpretability for XGBoost models.
              </p>
              <p className="text-xs text-gray-400">
                Helps understand which pollutants drive PM2.5 levels
              </p>
            </div>
          </div>

          {/* Data Info */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <h4 className="font-bold text-cyan-400 mb-4">Dataset Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Time Period</p>
                <p className="text-white font-semibold">2010-2023</p>
              </div>
              <div>
                <p className="text-gray-400">Total Records</p>
                <p className="text-white font-semibold">19,018</p>
              </div>
              <div>
                <p className="text-gray-400">Cities Covered</p>
                <p className="text-white font-semibold">4</p>
              </div>
              <div>
                <p className="text-gray-400">Pollutants Tracked</p>
                <p className="text-white font-semibold">6+</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
