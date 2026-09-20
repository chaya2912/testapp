/**
 * Typed data interfaces for Weather Intelligence application
 */

export interface GeoLocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // State or province
  admin2?: string;
  timezone: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeoLocationResult[];
  generationtime_ms?: number;
}

export type UnitSystem = 'metric' | 'imperial';

export interface RawForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: Record<string, string>;
  current?: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain?: number;
    showers?: number;
    snowfall?: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m?: number;
  };
  hourly_units?: Record<string, string>;
  hourly?: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    uv_index?: number[];
  };
  daily_units?: Record<string, string>;
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max?: number[];
    apparent_temperature_min?: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max?: number[];
    precipitation_sum: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max: number[];
  };
}

export interface CurrentConditions {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  precipitation: number;
  pressure: number;
  cloudCover: number;
  uvIndex: number;
  lastUpdated: string;
}

export interface HourlyForecastItem {
  time: string;
  formattedTime: string;
  temperature: number;
  precipitationProb: number;
  precipitationAmount: number;
  weatherCode: number;
  windSpeed: number;
  uvIndex: number;
  isCurrentHour: boolean;
}

export interface DailyForecastItem {
  date: string;
  dayOfWeek: string;
  formattedDate: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentMax: number;
  apparentMin: number;
  precipitationProb: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  isToday: boolean;
}

export type ActivitySuitability = 'Optimal' | 'Good' | 'Moderate' | 'Poor';

export interface ActivityRecommendation {
  id: string;
  title: string;
  category: 'fitness' | 'commute' | 'leisure' | 'outdoor';
  score: number; // 0 - 100
  suitability: ActivitySuitability;
  headline: string;
  reasoning: string;
  bestTimeWindow?: string;
  recommendations: string[];
  icon: string;
}

export interface GearRecommendation {
  umbrella: { needed: boolean; reason: string };
  sunglasses: { needed: boolean; reason: string };
  outerwear: { layer: string; reason: string };
  footwear: { advice: string; reason: string };
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'wind' | 'temp' | 'uv' | 'storm';
  severity: 'low' | 'moderate' | 'warning' | 'severe';
  title: string;
  message: string;
  timeWindow?: string;
}

export interface ProcessedWeatherData {
  location: GeoLocationResult;
  current: CurrentConditions;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  activities: ActivityRecommendation[];
  gear: GearRecommendation;
  alerts: WeatherAlert[];
  unitSystem: UnitSystem;
  fetchedAt: number;
  isCached?: boolean;
}
