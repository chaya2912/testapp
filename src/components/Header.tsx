import React, { useState, useEffect, useRef } from 'react';
import {
  CloudSun,
  RefreshCw,
  Clock,
  BookOpen,
  Database,
  Palette,
  Check,
} from 'lucide-react';
import { GeoLocationResult, UnitSystem } from '../types/weather';
import { ThemeId, THEME_OPTIONS } from '../types/theme';

interface HeaderProps {
  location: GeoLocationResult | null;
  unitSystem: UnitSystem;
  onToggleUnit: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isCached?: boolean;
  onOpenDocs: () => void;
  theme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  location,
  unitSystem,
  onToggleUnit,
  onRefresh,
  isLoading,
  isCached = false,
  onOpenDocs,
  theme,
  onSelectTheme,
}) => {
  const [localTime, setLocalTime] = useState<string>('');
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close theme menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!location?.timezone) {
      setLocalTime('');
      return;
    }

    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: location.timezone,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        setLocalTime(formatter.format(now));
      } catch {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [location?.timezone]);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Product Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-900/30 ring-1 ring-cyan-400/30">
            <CloudSun className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">Weather Intelligence</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                PROD
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-400">
              Open-Meteo High-Resolution Atmospheric & Activity Engine
            </p>
          </div>
        </div>

        {/* Location Time & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Timezone Live Clock */}
          {localTime && (
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{localTime}</span>
            </div>
          )}

          {/* Network / Cache Badge */}
          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border bg-slate-900/60 border-slate-800 text-slate-400">
            {isCached ? (
              <>
                <Database className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300">Cached</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400">Live API</span>
              </>
            )}
          </div>

          {/* Theme Selector Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <button
              id="theme-selector-btn"
              type="button"
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner transition-all"
              title="Change Color Theme"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline text-[11px]">
                {THEME_OPTIONS.find((t) => t.id === theme)?.name.split(' ')[1] || 'Theme'}
              </span>
            </button>

            {isThemeOpen && (
              <div
                id="theme-dropdown-menu"
                className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-fadeIn space-y-1 divide-y divide-slate-800"
              >
                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Color Themes
                </div>

                <div className="pt-1 space-y-1">
                  {THEME_OPTIONS.map((opt) => {
                    const isSelected = opt.id === theme;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          onSelectTheme(opt.id);
                          setIsThemeOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-slate-800 text-white font-semibold ring-1 ring-cyan-500/50'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {/* 3-Dot Palette Swatch */}
                          <div className="flex items-center space-x-1 p-1 rounded-md bg-slate-950 border border-slate-800">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: opt.previewColors[0] }}
                            />
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: opt.previewColors[1] }}
                            />
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: opt.previewColors[2] }}
                            />
                          </div>

                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span>{opt.name}</span>
                              {opt.id === 'sapphire' && (
                                <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1">
                              {opt.description}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Unit Toggle */}
          <button
            id="unit-toggle-btn"
            type="button"
            onClick={onToggleUnit}
            className="flex items-center rounded-lg border border-slate-700 bg-slate-900 p-1 text-xs font-semibold shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500"
            title={`Switch to ${unitSystem === 'metric' ? 'Imperial (°F, mph)' : 'Metric (°C, km/h)'}`}
          >
            <span
              className={`px-2 py-1 rounded transition-colors ${
                unitSystem === 'metric'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </span>
            <span
              className={`px-2 py-1 rounded transition-colors ${
                unitSystem === 'imperial'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </span>
          </button>

          {/* Refresh Button */}
          <button
            id="refresh-weather-btn"
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 disabled:opacity-50 transition-all"
            title="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Production Docs / Deployment Button */}
          <button
            id="open-production-docs-btn"
            type="button"
            onClick={onOpenDocs}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-cyan-800/60 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 text-xs font-medium text-cyan-300 hover:border-cyan-600 hover:text-white hover:bg-cyan-900/40 transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Production Docs</span>
            <span className="sm:hidden">Docs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
