import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Snowflake,
  HelpCircle,
} from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
  animated?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  className = 'w-6 h-6',
  size,
  animated = true,
}) => {
  const info = getWeatherInfo(code);

  const iconProps = {
    className,
    size,
  };

  const anim = (animClass: string) => (animated ? animClass : '');

  switch (info.iconName) {
    case 'Sun':
      return isDay ? (
        <Sun
          {...iconProps}
          className={`${className} text-amber-400 ${anim('weather-anim-sun')}`}
        />
      ) : (
        <Moon
          {...iconProps}
          className={`${className} text-indigo-200 ${anim('weather-anim-moon')}`}
        />
      );
    case 'CloudSun':
      return isDay ? (
        <CloudSun
          {...iconProps}
          className={`${className} text-amber-300 ${anim('weather-anim-cloud-sun')}`}
        />
      ) : (
        <CloudMoon
          {...iconProps}
          className={`${className} text-indigo-300 ${anim('weather-anim-cloud-sun')}`}
        />
      );
    case 'Cloud':
      return (
        <Cloud
          {...iconProps}
          className={`${className} text-slate-300 ${anim('weather-anim-cloud')}`}
        />
      );
    case 'CloudFog':
      return (
        <CloudFog
          {...iconProps}
          className={`${className} text-zinc-300 ${anim('weather-anim-fog')}`}
        />
      );
    case 'CloudDrizzle':
      return (
        <CloudDrizzle
          {...iconProps}
          className={`${className} text-sky-400 ${anim('weather-anim-drizzle')}`}
        />
      );
    case 'CloudRain':
      return (
        <CloudRain
          {...iconProps}
          className={`${className} text-blue-400 ${anim('weather-anim-rain')}`}
        />
      );
    case 'CloudLightning':
      return (
        <CloudLightning
          {...iconProps}
          className={`${className} text-amber-400 ${anim('weather-anim-lightning')}`}
        />
      );
    case 'CloudSnow':
      return (
        <CloudSnow
          {...iconProps}
          className={`${className} text-cyan-200 ${anim('weather-anim-snow')}`}
        />
      );
    case 'Snowflake':
      return (
        <Snowflake
          {...iconProps}
          className={`${className} text-cyan-100 ${anim('weather-anim-snowflake')}`}
        />
      );
    default:
      return <HelpCircle {...iconProps} className={`${className} text-slate-400`} />;
  }
};
