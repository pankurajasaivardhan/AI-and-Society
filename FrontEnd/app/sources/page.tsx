'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import SourceAnalysis from '@/components/SourceAnalysis';
import { apiService, SourceData } from '@/lib/mockData';
import { Loader2 } from 'lucide-react';

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad'];

export default function SourcesPage() {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [sources, setSources] = useState<SourceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiService.getSources(selectedCity);
        setSources(data);
      } catch (err) {
        setError('Failed to load source data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50">
      <Navigation
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        currentPage="/sources"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Pollution Source Analysis
          </h1>
          <p className="text-lg text-gray-600">
            XGBoost feature importance • SHAP explanations • Top pollution sources
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-lg text-gray-600">Loading source analysis...</p>
          </div>
        ) : (
          sources && <SourceAnalysis data={sources} city={selectedCity} />
        )}

        {/* About Section */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-lg p-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Understanding Pollution Sources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="text-2xl mr-2">🚗</span>
                Transport & Vehicles
              </h4>
              <p className="text-gray-700 text-sm">
                CO from vehicle exhausts and PM10 from tire and brake wear are
                major contributors. Diesel vehicles are particularly problematic.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="text-2xl mr-2">🏭</span>
                Industrial Sources
              </h4>
              <p className="text-gray-700 text-sm">
                NO2 and SO2 from power plants and factories. Seasonal burning and
                construction activities spike pollution levels.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="text-2xl mr-2">🌾</span>
                Agricultural Sources
              </h4>
              <p className="text-gray-700 text-sm">
                NH3 (ammonia) from sewage treatment and agricultural burning is
                a seasonal contributor, especially in Punjab and Haryana.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="text-2xl mr-2">❄️</span>
                Weather & Geography
              </h4>
              <p className="text-gray-700 text-sm">
                Temperature inversions trap pollution. Dust storms from deserts
                add to PM levels during summer months.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
