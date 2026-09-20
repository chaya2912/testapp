# Weather Intelligence & Activity Planner

An enterprise-grade, high-performance Weather Intelligence and Activity Recommendation web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and the **Open-Meteo High-Resolution Atmospheric APIs**.

Designed with deep cosmic themes, subtle keyframe atmospheric animations, an activity suitability scoring engine, and robust network resilience patterns.

---

## 🌟 Key Features

- 🛰️ **Global City Search & GPS Geolocation**: Real-time debounced location search with coordinate resolution (latitude, longitude, elevation, timezone), browser GPS detection, recent search history, and international quick-select city chips.
- 🌦️ **High-Resolution Atmospheric Telemetry**: Real-time observations including ambient and apparent temperature, relative humidity, wind speed, gusts, 16-point compass heading, barometric pressure, UV index, and precipitation rate.
- 🕒 **24-Hour Scrubber & 7-Day Synoptic Forecast**: Interactive hourly carousel with dynamic solar/lunar condition icons and 7-day outlook featuring WMO weather condition icons and relative temperature spectrum bars.
- 🏃 **Algorithmic Activity Suitability Engine**: Real-time scoring (0–100%) and condition breakdowns for:
  - **Running & Cardio**: Thermal load, humidity index, wind drag, and prime hourly running window detection.
  - **Cycling & Commuting**: Pavement traction, braking distance, and crosswind gust stability.
  - **Outdoor Dining & Patio**: Ambient comfort, patio heating requirements, and wind disturbance.
  - **Hiking & Trail Walking**: Mud/slip risk, elevated lightning danger, and UV exposure.
  - **Gear & Attire Advisory**: Contextual recommendations for umbrellas, eyewear, thermal layering, and footwear.
- ⚠️ **Severe Atmospheric Alert System**: Automated alert banners for convective thunderstorms, gale-force winds, torrential rain, and extreme temperature conditions.
- 🎨 **Dynamic Atmospheric Color Themes**: 5 switchable visual palettes with instant persistence:
  - **Midnight Sapphire** (Default cosmic navy and royal azure)
  - **Emerald Aurora** (Boreal obsidian and glowing arctic mint)
  - **Cosmic Twilight** (Starlit purple and amethyst glow)
  - **Solar Ember** (Espresso onyx and golden sunset amber)
  - **Nordic Slate** (Classic high-contrast dark slate)
- ✨ **Micro-Interactions & Animated Weather Icons**: Subtle CSS keyframe animations (sun rotations, moon sways, precipitation drifts, and thunderstorm flashes) with `prefers-reduced-motion` accessibility support.
- 🛡️ **Production Network Resilience**:
  - `AbortController` timeout protection (8000ms).
  - Automated exponential backoff retries on transient network failures.
  - Two-tier `localStorage` TTL caching (15m forecasts / 24h geocoding) to conserve bandwidth.
  - Deterministic offline fallback engine for zero-crash degradation.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  React 19 + TypeScript + Tailwind CSS (Vite Bundler)        │
├───────────────────────────────┬─────────────────────────────┤
│  Component Architecture       │  Engines & Services         │
│  - CitySearch.tsx             │  - openMeteo.ts (Client)    │
│  - CurrentWeather.tsx         │  - activityEngine.ts        │
│  - HourlyForecast.tsx         │  - weatherCodes.ts          │
│  - DailyForecast.tsx          │  - theme.ts                 │
│  - ActivityRecommendations.tsx│                             │
│  - WeatherAlerts.tsx          │                             │
│  - WeatherIcon.tsx            │                             │
├───────────────────────────────┴─────────────────────────────┤
│                   Resilience & State                        │
│  - Exponential Backoff Retries (2x)                         │
│  - AbortController Timeout Guard (8000ms)                   │
│  - Two-Tier TTL Caching (15m Forecast / 24h Geocoding)      │
│  - Deterministic Offline Fallback Baseline                  │
├─────────────────────────────────────────────────────────────┤
│                    Upstream APIs                            │
│  - Open-Meteo Geocoding: https://geocoding-api.open-meteo.com │
│  - Open-Meteo Forecast:  https://api.open-meteo.com/v1      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [npm](https://www.npmjs.com/) `>= 9.0.0` (or `bun` / `pnpm` / `yarn`)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/weather-intelligence.git
   cd weather-intelligence
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server bound to `0.0.0.0:3000` |
| `npm run build` | Compiles TypeScript and packages production assets into `dist/` |
| `npm run preview` | Previews the compiled production build locally |
| `npm run lint` | Runs TypeScript compiler checks without emitting files (`tsc --noEmit`) |
| `npm run clean` | Cleans up the `dist` build directory |

---

## 🐳 Docker & Container Deployment

### Running with Docker Compose (Recommended)

```bash
docker compose up -d --build
```
The application will be live at `http://localhost:3000`.

To stop the container:
```bash
docker compose down
```

### Manual Docker Build

```bash
# Build the multi-stage image
docker build -t weather-intelligence:latest .

# Run container on port 3000
docker run -d \
  -p 3000:3000 \
  --name weather-intelligence \
  --restart unless-stopped \
  weather-intelligence:latest
```

---

## ☁️ Cloud Deployment

### Google Cloud Run
```bash
export PROJECT_ID="your-google-cloud-project-id"

# Build image with Cloud Build
gcloud builds submit --tag gcr.io/$PROJECT_ID/weather-intelligence:latest

# Deploy to Cloud Run
gcloud run deploy weather-intelligence \
  --image gcr.io/$PROJECT_ID/weather-intelligence:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

### Vercel / Netlify / Cloudflare Pages
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## 📡 Upstream APIs & Data Sources

This application uses the open-access [Open-Meteo API](https://open-meteo.com/):
- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search`
- **Forecast API**: `https://api.open-meteo.com/v1/forecast`
- *No API key required for non-commercial use (up to 10,000 daily calls free).*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
