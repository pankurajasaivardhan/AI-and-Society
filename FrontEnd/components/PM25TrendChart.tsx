'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { PollutionData } from '@/lib/mockData';
import { getAQIInfo } from '@/lib/utils/aqiCalculations';
import { useState } from 'react';

interface PM25TrendChartProps {
  data: PollutionData[];
  city: string;
}

type DateRange = '30d' | '90d' | '1yr' | 'all';

export default function PM25TrendChart({
  data,
  city,
}: PM25TrendChartProps) {
  const [dateRange, setDateRange] = useState<DateRange>('90d');

  // Filter data based on date range
  const getFilteredData = (): PollutionData[] => {
    const today = new Date();
    let days = 90;

    switch (dateRange) {
      case '30d':
        days = 30;
        break;
      case '90d':
        days = 90;
        break;
      case '1yr':
        days = 365;
        break;
      case 'all':
        return data;
      default:
        days = 90;
    }

    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return data.filter((d) => new Date(d.date) >= cutoffDate);
  };

  const filteredData = getFilteredData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const aqiInfo = getAQIInfo(data.pm25);
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-cyan-500/50">
          <p className="text-sm font-semibold text-cyan-300">{data.date}</p>
          <p className="text-sm text-cyan-300/70">PM2.5: {data.pm25.toFixed(1)} μg/m³</p>
          <p
            className="text-sm font-bold"
            style={{ color: aqiInfo.color }}
          >
            {aqiInfo.level}
          </p>
        </div>
      );
    }
    return null;
  };

  // Get line color based on average AQI
  const avgPM25 =
    filteredData.reduce((sum, d) => sum + d.pm25, 0) / filteredData.length;
  const lineColor = getAQIInfo(avgPM25).color;

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 100%)',
        border: '2px solid #00d4ff40',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 60px #00d4ff20, inset 0 1px 0 rgba(0,212,255,0.1)'
      }}
    >
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-3xl font-black flex items-center space-x-3 mb-2"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              <span>📈</span>
              <span>PM2.5 Trend — {city}</span>
            </h3>
            <p className="text-sm text-cyan-300/70">
              Real-time PM2.5 level trends
            </p>
          </div>

          {/* Date Range Selector */}
          <div className="flex space-x-2">
            {(['30d', '90d', '1yr', 'all'] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm ${
                  dateRange === range
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500 shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-800/50 text-cyan-300/60 border border-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-300'
                }`}
              >
                {range === '30d'
                  ? '30d'
                  : range === '90d'
                    ? '90d'
                    : range === '1yr'
                      ? '1yr'
                      : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-80 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15,20,25,0.8), rgba(26,31,58,0.8))',
            border: '1px solid #00d4ff20'
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPM25" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#00d4ff15" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#00d4ff80' }}
                axisLine={{ stroke: '#00d4ff30' }}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#00d4ff80' }}
                axisLine={{ stroke: '#00d4ff30' }}
                label={{
                  value: 'PM2.5 (μg/m³)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#00d4ff80', fontSize: 11 },
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#00d4ff40' }} />
              <Area
                type="monotone"
                dataKey="pm25"
                stroke={lineColor}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPM25)"
                dot={false}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-8 border-t border-cyan-500/20">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-1 rounded-full"
                style={{ backgroundColor: lineColor, boxShadow: `0 0 10px ${lineColor}` }}
              />
              <span className="text-cyan-300/70 font-medium">PM2.5 Level</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-cyan-300/70 font-medium">
                Average: <strong style={{ color: lineColor }}>{avgPM25.toFixed(1)} μg/m³</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
