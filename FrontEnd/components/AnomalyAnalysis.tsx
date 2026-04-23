'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { PollutionData, AnomalyData } from '@/lib/mockData';
import { formatDate } from '@/lib/utils/aqiCalculations';

interface AnomalyAnalysisProps {
  pollutionData: PollutionData[];
  anomalyData: AnomalyData[];
  city: string;
}

export default function AnomalyAnalysis({
  pollutionData,
  anomalyData,
  city,
}: AnomalyAnalysisProps) {
  // Calculate anomaly threshold (mean + 2*std)
  const pm25Values = pollutionData.map((d) => d.pm25);
  const mean = pm25Values.reduce((a, b) => a + b, 0) / pm25Values.length;
  const variance =
    pm25Values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    pm25Values.length;
  const threshold = mean + 2 * Math.sqrt(variance);

  // Prepare timeline data
  const timelineData = pollutionData.map((d) => {
    const isAnomaly = anomalyData.some((a) => a.date === d.date);
    return {
      ...d,
      isAnomaly,
      anomalyValue: isAnomaly ? d.pm25 : null,
    };
  });

  // Severity badges
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Moderate':
        return '#FF8C00';
      case 'High':
        return '#DC2626';
      case 'Severe':
        return '#7C3AED';
      default:
        return '#6B7280';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{data.date}</p>
          <p className="text-sm text-blue-600">PM2.5: {data.pm25.toFixed(1)}</p>
          {data.isAnomaly && (
            <p className="text-sm text-red-600 font-bold">⚠️ ANOMALY</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Seasonal breakdown
  const getSeasonalData = () => {
    const seasons = {
      Winter: { months: [12, 1, 2], count: 0 },
      Spring: { months: [3, 4, 5], count: 0 },
      Summer: { months: [6, 7, 8], count: 0 },
      Monsoon: { months: [9, 10, 11], count: 0 },
    };

    anomalyData.forEach((anomaly) => {
      const month = new Date(anomaly.date).getMonth() + 1;
      Object.entries(seasons).forEach(([season, data]) => {
        if (data.months.includes(month)) {
          data.count++;
        }
      });
    });

    return Object.entries(seasons).map(([name, data]) => ({
      name,
      count: data.count,
    }));
  };

  const seasonalData = getSeasonalData();

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-lg p-6 border border-red-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Anomaly Detection Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-2">
              Total Anomalies Detected
            </p>
            <p className="text-4xl font-bold text-red-600">
              {anomalyData.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-2">
              Anomaly Threshold
            </p>
            <p className="text-4xl font-bold text-orange-600">
              {threshold.toFixed(1)}
            </p>
            <p className="text-xs text-gray-600 mt-2">μg/m³</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-2">
              Detection Rate
            </p>
            <p className="text-4xl font-bold text-purple-600">
              {(
                (anomalyData.length / pollutionData.length) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          PM2.5 Timeline with Anomalies — {city}
        </h3>

        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                label={{
                  value: 'PM2.5 (μg/m³)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#6b7280', fontSize: 12 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={threshold}
                stroke="#FF6B6B"
                strokeDasharray="5 5"
                label={{
                  value: `Threshold: ${threshold.toFixed(1)}`,
                  position: 'right',
                  fill: '#FF6B6B',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                name="PM2.5"
              />
              <Line
                type="stepAfter"
                dataKey="anomalyValue"
                stroke="#DC2626"
                strokeWidth={4}
                dot={{ fill: '#DC2626', r: 6 }}
                name="Anomaly"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomaly Events Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Top Anomaly Events
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Rank
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  PM2.5
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Severity
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Error Score
                </th>
              </tr>
            </thead>
            <tbody>
              {anomalyData.map((anomaly, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-4 text-gray-700 font-medium">
                    {formatDate(anomaly.date)}
                  </td>
                  <td className="px-4 py-4 font-bold text-blue-600">
                    {anomaly.pm25.toFixed(1)} μg/m³
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{
                        backgroundColor: getSeverityColor(anomaly.severity),
                      }}
                    >
                      {anomaly.severity}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {anomaly.reconstruction_error.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seasonal Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Seasonal Anomaly Distribution
        </h3>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seasonalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                {seasonalData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#FF6B6B', '#FF8C00', '#4ECDC4', '#8B5CF6'][
                      index % 4
                    ]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
