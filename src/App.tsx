/**
 * Weather Intelligence - Production Application
 * Built with React 19, TypeScript, Tailwind CSS & Open-Meteo API
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  RefreshCw,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { Header } from './components/Header';
import { CitySearch } from './components/CitySearch';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { ActivityRecommendations } from './components/ActivityRecommendations';
import { WeatherAlerts } from './components/WeatherAlerts';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ProductionDocsModal } from './components/ProductionDocsModal';
import { GeoLocationResult, ProcessedWeatherData, UnitSystem } from './types/weather';
import { ThemeId } from './types/theme';
import { fetchWeatherForecast, POPULAR_CITIES } from './services/openMeteo';

const DEFAULT_CITY = POPULAR_CITIES[0]; // New York

export default function App() {
  const [selectedCity, setSelectedCity] = useState<GeoLocationResult>(() => {
    try {
      const saved = localStorage.getItem('weather_selected_city');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem('weather_unit_system');
      return (saved as UnitSystem) || 'metric';
    } catch {
      return 'metric';
    }
  });

  const [theme, setTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('weather_color_theme');
      return (saved as ThemeId) || 'sapphire';
    } catch {
      return 'sapphire';
    }
  });

  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);

  // Sync theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('weather_color_theme', theme);
    } catch {
      // Storage quota
    }
  }, [theme]);

  // Load weather forecast
  const loadForecast = useCallback(
    async (city: GeoLocationResult, units: UnitSystem, force = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchWeatherForecast(city, units, force);
        setWeatherData(data);
      } catch (err: unknown) {
        console.error('Failed to load weather data:', err);
        setError(
          (err as Error)?.message ||
            'Unable to communicate with Open-Meteo API. Please check your network connection.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load and on city or unit change
  useEffect(() => {
    if (selectedCity) {
      loadForecast(selectedCity, unitSystem);
      try {
        localStorage.setItem('weather_selected_city', JSON.stringify(selectedCity));
      } catch {
        // Storage quota
      }
    }
  }, [selectedCity, unitSystem, loadForecast]);

  // Unit toggle handler
  const handleToggleUnit = () => {
    const nextUnit = unitSystem === 'metric' ? 'imperial' : 'metric';
    setUnitSystem(nextUnit);
    try {
      localStorage.setItem('weather_unit_system', nextUnit);
    } catch {
      // Storage quota
    }
  };

  // City selection handler
  const handleSelectCity = (city: GeoLocationResult) => {
    setSelectedCity(city);
  };

  // Browser Geolocation handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const currentLocCity: GeoLocationResult = {
          id: 999999999,
          name: 'Current Location',
          latitude,
          longitude,
          country: 'Local GPS Coordinates',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
        };
        setSelectedCity(currentLocCity);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Failed to retrieve location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access or search manually.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'GPS signal unavailable. Please search for your city above.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'GPS request timed out. Please try again or search manually.';
        }
        setError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white transition-colors duration-300"
    >
      {/* Top Sticky Header */}
      <Header
        location={selectedCity}
        unitSystem={unitSystem}
        onToggleUnit={handleToggleUnit}
        onRefresh={() => loadForecast(selectedCity, unitSystem, true)}
        isLoading={isLoading}
        isCached={weatherData?.isCached}
        onOpenDocs={() => setIsDocsOpen(true)}
        theme={theme}
        onSelectTheme={setTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* City Search Bar & Quick Selectors */}
        <section id="search-section">
          <CitySearch
            onSelectCity={handleSelectCity}
            selectedCity={selectedCity}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLocating={isLocating}
          />
        </section>

        {/* Global Error Banner */}
        {error && (
          <div
            id="error-banner"
            className="flex items-start justify-between p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs shadow-lg"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Weather Service Notice</h4>
                <p className="mt-1 text-rose-300 leading-relaxed">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => loadForecast(selectedCity, unitSystem, true)}
              className="px-3 py-1.5 rounded-lg bg-rose-900/80 text-white font-medium hover:bg-rose-800 transition-colors flex items-center space-x-1.5 flex-shrink-0 ml-3"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Atmospheric Severe Alerts */}
        {weatherData && weatherData.alerts && (
          <WeatherAlerts alerts={weatherData.alerts} />
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData ? (
          <SkeletonLoader />
        ) : weatherData ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Hero Current Weather & Micro-Metrics Grid */}
            <CurrentWeather data={weatherData} unitSystem={unitSystem} />

            {/* 24-Hour Timeline */}
            <HourlyForecast hourly={weatherData.hourly} unitSystem={unitSystem} />

            {/* Two-Column Responsive Grid: 7-Day Forecast & Activity Recommendation Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 7-Day Daily Forecast Column */}
              <div className="lg:col-span-6 space-y-4">
                <DailyForecast daily={weatherData.daily} unitSystem={unitSystem} />
              </div>

              {/* Automated Activity Recommendations Column */}
              <div className="lg:col-span-6 space-y-4">
                <ActivityRecommendations
                  activities={weatherData.activities}
                  gear={weatherData.gear}
                />
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Production Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">Weather Intelligence</span>
            <span>•</span>
            <span>Open-Meteo High-Resolution Forecasting Model</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsDocsOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Production Setup & Docker
            </button>
            <span>•</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-300 flex items-center space-x-1"
            >
              <span>Open-Meteo API</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Production Documentation & Deployment Modal */}
      <ProductionDocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
}
