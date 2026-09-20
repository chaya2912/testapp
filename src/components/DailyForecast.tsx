import React, { useState } from 'react';
import {
  CalendarDays,
  Droplets,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DailyForecastItem, UnitSystem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import {
  getWeatherInfo,
  formatTemp,
  formatSpeed,
  formatPrecip,
} from '../utils/weatherCodes';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  unitSystem: UnitSystem;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unitSystem }) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  if (!daily || daily.length === 0) {
    return null;
  }

  // Calculate week-wide min and max for relative temperature bar scaling
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const weekMin = Math.min(...allMins);
  const weekMax = Math.max(...allMaxs);
  const range = Math.max(1, weekMax - weekMin);

  const toggleDay = (date: string) => {
    setExpandedDay((prev) => (prev === date ? null : date));
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '--:--';
    try {
      return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarDays className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            7-Day Synoptic Forecast
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Open-Meteo Global Ensemble
        </span>
      </div>

      {/* Forecast Rows */}
      <div className="space-y-2">
        {daily.map((day) => {
          const info = getWeatherInfo(day.weatherCode);
          const isExpanded = expandedDay === day.date;

          // Bar offset calculation
          const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - weekMin) / range) * 100));
          const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((day.tempMax - day.tempMin) / range) * 100));

          return (
            <div
              key={day.date}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-slate-800/80 border-cyan-800/80 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/70 hover:bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleDay(day.date)}
                className="group w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none"
              >
                {/* Day & Date */}
                <div className="w-24 sm:w-28 flex-shrink-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold text-white">{day.dayOfWeek}</span>
                    {day.isToday && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                        NOW
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{day.formattedDate}</span>
                </div>

                {/* Weather Condition Icon & Name */}
                <div className="flex items-center space-x-2.5 flex-1 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-center flex-shrink-0 group-hover:border-slate-700 transition-colors">
                    <WeatherIcon code={day.weatherCode} className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-200 truncate hidden sm:inline">
                    {info.description}
                  </span>
                </div>

                {/* Precipitation Chance */}
                <div className="w-16 sm:w-20 text-right pr-2 sm:pr-4 flex-shrink-0">
                  {day.precipitationProb > 10 ? (
                    <span className="inline-flex items-center text-xs font-semibold text-sky-400">
                      <Droplets className="w-3 h-3 mr-0.5" />
                      {day.precipitationProb}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">--</span>
                  )}
                </div>

                {/* Visual Temperature Bar */}
                <div className="flex items-center space-x-2 sm:space-x-3 w-40 sm:w-56 flex-shrink-0">
                  <span className="text-xs font-semibold text-slate-300 w-9 text-right">
                    {formatTemp(day.tempMin, unitSystem)}
                  </span>
                  <div className="relative flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white w-9">
                    {formatTemp(day.tempMax, unitSystem)}
                  </span>
                </div>

                {/* Expand Chevron */}
                <div className="pl-2 text-slate-500">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Detailed Metrics Drawer */}
              {isExpanded && (
                <div className="px-4 pb-3.5 pt-1 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 flex items-center mb-1">
                      <Wind className="w-3.5 h-3.5 text-teal-400 mr-1" /> Max Wind
                    </span>
                    <span className="font-bold text-white">
                      {formatSpeed(day.windSpeedMax, unitSystem)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 flex items-center mb-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400 mr-1" /> UV Max Index
                    </span>
                    <span className="font-bold text-white">
                      {day.uvIndexMax} {day.uvIndexMax >= 6 ? '(High)' : '(Low)'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 flex items-center mb-1">
                      <Droplets className="w-3.5 h-3.5 text-sky-400 mr-1" /> Expected Rain
                    </span>
                    <span className="font-bold text-white">
                      {formatPrecip(day.precipitationSum, unitSystem)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 flex items-center mb-1">
                      <Sunrise className="w-3.5 h-3.5 text-amber-400 mr-1" /> Sun Times
                    </span>
                    <span className="font-medium text-slate-200">
                      {formatTime(day.sunrise)} - {formatTime(day.sunset)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
