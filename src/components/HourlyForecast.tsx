import React, { useState } from 'react';
import { Clock, Droplets, Wind, Sun } from 'lucide-react';
import { HourlyForecastItem, UnitSystem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemp, formatSpeed, getWeatherInfo } from '../utils/weatherCodes';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unitSystem: UnitSystem;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unitSystem }) => {
  const [selectedHour, setSelectedHour] = useState<HourlyForecastItem | null>(null);

  if (!hourly || hourly.length === 0) {
    return null;
  }

  const items = hourly.slice(0, 24);
  const activeItem = selectedHour || items[0];
  const activeInfo = getWeatherInfo(activeItem.weatherCode);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            24-Hour Atmospheric Outlook
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Scroll or click hour for details
        </span>
      </div>

      {/* Selected Hour Quick Inspector Banner */}
      {activeItem && (
        <div className="px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-cyan-400">{activeItem.formattedTime}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-200">{activeInfo.description}</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-300">
            <span>
              Temp: <strong className="text-white">{formatTemp(activeItem.temperature, unitSystem)}</strong>
            </span>
            <span className="flex items-center text-sky-400">
              <Droplets className="w-3 h-3 mr-1" />
              {activeItem.precipitationProb}% rain
            </span>
            <span className="flex items-center text-teal-300">
              <Wind className="w-3 h-3 mr-1" />
              {formatSpeed(activeItem.windSpeed, unitSystem)}
            </span>
            {activeItem.uvIndex > 0 && (
              <span className="flex items-center text-amber-400">
                <Sun className="w-3 h-3 mr-1" />
                UV {activeItem.uvIndex}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Scrollable Hourly Timeline */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {items.map((item, idx) => {
          const isSelected = activeItem.time === item.time;
          let isDay = true;
          try {
            const h = new Date(item.time).getHours();
            isDay = h >= 6 && h < 20;
          } catch {
            isDay = true;
          }

          return (
            <button
              key={`${item.time}-${idx}`}
              type="button"
              onClick={() => setSelectedHour(item)}
              className={`group flex-shrink-0 w-20 p-3 rounded-xl border flex flex-col items-center justify-between space-y-2.5 transition-all text-center focus:outline-none ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                  : item.isCurrentHour
                  ? 'bg-slate-800/80 border-cyan-800/60 text-slate-100'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700 text-slate-300'
              }`}
            >
              <span className="text-[11px] font-medium text-slate-400">
                {item.formattedTime}
              </span>

              <div className="my-1 w-8 h-8 rounded-lg bg-slate-900/60 border border-slate-800/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <WeatherIcon code={item.weatherCode} isDay={isDay} className="w-5 h-5" />
              </div>

              <span className="text-sm font-bold text-white">
                {formatTemp(item.temperature, unitSystem)}
              </span>

              {/* Rain Probability Mini-Indicator */}
              <div className="flex items-center space-x-1 text-[10px]">
                <Droplets
                  className={`w-3 h-3 ${
                    item.precipitationProb > 30 ? 'text-sky-400' : 'text-slate-600'
                  }`}
                />
                <span
                  className={
                    item.precipitationProb > 30
                      ? 'font-semibold text-sky-400'
                      : 'text-slate-500'
                  }
                >
                  {item.precipitationProb}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
