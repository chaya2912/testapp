export interface WeatherInterpretation {
  code: number;
  description: string;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudLightning' | 'CloudSnow' | 'Snowflake';
  isPrecipitation: boolean;
  isSnow: boolean;
  isSevere: boolean;
  bannerGradient: string;
}

export const WMO_WEATHER_MAP: Record<number, WeatherInterpretation> = {
  0: {
    code: 0,
    description: 'Clear Sky',
    iconName: 'Sun',
    isPrecipitation: false,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-amber-500/20 via-sky-500/10 to-transparent',
  },
  1: {
    code: 1,
    description: 'Mainly Clear',
    iconName: 'CloudSun',
    isPrecipitation: false,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-sky-500/20 via-amber-500/10 to-transparent',
  },
  2: {
    code: 2,
    description: 'Partly Cloudy',
    iconName: 'CloudSun',
    isPrecipitation: false,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-blue-500/20 via-slate-500/10 to-transparent',
  },
  3: {
    code: 3,
    description: 'Overcast',
    iconName: 'Cloud',
    isPrecipitation: false,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-slate-600/30 via-slate-800/20 to-transparent',
  },
  45: {
    code: 45,
    description: 'Fog',
    iconName: 'CloudFog',
    isPrecipitation: false,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-zinc-500/30 via-slate-700/20 to-transparent',
  },
  48: {
    code: 48,
    description: 'Depositing Rime Fog',
    iconName: 'CloudFog',
    isPrecipitation: false,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-cyan-900/30 via-slate-800/20 to-transparent',
  },
  51: {
    code: 51,
    description: 'Light Drizzle',
    iconName: 'CloudDrizzle',
    isPrecipitation: true,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-sky-600/25 via-blue-900/20 to-transparent',
  },
  53: {
    code: 53,
    description: 'Moderate Drizzle',
    iconName: 'CloudDrizzle',
    isPrecipitation: true,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-sky-700/30 via-blue-900/20 to-transparent',
  },
  55: {
    code: 55,
    description: 'Dense Drizzle',
    iconName: 'CloudDrizzle',
    isPrecipitation: true,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-blue-700/35 via-slate-800/20 to-transparent',
  },
  56: {
    code: 56,
    description: 'Freezing Drizzle',
    iconName: 'CloudSnow',
    isPrecipitation: true,
    isSnow: true,
    isSevere: false,
    bannerGradient: 'from-cyan-600/30 via-blue-900/20 to-transparent',
  },
  57: {
    code: 57,
    description: 'Dense Freezing Drizzle',
    iconName: 'CloudSnow',
    isPrecipitation: true,
    isSnow: true,
    isSevere: true,
    bannerGradient: 'from-cyan-700/35 via-blue-950/20 to-transparent',
  },
  61: {
    code: 61,
    description: 'Slight Rain',
    iconName: 'CloudRain',
    isPrecipitation: true,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-blue-600/25 via-indigo-900/20 to-transparent',
  },
  63: {
    code: 63,
    description: 'Moderate Rain',
    iconName: 'CloudRain',
    isPrecipitation: true,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-blue-700/35 via-indigo-950/25 to-transparent',
  },
  65: {
    code: 65,
    description: 'Heavy Rain',
    iconName: 'CloudRain',
    isPrecipitation: true,
    isSnow: false,
    isSevere: true,
    bannerGradient: 'from-blue-800/40 via-sky-950/30 to-transparent',
  },
  66: {
    code: 66,
    description: 'Freezing Rain',
    iconName: 'CloudSnow',
    isPrecipitation: true,
    isSnow: true,
    isSevere: true,
    bannerGradient: 'from-cyan-700/30 via-slate-900/25 to-transparent',
  },
  67: {
    code: 67,
    description: 'Heavy Freezing Rain',
    iconName: 'CloudSnow',
    isPrecipitation: true,
    isSnow: true,
    isSevere: true,
    bannerGradient: 'from-cyan-800/40 via-blue-950/30 to-transparent',
  },
  71: {
    code: 71,
    description: 'Slight Snowfall',
    iconName: 'CloudSnow',
    isPrecipitation: true,
    isSnow: true,
    isSevere: false,
    bannerGradient: 'from-indigo-400/20 via-slate-800/20 to-transparent',
  },
  73: {
    code: 73,
    description: 'Moderate Snowfall',
    iconName: 'Snowflake',
    isPrecipitation: true,
    isSnow: true,
    isSevere: false,
    bannerGradient: 'from-sky-300/25 via-slate-800/20 to-transparent',
  },
  75: {
    code: 75,
    description: 'Heavy Snowfall',
    iconName: 'Snowflake',
    isPrecipitation: true,
    isSnow: true,
    isSevere: true,
    bannerGradient: 'from-blue-300/30 via-slate-800/20 to-transparent',
  },
  77: {
    code: 77,
    description: 'Snow Grains',
    iconName: 'Snowflake',
    isPrecipitation: true,
    isSnow: true,
    isSevere: false,
    bannerGradient: 'from-cyan-400/20 via-slate-800/20 to-transparent',
  },
  80: {
    code: 80,
    description: 'Slight Rain Showers',
    iconName: 'CloudRain',
    isPrecipitation: true,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-blue-600/30 via-slate-800/20 to-transparent',
  },
  81: {
    code: 81,
    description: 'Moderate Rain Showers',
    iconName: 'CloudRain',
    isPrecipitation: true,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-blue-700/35 via-slate-800/20 to-transparent',
  },
  82: {
    code: 82,
    description: 'Violent Rain Showers',
    iconName: 'CloudRain',
    isPrecipitation: true,
    isSnow: false,
    isSevere: true,
    bannerGradient: 'from-indigo-800/40 via-slate-900/30 to-transparent',
  },
  85: {
    code: 85,
    description: 'Slight Snow Showers',
    iconName: 'CloudSnow',
    isPrecipitation: true,
    isSnow: true,
    isSevere: false,
    bannerGradient: 'from-sky-400/25 via-slate-800/20 to-transparent',
  },
  86: {
    code: 86,
    description: 'Heavy Snow Showers',
    iconName: 'Snowflake',
    isPrecipitation: true,
    isSnow: true,
    isSevere: true,
    bannerGradient: 'from-blue-400/35 via-slate-800/20 to-transparent',
  },
  95: {
    code: 95,
    description: 'Thunderstorm',
    iconName: 'CloudLightning',
    isPrecipitation: true,
    isSnow: false,
    isSevere: true,
    bannerGradient: 'from-amber-600/30 via-purple-950/40 to-transparent',
  },
  96: {
    code: 96,
    description: 'Thunderstorm with Slight Hail',
    iconName: 'CloudLightning',
    isPrecipitation: true,
    isSnow: true,
    isSevere: true,
    bannerGradient: 'from-yellow-600/35 via-purple-950/45 to-transparent',
  },
  99: {
    code: 99,
    description: 'Thunderstorm with Heavy Hail',
    iconName: 'CloudLightning',
    isPrecipitation: true,
    isSnow: true,
    isSevere: true,
    bannerGradient: 'from-red-600/40 via-purple-950/50 to-transparent',
  },
};

export function getWeatherInfo(code: number): WeatherInterpretation {
  if (code in WMO_WEATHER_MAP) {
    return WMO_WEATHER_MAP[code];
  }
  return {
    code,
    description: 'Unknown Conditions',
    iconName: 'CloudSun',
    isPrecipitation: false,
    isSnow: false,
    isSevere: false,
    bannerGradient: 'from-slate-700/20 to-transparent',
  };
}

export function formatTemp(tempC: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    const tempF = Math.round((tempC * 9) / 5 + 32);
    return `${tempF}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

export function formatSpeed(speedKmh: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    const speedMph = Math.round(speedKmh * 0.621371);
    return `${speedMph} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

export function formatPrecip(precipMm: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    const precipIn = (precipMm * 0.0393701).toFixed(2);
    return `${precipIn} in`;
  }
  return `${precipMm.toFixed(1)} mm`;
}

export function getWindDirectionCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
