import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Clock,
  X,
  Loader2,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { GeoLocationResult } from '../types/weather';
import { searchCities, POPULAR_CITIES } from '../services/openMeteo';

interface CitySearchProps {
  onSelectCity: (city: GeoLocationResult) => void;
  selectedCity: GeoLocationResult | null;
  onUseCurrentLocation: () => void;
  isLocating?: boolean;
}

const RECENT_CITIES_KEY = 'weather_recent_searches';

export const CitySearch: React.FC<CitySearchProps> = ({
  onSelectCity,
  selectedCity,
  onUseCurrentLocation,
  isLocating = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentCities, setRecentCities] = useState<GeoLocationResult[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent cities from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_CITIES_KEY);
      if (stored) {
        setRecentCities(JSON.parse(stored).slice(0, 5));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save to recent cities
  const saveToRecent = (city: GeoLocationResult) => {
    try {
      const updated = [city, ...recentCities.filter((c) => c.id !== city.id)].slice(0, 5);
      setRecentCities(updated);
      localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchCities(query);
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error('Error during geocoding search:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocationResult) => {
    saveToRecent(city);
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < results.length) {
        handleSelect(results[focusedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full" ref={containerRef}>
      {/* Search Input Bar & Geolocation Button */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Search className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <input
            id="city-search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length >= 2 || recentCities.length > 0) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search city, region, or capital worldwide (e.g., Tokyo, Zurich, Vancouver)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm"
          />
          {query && (
            <button
              id="clear-search-btn"
              type="button"
              onClick={clearQuery}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div
              id="city-search-results-dropdown"
              className="absolute z-50 left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto divide-y divide-slate-800"
            >
              {isLoading && results.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Querying Open-Meteo Geocoding API...</span>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="px-3 py-1.5 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Geocoded Results ({results.length})</span>
                    <span>WGS84 Coordinates</span>
                  </div>
                  {results.map((city, idx) => (
                    <button
                      key={`${city.id}-${idx}`}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                        focusedIndex === idx ? 'bg-slate-800 text-white' : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-white flex items-center space-x-2">
                            <span>{city.name}</span>
                            {city.country_code && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                {city.country_code}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
                            {city.admin1 && <span>{city.admin1},</span>}
                            <span>{city.country || 'Unknown'}</span>
                            {city.elevation !== undefined && (
                              <span className="text-slate-500">• {Math.round(city.elevation)}m alt</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono text-cyan-400">
                          {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                        </div>
                        <div className="text-[10px] text-slate-500">{city.timezone}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : query.trim().length >= 2 ? (
                <div className="p-5 text-center text-xs text-slate-400">
                  <p>No matching cities found for &quot;{query}&quot;.</p>
                  <p className="text-slate-500 mt-1">Try checking the spelling or query major administrative regions.</p>
                </div>
              ) : recentCities.length > 0 ? (
                <div>
                  <div className="px-3 py-1.5 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Recent Searches</span>
                  </div>
                  {recentCities.map((city) => (
                    <button
                      key={`recent-${city.id}`}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-slate-800/80 text-slate-300 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm font-medium">{city.name}</span>
                        <span className="text-xs text-slate-500">
                          {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* GPS Geolocation Button */}
        <button
          id="use-current-location-btn"
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 transition-all sm:w-auto w-full flex-shrink-0"
          title="Detect GPS coordinates using browser Geolocation API"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          ) : (
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
        </button>
      </div>

      {/* Quick Select Popular Cities Chips */}
      <div className="mt-3 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 font-medium flex items-center space-x-1 flex-shrink-0">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span>Popular:</span>
        </span>
        <div className="flex items-center space-x-1.5">
          {POPULAR_CITIES.map((city) => {
            const isSelected = selectedCity?.name.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => handleSelect(city)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800'
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
