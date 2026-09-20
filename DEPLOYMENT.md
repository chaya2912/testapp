# Weather Intelligence App - Production Setup & Deployment Guide

A high-performance, modular Weather Intelligence & Activity Planning application built with React, TypeScript, Tailwind CSS, and Open-Meteo API.

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│  React 19 + TypeScript + Tailwind CSS (Vite Bundler)       │
├───────────────────────────────┬─────────────────────────────┤
│  Component Modularization     │  Engine Utilities           │
│  - CitySearch.tsx             │  - openMeteo.ts (Service)   │
│  - CurrentWeather.tsx         │  - activityEngine.ts        │
│  - HourlyForecast.tsx         │  - weatherCodes.ts          │
│  - DailyForecast.tsx          │                             │
│  - ActivityRecommendations.tsx│                             │
│  - WeatherAlerts.tsx          │                             │
├───────────────────────────────┴─────────────────────────────┤
│                    Resilience & Storage                     │
│  - Exponential Backoff Retries (2x)                         │
│  - Request Timeout via AbortController (8000ms)             │
│  - Two-Tier TTL Caching (15m Forecast / 24h Geocoding)      │
│  - Deterministic Offline Fallback Model                     │
├─────────────────────────────────────────────────────────────┤
│                    Upstream APIs                            │
│  - Open-Meteo Geocoding: /v1/search                         │
│  - Open-Meteo Forecast:  /v1/forecast                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Local Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Steps
1. **Clone repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   The dev server binds to `http://0.0.0.0:3000`.

4. **Verify TypeScript compilation & linting:**
   ```bash
   npm run lint
   ```

5. **Build production bundle:**
   ```bash
   npm run build
   ```

---

## 3. Containerized Deployment (Docker)

### Multi-Stage Build
The included `Dockerfile` uses a 2-stage build:
- **Stage 1 (Builder)**: Compiles the Vite SPA with Node 20 Alpine.
- **Stage 2 (Runtime)**: Minimal Nginx Alpine image with gzip compression and SPA fallback.

### Building & Running with Docker:
```bash
# Build the Docker image
docker build -t weather-intelligence:latest .

# Run the container mapping port 3000
docker run -d \
  -p 3000:3000 \
  --name weather-intelligence \
  --restart unless-stopped \
  weather-intelligence:latest
```

### Running with Docker Compose:
```bash
docker compose up -d --build
```

To stop:
```bash
docker compose down
```

---

## 4. Cloud Deployment

### Google Cloud Run
```bash
# Set project ID
export PROJECT_ID="your-gcp-project-id"

# Submit image build to Google Container Registry / Artifact Registry
gcloud builds submit --tag gcr.io/$PROJECT_ID/weather-intelligence:latest

# Deploy to Cloud Run (ingress port 3000)
gcloud run deploy weather-intelligence \
  --image gcr.io/$PROJECT_ID/weather-intelligence:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

### Vercel / Netlify
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## 5. API Reference & Rate Limits

- **Open-Meteo Geocoding API:** `https://geocoding-api.open-meteo.com/v1/search`
- **Open-Meteo Forecast API:** `https://api.open-meteo.com/v1/forecast`
- **Authentication:** No API key required for standard non-commercial tiers (up to 10,000 calls/day free).
- **CORS:** Enabled by default by Open-Meteo for client-side web applications.

---

## 6. Resilience & Reliability Features

1. **Timeout Handling**: Built-in 8-second request abortion to prevent network hang.
2. **Exponential Backoff**: Automated retry on transient 5xx errors or network drops.
3. **Storage Caching**: LocalStorage TTL caching prevents redundant API consumption.
4. **Offline Mode**: Deterministic baseline generation prevents runtime crashes during upstream network failure.
