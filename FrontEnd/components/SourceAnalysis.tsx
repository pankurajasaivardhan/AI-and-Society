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
  Legend,
} from 'recharts';
import { SourceData } from '@/lib/mockData';
import { getPollutantExplanation } from '@/lib/utils/aqiCalculations';

interface SourceAnalysisProps {
  data: SourceData;
  city: string;
}

const COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
];

const POLLUTANT_COLORS: Record<string, string> = {
  PM10: '#FF6B6B',
  CO: '#4ECDC4',
  NH3: '#95E1D3',
  NO2: '#F38181',
  NOx: '#AA96DA',
  SO2: '#FCBAD3',
  Benzene: '#FFFFD2',
  Ozone: '#C1FFD7',
  season_enc: '#B4D7FF',
  month: '#FFB4D7',
};

export default function SourceAnalysis({
  data,
  city,
}: SourceAnalysisProps) {
  // Prepare bar chart data
  const chartData = [
    {
      name: 'PM10',
      importance: (data.pm10_importance * 100).toFixed(1),
      value: data.pm10_importance,
    },
    {
      name: 'CO',
      importance: (data.co_importance * 100).toFixed(1),
      value: data.co_importance,
    },
    {
      name: 'NH3',
      importance: (data.nh3_importance * 100).toFixed(1),
      value: data.nh3_importance,
    },
    {
      name: 'NO2',
      importance: (data.no2_importance * 100).toFixed(1),
      value: data.no2_importance,
    },
  ];

  const topSources = [
    { rank: 1, name: data.top_source_1 },
    { rank: 2, name: data.top_source_2 },
    { rank: 3, name: data.top_source_3 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border-2 border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{payload[0].payload.name}</p>
          <p className="text-sm text-blue-600 font-medium">
            {payload[0].payload.importance}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Sources Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topSources.map((source) => (
          <div
            key={source.rank}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
          >
            {/* Rank Badge */}
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: COLORS[source.rank - 1] }}
              >
                {source.rank}
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Rank {source.rank}
              </span>
            </div>

            {/* Source Name */}
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {source.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {getPollutantExplanation(source.name)}
            </p>

            {/* Importance Bar */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-600">
                  Importance Score
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {
                    chartData.find((d) => d.name === source.name)
                      ?.importance
                  }
                  %
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${chartData.find((d) => d.name === source.name)?.importance}%`,
                    backgroundColor: COLORS[source.rank - 1],
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Importance Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Pollution Source Importance — {city}
        </h3>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      POLLUTANT_COLORS[entry.name] ||
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-blue-200">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Model Confidence Score
            </h3>
            <p className="text-gray-600 max-w-md">
              This score indicates how confident the model is in its predictions
              for pollution sources in {city}. Higher scores mean more reliable
              source analysis.
            </p>
          </div>

          {/* Circular Progress */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 70 * (data.confidence / 100)}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">
                    {(data.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600 text-center font-medium">
              {data.confidence > 0.8
                ? 'Very High Confidence'
                : data.confidence > 0.6
                  ? 'High Confidence'
                  : 'Moderate Confidence'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
