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
  ReferenceLine,
} from 'recharts';
import { PredictionData } from '@/lib/mockData';
import { getAQIInfo } from '@/lib/utils/aqiCalculations';

interface PredictionChartProps {
  data: PredictionData[];
  city: string;
}

export default function PredictionChart({
  data,
  city,
}: PredictionChartProps) {
  // Get last 365 days
  const chartData = data.slice(-365);

  // Calculate metrics
  const predictions = chartData.map((d) => ({
    ...d,
    error: Math.abs(d.predicted_pm25 - d.actual_pm25),
  }));

  const mae =
    predictions.reduce((sum, p) => sum + p.error, 0) / predictions.length;
  const rmse = Math.sqrt(
    predictions.reduce((sum, p) => sum + p.error * p.error, 0) /
      predictions.length
  );

  const r2ScoreCalc = () => {
    const meanActual =
      chartData.reduce((sum, d) => sum + d.actual_pm25, 0) /
      chartData.length;
    const ssRes = chartData.reduce(
      (sum, d) => sum + Math.pow(d.actual_pm25 - d.predicted_pm25, 2),
      0
    );
    const ssTot = chartData.reduce(
      (sum, d) => sum + Math.pow(d.actual_pm25 - meanActual, 2),
      0
    );
    return 1 - ssRes / ssTot;
  };

  const r2Score = r2ScoreCalc();
  const accuracy = Math.max(
    0,
    (100 * (1 - mae / 100))
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const error = Math.abs((data.actual_pm25 || 0) - (data.predicted_pm25 || 0));
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-cyan-500/50">
          <p className="text-sm font-semibold text-cyan-300">{data.date}</p>
          <p className="text-sm text-blue-300 font-medium">
            Actual: {(data.actual_pm25 || 0).toFixed(1)} μg/m³
          </p>
          <p className="text-sm text-purple-300 font-medium">
            Predicted: {(data.predicted_pm25 || 0).toFixed(1)} μg/m³
          </p>
          <p className="text-sm text-orange-300">
            Error: {error.toFixed(1)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Get next day forecast
  const lastData = chartData[chartData.length - 1];
  const nextDayDate = new Date(lastData.date);
  nextDayDate.setDate(nextDayDate.getDate() + 1);
  const forecastPM25 = lastData.predicted_pm25 + (Math.random() - 0.5) * 20;
  const forecastAQI = getAQIInfo(forecastPM25);

  const MetricCard = ({ label, value, color }: any) => (
    <div className="group relative overflow-hidden rounded-xl transform transition-all duration-300 hover:scale-105"
      style={{
        background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
        border: `2px solid ${color}40`,
        boxShadow: `0 10px 30px rgba(0,0,0,0.2), 0 0 20px ${color}20, inset 0 1px 0 rgba(255,255,255,0.1)`
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`
        }}
      />
      <div className="relative p-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: `${color}80` }}>
          {label}
        </p>
        <p className="text-3xl font-black" style={{ 
          color,
          textShadow: `0 0 20px ${color}40`
        }}>
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Next Day Forecast Banner - 3D Card */}
      <div className="group perspective">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl"
          style={{
            background: `linear-gradient(135deg, #1a1f3a 0%, #16213e 100%)`,
            border: '2px solid',
            borderColor: forecastAQI.color,
            boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 40px ${forecastAQI.color}40, inset 0 1px 0 rgba(255,255,255,0.1)`
          }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full" 
              style={{
                background: `radial-gradient(circle, ${forecastAQI.color}40 0%, transparent 70%)`,
                animation: 'pulse 4s ease-in-out infinite'
              }} 
            />
          </div>

          <div className="relative z-10 p-8 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[3px] opacity-70 mb-4" style={{ color: forecastAQI.color }}>
              ◆ Tomorrow&apos;s Forecast
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-7xl font-black mb-4" style={{ 
                  color: forecastAQI.color,
                  textShadow: `0 0 30px ${forecastAQI.color}60`
                }}>
                  {forecastPM25.toFixed(0)}
                </p>
                <p className="text-cyan-300/80 text-sm font-medium mb-4">
                  PM2.5 • {nextDayDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
                <div className="inline-block px-5 py-2 rounded-xl font-bold text-sm"
                  style={{
                    background: `${forecastAQI.color}20`,
                    color: forecastAQI.color,
                    border: `2px solid ${forecastAQI.color}60`,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {forecastAQI.level}
                </div>
              </div>
              <div className="text-right">
                <p className="text-cyan-300/60 text-xs font-semibold uppercase mb-2">Health Status</p>
                <p className="text-white text-lg font-medium leading-relaxed max-w-xs ml-auto">
                  {forecastAQI.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Chart - 3D Dark Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500"
        style={{
          background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 100%)',
          border: '2px solid',
          borderColor: '#00d4ff40',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 60px #00d4ff20, inset 0 1px 0 rgba(0,212,255,0.1)'
        }}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full" 
            style={{
              background: 'radial-gradient(circle, #00d4ff 0%, transparent 70%)'
            }} 
          />
        </div>

        <div className="relative z-10 p-8">
          <h3 className="text-3xl font-black mb-8" 
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Actual vs Predicted PM2.5 — {city}
          </h3>

          <div className="w-full h-96 rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(15,20,25,0.8), rgba(26,31,58,0.8))',
              border: '1px solid #00d4ff20'
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0099ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0099ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#00d4ff15" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#00d4ff80' }}
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                  axisLine={{ stroke: '#00d4ff30' }}
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
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  type="monotone"
                  dataKey="actual_pm25"
                  stroke="#0099ff"
                  strokeWidth={3}
                  dot={false}
                  name="Actual PM2.5"
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="predicted_pm25"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={false}
                  name="Predicted PM2.5"
                  strokeDasharray="5 5"
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Metrics - 3D Dark Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 100%)',
          border: '2px solid #00d4ff40',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 60px #00d4ff20, inset 0 1px 0 rgba(0,212,255,0.1)'
        }}
      >
        <div className="relative z-10 p-8">
          <h3 className="text-3xl font-black mb-8" 
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Model Performance Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              label="RMSE"
              value={rmse.toFixed(2)}
              color="#0099ff"
            />
            <MetricCard
              label="MAE"
              value={mae.toFixed(2)}
              color="#a855f7"
            />
            <MetricCard
              label="R² Score"
              value={(r2Score * 100).toFixed(1) + '%'}
              color="#00d4ff"
            />
            <MetricCard
              label="Accuracy"
              value={accuracy.toFixed(1) + '%'}
              color="#ff6b6b"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
