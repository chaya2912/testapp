import {
  CurrentConditions,
  HourlyForecastItem,
  DailyForecastItem,
  ActivityRecommendation,
  GearRecommendation,
  WeatherAlert,
} from '../types/weather';

export function generateActivityRecommendations(
  current: CurrentConditions,
  hourly: HourlyForecastItem[],
  daily: DailyForecastItem[]
): ActivityRecommendation[] {
  const activities: ActivityRecommendation[] = [];

  // Find best daylight hours today from hourly forecast (next 18 hours)
  const nextHours = hourly.slice(0, 18);

  // 1. Running & Jogging Suitability
  let runningScore = 100;
  const runningReasons: string[] = [];

  // Temperature factor (Ideal: 10°C to 18°C)
  if (current.temperature > 28) {
    const penalty = Math.min(45, (current.temperature - 28) * 4);
    runningScore -= penalty;
    runningReasons.push(`High temperature (${Math.round(current.temperature)}°C) increases dehydration & cardiac load`);
  } else if (current.temperature > 22) {
    runningScore -= 15;
    runningReasons.push('Warm conditions require extra hydration pacing');
  } else if (current.temperature < 0) {
    runningScore -= 35;
    runningReasons.push('Sub-zero freezing temps may cause icy pavement and airway strain');
  } else if (current.temperature < 7) {
    runningScore -= 12;
    runningReasons.push('Chilly temperatures; warm thermal layers recommended');
  } else {
    runningReasons.push('Temperature is in the optimal performance sweet-spot');
  }

  // Precipitation factor
  if (current.precipitation > 2) {
    runningScore -= 45;
    runningReasons.push('Active heavy rainfall reduces traction and comfort');
  } else if (current.precipitation > 0) {
    runningScore -= 25;
    runningReasons.push('Light precipitation present; damp running surface');
  } else {
    const upcomingRain = nextHours.slice(0, 4).some(h => h.precipitationProb > 40);
    if (upcomingRain) {
      runningScore -= 15;
      runningReasons.push('Rain probability increases within the next 3-4 hours');
    }
  }

  // Wind factor
  if (current.windSpeed > 35) {
    runningScore -= 30;
    runningReasons.push(`Strong headwinds of ${Math.round(current.windSpeed)} km/h will significantly impede pace`);
  } else if (current.windSpeed > 20) {
    runningScore -= 10;
    runningReasons.push('Moderate breeze detectable during open runs');
  }

  // Humidity & Heat Index
  if (current.relativeHumidity > 80 && current.temperature > 22) {
    runningScore -= 15;
    runningReasons.push('High humidity impairs sweat evaporation efficiency');
  }

  runningScore = Math.max(10, Math.min(98, Math.round(runningScore)));

  // Determine best window for running
  let bestRunningHour = nextHours[0];
  let lowestPenalty = 999;
  for (const h of nextHours) {
    const tempDiff = Math.abs(h.temperature - 14);
    const penalty = tempDiff + (h.precipitationProb * 0.5) + (h.windSpeed * 0.3);
    if (penalty < lowestPenalty) {
      lowestPenalty = penalty;
      bestRunningHour = h;
    }
  }

  activities.push({
    id: 'running',
    title: 'Running & Cardio',
    category: 'fitness',
    score: runningScore,
    suitability: runningScore >= 80 ? 'Optimal' : runningScore >= 60 ? 'Good' : runningScore >= 40 ? 'Moderate' : 'Poor',
    headline: runningScore >= 80
      ? 'Exceptional conditions for road or trail running'
      : runningScore >= 60
      ? 'Favorable conditions with minor pacing adjustments'
      : runningScore >= 40
      ? 'Sub-optimal; prepare for challenging elements'
      : 'Indoor cardio or treadmill strongly recommended',
    reasoning: runningReasons.join('. ') + '.',
    bestTimeWindow: bestRunningHour ? `Prime window around ${bestRunningHour.formattedTime} (${Math.round(bestRunningHour.temperature)}°C, ${bestRunningHour.precipitationProb}% rain)` : undefined,
    recommendations: [
      runningScore >= 70 ? 'Target tempo runs or long intervals' : 'Focus on easy zone 2 pacing or indoor alternative',
      current.temperature > 20 ? 'Carry handheld hydration or electrolyte tabs' : 'Layer light windbreaker or moisture-wicking beanie',
      current.precipitation > 0 ? 'Wear high-traction trail lugs to prevent slippage' : 'Normal road running shoes suitable',
    ],
    icon: 'Footprints',
  });

  // 2. Cycling & Commuting Suitability
  let cyclingScore = 100;
  const cyclingReasons: string[] = [];

  if (current.windGusts > 45 || current.windSpeed > 35) {
    cyclingScore -= 50;
    cyclingReasons.push(`Hazardous gusts up to ${Math.round(current.windGusts || current.windSpeed)} km/h compromise bicycle stability`);
  } else if (current.windSpeed > 22) {
    cyclingScore -= 20;
    cyclingReasons.push('Noticeable aerodynamic resistance and gust buffeting');
  }

  if (current.precipitation > 1) {
    cyclingScore -= 45;
    cyclingReasons.push('Wet asphalt severely reduces rim & disc brake stopping distances');
  } else if (current.precipitation > 0) {
    cyclingScore -= 25;
    cyclingReasons.push('Damp pavement; corner with conservative lean angles');
  }

  if (current.temperature < 3) {
    cyclingScore -= 30;
    cyclingReasons.push('Windchill drops perceived temperature below freezing on downhill sections');
  } else if (current.temperature > 30) {
    cyclingScore -= 25;
    cyclingReasons.push('High radiant heat increases asphalt reflection and tire friction');
  }

  cyclingScore = Math.max(10, Math.min(98, Math.round(cyclingScore)));

  activities.push({
    id: 'cycling',
    title: 'Cycling & Commuting',
    category: 'commute',
    score: cyclingScore,
    suitability: cyclingScore >= 80 ? 'Optimal' : cyclingScore >= 60 ? 'Good' : cyclingScore >= 40 ? 'Moderate' : 'Poor',
    headline: cyclingScore >= 80
      ? 'Clean roads, minimal wind resistance, smooth cruising'
      : cyclingScore >= 60
      ? 'Good rideable conditions; maintain vigilance'
      : cyclingScore >= 40
      ? 'Breezy or damp surfaces; reduce descending speeds'
      : 'Caution advised; consider public transit or indoor trainer',
    reasoning: cyclingReasons.length > 0 ? cyclingReasons.join('. ') + '.' : 'Clear visibility, moderate breeze, and dry road surfaces.',
    recommendations: [
      current.windSpeed > 20 ? 'Plan your route downwind on the return leg' : 'Standard route selection is clear',
      current.precipitation > 0 ? 'Engage daylight strobe lights and clip-on mudguards' : 'Standard daytime headlights recommended',
      'Verify tire pressure before rolling out',
    ],
    icon: 'Bike',
  });

  // 3. Outdoor Dining & Social Gathering
  let diningScore = 100;
  const diningReasons: string[] = [];

  if (current.precipitation > 0) {
    diningScore -= 60;
    diningReasons.push('Precipitation requires covered patio or indoor seating');
  } else {
    const rainUpcoming = nextHours.slice(0, 3).some(h => h.precipitationProb > 40);
    if (rainUpcoming) {
      diningScore -= 30;
      diningReasons.push('Rain threat within 3 hours suggests covered or flexible seating');
    }
  }

  if (current.temperature < 14) {
    diningScore -= 35;
    diningReasons.push(`Brisk air (${Math.round(current.temperature)}°C) requires patio heat lamps or coats`);
  } else if (current.temperature > 32) {
    diningScore -= 35;
    diningReasons.push('Intense warmth makes direct unshaded dining uncomfortable');
  } else if (current.temperature >= 19 && current.temperature <= 26) {
    diningReasons.push('Balmy, pleasant ambient temperature');
  }

  if (current.windSpeed > 25) {
    diningScore -= 25;
    diningReasons.push('Gusty breeze will blow napkins and lightweight tableware');
  }

  diningScore = Math.max(10, Math.min(98, Math.round(diningScore)));

  activities.push({
    id: 'dining',
    title: 'Outdoor Dining & Patio',
    category: 'leisure',
    score: diningScore,
    suitability: diningScore >= 80 ? 'Optimal' : diningScore >= 60 ? 'Good' : diningScore >= 40 ? 'Moderate' : 'Poor',
    headline: diningScore >= 80
      ? 'Ideal alfresco dining & open-air patio weather'
      : diningScore >= 60
      ? 'Pleasant outdoors; bring a light cardigan or windbreak'
      : diningScore >= 40
      ? 'Chilly or breezy; seek heated patios with canopy'
      : 'Indoor dining strongly recommended today',
    reasoning: diningReasons.length > 0 ? diningReasons.join('. ') + '.' : 'Comfortable ambient temperature and gentle breeze.',
    recommendations: [
      current.temperature < 18 ? 'Request seating near outdoor radiant heaters' : 'Opt for open terrace seating',
      current.windSpeed > 20 ? 'Choose sheltered courtyard over high-elevation balconies' : 'Great patio ambiance',
    ],
    icon: 'Utensils',
  });

  // 4. Hiking & Trail Walking
  let hikingScore = 100;
  const hikingReasons: string[] = [];

  if (current.weatherCode >= 95) {
    hikingScore = 10;
    hikingReasons.push('Active thunderstorm risk: severe lightning hazard on elevated ridges');
  } else if (current.precipitation > 2) {
    hikingScore -= 50;
    hikingReasons.push('Muddy trails, slippery roots, and degraded visibility');
  } else if (current.precipitation > 0) {
    hikingScore -= 25;
    hikingReasons.push('Damp ground; caution on granite and steep inclines');
  }

  if (current.temperature > 30) {
    hikingScore -= 30;
    hikingReasons.push('Exposed sunny trails carry high hyperthermia risk');
  } else if (current.temperature < 2) {
    hikingScore -= 25;
    hikingReasons.push('Frost or ice on northern shaded slopes');
  }

  if (current.uvIndex >= 7) {
    hikingReasons.push(`Very High UV Index (${current.uvIndex}): sunscreen and wide-brim hat mandatory`);
  }

  hikingScore = Math.max(10, Math.min(98, Math.round(hikingScore)));

  activities.push({
    id: 'hiking',
    title: 'Hiking & Nature Walks',
    category: 'outdoor',
    score: hikingScore,
    suitability: hikingScore >= 80 ? 'Optimal' : hikingScore >= 60 ? 'Good' : hikingScore >= 40 ? 'Moderate' : 'Poor',
    headline: hikingScore >= 80
      ? 'Crisp trail conditions and clear scenic visibility'
      : hikingScore >= 60
      ? 'Great for low to moderate elevation trails'
      : hikingScore >= 40
      ? 'Prepare for wet footholds and variable conditions'
      : 'Postpone mountain ridge excursions for clearer skies',
    reasoning: hikingReasons.length > 0 ? hikingReasons.join('. ') + '.' : 'Dry trails, comfortable hiking climate, and clear sightlines.',
    recommendations: [
      current.precipitation > 0 ? 'Waterproof Gore-Tex boots with aggressive ankle support' : 'Breathable trail runners',
      'Pack at least 1.5L of water and high-energy trail mix',
      current.uvIndex >= 5 ? 'Reapply SPF 30+ every 2 hours on exposed skin' : 'Standard sun protection',
    ],
    icon: 'Compass',
  });

  return activities;
}

export function generateGearAdvisory(
  current: CurrentConditions,
  hourly: HourlyForecastItem[]
): GearRecommendation {
  const next8Hours = hourly.slice(0, 8);
  const rainLikely = current.precipitation > 0 || next8Hours.some(h => h.precipitationProb >= 35 || h.precipitationAmount > 0.5);

  const umbrella = {
    needed: rainLikely,
    reason: current.precipitation > 0
      ? 'Active rainfall occurring right now'
      : rainLikely
      ? 'Rain probability peaks above 35% in upcoming hours'
      : 'Dry forecast ahead; no umbrella needed today',
  };

  const sunglasses = {
    needed: current.isDay && (current.uvIndex >= 3 || current.cloudCover < 50),
    reason: current.uvIndex >= 3
      ? `UV Index is elevated at ${current.uvIndex}`
      : current.cloudCover < 40 && current.isDay
      ? 'Direct unobstructed sunlight during daytime'
      : 'Low UV and overcast skies; optional',
  };

  let layer = 'Light T-Shirt & Shorts';
  let layerReason = 'Warm and pleasant conditions';

  if (current.apparentTemperature < 0) {
    layer = 'Heavy Insulated Parka, Gloves & Thermal Base';
    layerReason = `Sub-zero wind chill feels like ${Math.round(current.apparentTemperature)}°C`;
  } else if (current.apparentTemperature < 8) {
    layer = 'Winter Coat, Scarf & Knit Beanie';
    layerReason = `Cold ambient conditions feeling like ${Math.round(current.apparentTemperature)}°C`;
  } else if (current.apparentTemperature < 15) {
    layer = 'Fleece Midlayer or Trench Coat';
    layerReason = 'Chilly breeze; comfortable with a reliable outer shell';
  } else if (current.apparentTemperature < 21) {
    layer = 'Long-Sleeve Shirt or Light Cardigan';
    layerReason = 'Mild conditions; comfortable for light layering';
  } else if (current.apparentTemperature > 30) {
    layer = 'Ultralight Breathable Linen or Activewear';
    layerReason = `High heat index feels like ${Math.round(current.apparentTemperature)}°C`;
  }

  let footwearAdvice = 'Standard breathable sneakers or casual shoes';
  let footwearReason = 'Dry pavements and sidewalks';

  if (current.weatherCode >= 71 && current.weatherCode <= 86) {
    footwearAdvice = 'Insulated waterproof winter snow boots';
    footwearReason = 'Snow accumulation and freezing slush on sidewalks';
  } else if (rainLikely) {
    footwearAdvice = 'Waterproof shoes or boots with tread grip';
    footwearReason = 'Puddles and slippery smooth floor entrances';
  }

  return {
    umbrella,
    sunglasses,
    outerwear: { layer, reason: layerReason },
    footwear: { advice: footwearAdvice, reason: footwearReason },
  };
}

export function evaluateWeatherAlerts(
  current: CurrentConditions,
  hourly: HourlyForecastItem[],
  daily: DailyForecastItem[]
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  // Severe Thunderstorm Alert
  if (current.weatherCode >= 95) {
    alerts.push({
      id: 'storm-alert',
      type: 'storm',
      severity: 'severe',
      title: 'Severe Thunderstorm Advisory',
      message: 'Active convective storm cells in the vicinity. Lightning hazard present; seek indoor shelter immediately.',
    });
  }

  // Heavy Rain / Flood Risk
  if (current.precipitation >= 5 || (daily[0] && daily[0].precipitationSum >= 20)) {
    alerts.push({
      id: 'heavy-rain',
      type: 'rain',
      severity: 'warning',
      title: 'Heavy Rainfall Advisory',
      message: `Intense precipitation rate (${current.precipitation} mm/h). Expect street water accumulation and reduced road visibility.`,
    });
  } else if (hourly.slice(0, 4).some(h => h.precipitationProb >= 70)) {
    alerts.push({
      id: 'incoming-rain',
      type: 'rain',
      severity: 'moderate',
      title: 'High Rain Likelihood Imminent',
      message: 'Rain likelihood exceeds 70% in the immediate 2 to 4-hour window.',
    });
  }

  // High Wind Warning
  if (current.windGusts >= 55 || current.windSpeed >= 45) {
    alerts.push({
      id: 'high-wind-severe',
      type: 'wind',
      severity: 'warning',
      title: 'High Wind Warning',
      message: `Sustained winds at ${Math.round(current.windSpeed)} km/h with gusts exceeding ${Math.round(current.windGusts)} km/h. Secure loose outdoor furniture.`,
    });
  } else if (current.windSpeed >= 32) {
    alerts.push({
      id: 'wind-breezy',
      type: 'wind',
      severity: 'moderate',
      title: 'Elevated Wind Conditions',
      message: `Gusty conditions (${Math.round(current.windSpeed)} km/h) affecting high-profile vehicles and cycling.`,
    });
  }

  // Extreme Temperature Alerts
  if (current.temperature >= 35) {
    alerts.push({
      id: 'extreme-heat',
      type: 'temp',
      severity: 'warning',
      title: 'Excessive Heat Advisory',
      message: `Temperature has reached ${Math.round(current.temperature)}°C. Limit prolonged outdoor exposure and hydrate frequently.`,
    });
  } else if (current.temperature <= -5) {
    alerts.push({
      id: 'extreme-freeze',
      type: 'temp',
      severity: 'warning',
      title: 'Hard Freeze Warning',
      message: `Dangerous cold of ${Math.round(current.temperature)}°C. Frostbite risk on exposed skin within 30 minutes. Protect plumbing & pets.`,
    });
  }

  // Extreme UV Alert
  if (current.uvIndex >= 8 && current.isDay) {
    alerts.push({
      id: 'extreme-uv',
      type: 'uv',
      severity: 'moderate',
      title: 'Very High UV Radiation Alert',
      message: `UV Index is ${current.uvIndex}. Unprotected skin can burn rapidly in under 15 minutes. Wear SPF 50+ and UV-blocking eyewear.`,
    });
  }

  return alerts;
}
