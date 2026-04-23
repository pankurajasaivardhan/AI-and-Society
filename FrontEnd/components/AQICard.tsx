'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { getAQIInfo } from '@/lib/utils/aqiCalculations';

interface AQICardProps {
  city: string;
  pm25: number;
  trend?: 'up' | 'down' | 'same';
  isSelected?: boolean;
}

export default function AQICard({
  city,
  pm25,
  trend = 'same',
  isSelected = false,
}: AQICardProps) {
  const aqiInfo = getAQIInfo(pm25);

  return (
    <div className="group perspective">
      <div
        className={`relative rounded-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 ${
          isSelected ? 'scale-105 -translate-y-3' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, #0f1419 0%, #1a1f3a 100%)`,
          border: '2px solid',
          borderColor: isSelected ? aqiInfo.color : `${aqiInfo.color}40`,
          boxShadow: isSelected 
            ? `0 20px 40px rgba(0,0,0,0.4), 0 0 40px ${aqiInfo.color}, inset 0 1px 0 rgba(255,255,255,0.1)`
            : `0 15px 35px rgba(0,0,0,0.3), 0 0 30px ${aqiInfo.color}30, inset 0 1px 0 rgba(255,255,255,0.05)`
        }}
      >
        {/* Animated Glow Background */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <div 
            className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full opacity-40"
            style={{
              background: `radial-gradient(circle, ${aqiInfo.color}60 0%, transparent 70%)`
            }}
          />
        </div>

        {/* Content */}
        <div className="relative p-6 z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xs font-bold uppercase tracking-[2px]" 
              style={{ color: `${aqiInfo.color}80` }}>
              ◆ {city}
            </h3>
            <span
              className="px-3 py-1 rounded-lg text-xs font-bold text-white backdrop-blur-sm border"
              style={{ 
                backgroundColor: `${aqiInfo.color}30`,
                borderColor: `${aqiInfo.color}60`,
                color: aqiInfo.color
              }}
            >
              {aqiInfo.level}
            </span>
          </div>

          {/* Large AQI Number */}
          <div className="mb-6">
            <div
              className="text-6xl font-black mb-2 leading-none"
              style={{ 
                color: aqiInfo.color,
                textShadow: `0 0 30px ${aqiInfo.color}60, 0 0 60px ${aqiInfo.color}30`
              }}
            >
              {Math.round(pm25)}
            </div>
            <p className="text-xs text-cyan-300/70 font-medium">
              PM2.5 • {pm25.toFixed(1)} μg/m³
            </p>
          </div>

          {/* Health Message */}
          <p className="text-xs text-gray-300 mb-6 leading-relaxed h-10 overflow-hidden">
            {aqiInfo.message}
          </p>

          {/* Trend Indicator */}
          <div className="flex items-center justify-between pt-4 border-t border-cyan-500/20">
            <span className="text-xs text-cyan-300/60">vs Yesterday</span>
            <div
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold border backdrop-blur-sm ${
                trend === 'up'
                  ? 'text-red-400 bg-red-500/20 border-red-500/40'
                  : trend === 'down'
                    ? 'text-green-400 bg-green-500/20 border-green-500/40'
                    : 'text-cyan-300 bg-cyan-500/20 border-cyan-500/40'
              }`}
            >
              {trend === 'up' && <ArrowUp size={13} />}
              {trend === 'down' && <ArrowDown size={13} />}
              <span>
                {trend === 'up' ? 'Worse' : trend === 'down' ? 'Better' : 'Same'}
              </span>
            </div>
          </div>
        </div>

        {/* Corner accent */}
        <div 
          className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${aqiInfo.color} 0%, transparent 70%)`
          }}
        />
      </div>
    </div>
  );
}
