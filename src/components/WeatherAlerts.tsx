import React from 'react';
import { AlertTriangle, CloudRain, Wind, Thermometer, ShieldAlert, SunMedium } from 'lucide-react';
import { WeatherAlert } from '../types/weather';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const getAlertIcon = (type: WeatherAlert['type']) => {
    switch (type) {
      case 'storm':
        return <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-sky-400 flex-shrink-0" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-teal-400 flex-shrink-0" />;
      case 'temp':
        return <Thermometer className="w-5 h-5 text-rose-400 flex-shrink-0" />;
      case 'uv':
        return <SunMedium className="w-5 h-5 text-amber-400 flex-shrink-0" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />;
    }
  };

  const getAlertStyles = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'severe':
        return 'bg-rose-950/40 border-rose-600/60 text-rose-200';
      case 'warning':
        return 'bg-amber-950/40 border-amber-600/60 text-amber-200';
      case 'moderate':
        return 'bg-sky-950/40 border-sky-600/50 text-sky-200';
      default:
        return 'bg-slate-900/60 border-slate-700 text-slate-300';
    }
  };

  const getBadgeStyle = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'severe':
        return 'bg-rose-900/80 text-rose-300 border-rose-700';
      case 'warning':
        return 'bg-amber-900/80 text-amber-300 border-amber-700';
      case 'moderate':
        return 'bg-sky-900/80 text-sky-300 border-sky-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-2.5 my-4" id="weather-alerts-container">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start justify-between p-3.5 rounded-xl border backdrop-blur-sm shadow-sm transition-all ${getAlertStyles(
            alert.severity
          )}`}
        >
          <div className="flex items-start space-x-3">
            {getAlertIcon(alert.type)}
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold tracking-tight">{alert.title}</h4>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyle(
                    alert.severity
                  )}`}
                >
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-300 leading-relaxed">{alert.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
