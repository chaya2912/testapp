import React from 'react';
import {
  Wind,
  Droplets,
  Gauge,
  Sun,
  Eye,
  ArrowUp,
  ArrowDown,
  Sunrise,
  Sunset,
  CloudRain,
  Compass,
  MapPin,
  Calendar,
} from 'lucide-react';
import { ProcessedWeatherData, UnitSystem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import {
  getWeatherInfo,
  formatTemp,
  formatSpeed,
  formatPrecip,
  getWindDirectionCompass,
} from '../utils/weatherCodes';

interface CurrentWeatherProps {
  data: ProcessedWeatherData;
  unitSystem: UnitSystem;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unitSystem }) => {
  const { current, location, daily } = data;
  const weatherInfo = getWeatherInfo(current.weatherCode);
  const todayForecast = daily[0];

  // UV category
  const getUVCategory = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-400 bg-orange-950/60 border-orange-800' };
    if (uv <= 10) return { label: 'Very High', color: 'text-rose-400 bg-rose-950/60 border-rose-800' };
    return { label: 'Extreme', color: 'text-purple-400 bg-purple-950/60 border-purple-800' };
  };

  const uvCat = getUVCategory(current.uvIndex);

  // Format sunrise / sunset
  const formatTimeStr = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="w-full space-y-4" id="current-weather-section">
      {/* Hero Weather Condition Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b ${weatherInfo.bannerGradient} bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-md`}
      >
        {/* Subtle Ambient Background Accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Location & Primary Condition */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {location.name}
              </span>
              {location.country_code && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800/90 text-cyan-300 border border-slate-700">
                  {location.country_code}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-400 flex items-center space-x-2">
              <span>{location.admin1 ? `${location.admin1}, ` : ''}{location.country}</span>
              <span>•</span>
              <span className="font-mono text-slate-400">
                {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
              </span>
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 shadow-inner flex items-center justify-center transition-all duration-300 hover:scale-105 hover:border-slate-700 hover:bg-slate-950/80">
                <WeatherIcon code={current.weatherCode} isDay={current.isDay} className="w-12 h-12" />
              </div>
              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-700">
                  {weatherInfo.description}
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  {current.isDay ? 'Daytime Observation' : 'Nighttime Conditions'}
                </p>
              </div>
            </div>
          </div>

          {/* Large Temperature Display & Extremes */}
          <div className="flex flex-col md:items-end justify-center space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white">
                {formatTemp(current.temperature, unitSystem)}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-300">
              <span>
                Feels like{' '}
                <strong className="text-white font-semibold">
                  {formatTemp(current.apparentTemperature, unitSystem)}
                </strong>
              </span>
              {todayForecast && (
                <div className="flex items-center space-x-2 pl-3 border-l border-slate-700">
                  <span className="flex items-center text-rose-400 font-medium">
                    <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                    {formatTemp(todayForecast.tempMax, unitSystem)}
                  </span>
                  <span className="flex items-center text-sky-400 font-medium">
                    <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                    {formatTemp(todayForecast.tempMin, unitSystem)}
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Synced with Open-Meteo High-Resolution Model
            </p>
          </div>
        </div>
      </div>

      {/* Atmospheric Micro-Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Wind Speed & Compass */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Wind</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white">
              {formatSpeed(current.windSpeed, unitSystem)}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
              <span>{getWindDirectionCompass(current.windDirection)} ({current.windDirection}°)</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Gusts: {formatSpeed(current.windGusts, unitSystem)}
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Humidity</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white">
              {current.relativeHumidity}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {current.relativeHumidity > 70
                ? 'Humid / Muggy'
                : current.relativeHumidity < 30
                ? 'Dry Air'
                : 'Comfortable'}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
              <div
                className="bg-blue-500 h-1 rounded-full"
                style={{ width: `${Math.min(100, current.relativeHumidity)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Barometric Pressure */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Pressure</span>
            <Gauge className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white">
              {Math.round(current.pressure)} <span className="text-xs font-normal text-slate-400">hPa</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {current.pressure > 1018
                ? 'High Pressure (Stable)'
                : current.pressure < 1008
                ? 'Low Pressure (Active)'
                : 'Normal Sea Level'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">MSL Barometer</div>
          </div>
        </div>

        {/* UV Index */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-base sm:text-lg font-bold text-white">{current.uvIndex}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${uvCat.color}`}>
                {uvCat.label}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {current.uvIndex >= 6 ? 'Sun protection required' : 'Low risk of burn'}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
              <div
                className="bg-amber-400 h-1 rounded-full"
                style={{ width: `${Math.min(100, (current.uvIndex / 11) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Precipitation Rate */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Precipitation</span>
            <CloudRain className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white">
              {formatPrecip(current.precipitation, unitSystem)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {current.precipitation > 0 ? 'Active Rainfall' : 'No Current Rain'}
            </div>
            {todayForecast && (
              <div className="text-[10px] text-slate-500 mt-1">
                Day Sum: {formatPrecip(todayForecast.precipitationSum, unitSystem)}
              </div>
            )}
          </div>
        </div>

        {/* Sunrise & Sunset */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Sun Cycle</span>
            <Sunrise className="w-4 h-4 text-amber-300" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center">
                <Sunrise className="w-3 h-3 text-amber-400 mr-1" /> Rise
              </span>
              <span className="font-semibold text-slate-200">
                {formatTimeStr(todayForecast?.sunrise)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center">
                <Sunset className="w-3 h-3 text-rose-400 mr-1" /> Set
              </span>
              <span className="font-semibold text-slate-200">
                {formatTimeStr(todayForecast?.sunset)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
