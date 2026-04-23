'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MetricsData } from '@/lib/mockData';

interface MetricsDashboardProps {
  metrics: MetricsData[];
}

const CITY_COLORS = {
  Delhi: '#FF6B6B',
  Mumbai: '#4ECDC4',
  Bengaluru: '#95E1D3',
  Hyderabad: '#F59E0B',
};

export default function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  // Filter LSTM metrics
  const lstmMetrics = metrics.filter((m) => m.model_type === 'LSTM');

  // Prepare RMSE comparison data
  const rmseData = lstmMetrics.map((m) => ({
    city: m.city,
    rmse: m.rmse,
    mae: m.mae,
  }));

  // Prepare accuracy data
  const accuracyData = lstmMetrics.map((m) => ({
    city: m.city,
    accuracy: m.accuracy,
    within20: m.within_20_percent,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border-2 border-gray-200">
          <p className="text-sm font-semibold text-gray-800">
            {payload[0].payload.city}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.fill }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const MetricCard = ({
    title,
    value,
    unit,
    color,
  }: {
    title: string;
    value: number | string;
    unit?: string;
    color: string;
  }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
        {title}
      </p>
      <div className="flex items-end space-x-2">
        <p className="text-3xl font-bold" style={{ color }}>
          {typeof value === 'number' ? value.toFixed(2) : value}
        </p>
        {unit && <p className="text-sm text-gray-600 mb-1">{unit}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* LSTM Model Performance Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          LSTM Model Metrics
        </h3>
        <p className="text-gray-600 mb-6">
          Performance metrics for the LSTM prediction model across all cities
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  City
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  RMSE
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  MAE
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  R² Score
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Accuracy
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Within 20%
                </th>
              </tr>
            </thead>
            <tbody>
              {lstmMetrics.map((metric, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {metric.city}
                  </td>
                  <td className="px-6 py-4 text-blue-600 font-medium">
                    {metric.rmse.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-purple-600 font-medium">
                    {metric.mae.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-green-600 font-medium">
                    {(metric.r2_score * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-orange-600 font-medium">
                    {metric.accuracy.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-cyan-600 font-medium">
                    {metric.within_20_percent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RMSE & MAE Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Prediction Error Metrics
        </h3>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rmseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rmse" fill="#3B82F6" name="RMSE" radius={[8, 8, 0, 0]}>
                {rmseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CITY_COLORS[entry.city as keyof typeof CITY_COLORS]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accuracy Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Model Accuracy by City
          </h3>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="city"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="accuracy"
                  fill="#10B981"
                  name="Accuracy (%)"
                  radius={[8, 8, 0, 0]}
                >
                  {accuracyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        CITY_COLORS[entry.city as keyof typeof CITY_COLORS]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Within 20% Accuracy */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Predictions Within 20%
          </h3>

          <div className="space-y-4">
            {accuracyData.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">
                    {item.city}
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {item.within20.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.within20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Comparison Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Model Architecture & Performance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
            <h4 className="font-bold text-gray-800 mb-2">LSTM Model</h4>
            <p className="text-sm text-gray-600 mb-4">
              Long Short-Term Memory neural network for sequential PM2.5 predictions
            </p>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-semibold text-gray-700">Purpose:</span>{' '}
                <span className="text-gray-600">Forecasting</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Avg Accuracy:</span>{' '}
                <span className="text-blue-600 font-bold">
                  {(
                    lstmMetrics.reduce((sum, m) => sum + m.accuracy, 0) /
                    lstmMetrics.length
                  ).toFixed(1)}
                  %
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
            <h4 className="font-bold text-gray-800 mb-2">XGBoost Model</h4>
            <p className="text-sm text-gray-600 mb-4">
              Extreme Gradient Boosting for feature importance ranking
            </p>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-semibold text-gray-700">Purpose:</span>{' '}
                <span className="text-gray-600">Source Analysis</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">R² Score:</span>{' '}
                <span className="text-purple-600 font-bold">0.9367</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-pink-500">
            <h4 className="font-bold text-gray-800 mb-2">Autoencoder</h4>
            <p className="text-sm text-gray-600 mb-4">
              Neural network for unsupervised anomaly detection
            </p>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-semibold text-gray-700">Purpose:</span>{' '}
                <span className="text-gray-600">Anomaly Detection</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Precision:</span>{' '}
                <span className="text-pink-600 font-bold">0.2023</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
