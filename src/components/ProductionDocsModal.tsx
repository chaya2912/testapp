import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Server,
  Terminal,
  FileCode,
  ShieldCheck,
  Layers,
  Container,
  Cpu,
  Download,
} from 'lucide-react';

interface ProductionDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductionDocsModal: React.FC<ProductionDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'docker' | 'deployment' | 'resilience' | 'env'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const dockerfileSnippet = `# Multi-stage production build for Weather Intelligence App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Compile production Vite bundle
RUN npm run build

# Production static serving stage via Nginx Alpine
FROM nginx:alpine-slim

# Copy compiled SPA assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy optimized Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose container application port
EXPOSE 3000

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]`;

  const dockerComposeSnippet = `version: '3.8'

services:
  weather-intelligence:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: weather_intelligence_app
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/"]
      interval: 30s
      timeout: 5s
      retries: 3`;

  const nginxConfSnippet = `server {
    listen 3000;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression for high performance
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA history API routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Production Repository & Architecture Documentation
              </h3>
              <p className="text-xs text-slate-400">
                Deployment guides, Docker configurations, resilience models & repository architecture
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 px-6 border-b border-slate-800 bg-slate-950/30 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'architecture', label: 'Architecture & Hierarchy', icon: Layers },
            { id: 'docker', label: 'Docker & Compose', icon: Container },
            { id: 'deployment', label: 'Deployment Commands', icon: Terminal },
            { id: 'resilience', label: 'Network Resilience & Cache', icon: ShieldCheck },
            { id: 'env', label: 'Environment & Config', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  1. Modular Software Repository Architecture
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Refactored into a high-cohesion, low-coupling architecture separating API ingestion, atmospheric models, activity planning algorithms, and presentation components.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-bold text-cyan-400 mb-1 flex items-center">
                    <Cpu className="w-4 h-4 mr-1.5" /> /src/services/openMeteo.ts
                  </div>
                  <p className="text-slate-400">
                    Network abstraction layer managing Geocoding (/v1/search) and Forecast (/v1/forecast) APIs with exponential backoff retries, request timeouts, and localStorage TTL caching.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-bold text-emerald-400 mb-1 flex items-center">
                    <Layers className="w-4 h-4 mr-1.5" /> /src/utils/activityEngine.ts
                  </div>
                  <p className="text-slate-400">
                    Automated activity recommendation engine calculating deterministic condition suitability (0-100%) for running, cycling, outdoor dining, hiking, and daily attire gear.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-bold text-amber-400 mb-1 flex items-center">
                    <FileCode className="w-4 h-4 mr-1.5" /> /src/types/weather.ts
                  </div>
                  <p className="text-slate-400">
                    Strict TypeScript interface contracts for Geocoding results, Raw forecast responses, Processed metrics, Activity recommendations, and Unit systems.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-bold text-purple-400 mb-1 flex items-center">
                    <Container className="w-4 h-4 mr-1.5" /> /src/components/*
                  </div>
                  <p className="text-slate-400">
                    Reusable atomic UI components: CitySearch, CurrentWeather, HourlyForecast, DailyForecast, ActivityRecommendations, WeatherAlerts, and WeatherIcon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docker' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Dockerfile (Multi-Stage Production Build)</h4>
                  <p className="text-xs text-slate-400">Compiles Vite SPA on Node 20 and serves via ultra-light Nginx Alpine on port 3000</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('dockerfile', dockerfileSnippet)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center space-x-1"
                >
                  {copiedKey === 'dockerfile' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'dockerfile' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                {dockerfileSnippet}
              </pre>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-sm font-bold text-white">docker-compose.yml</h4>
                  <p className="text-xs text-slate-400">Production container orchestration with health checks</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('dockercompose', dockerComposeSnippet)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center space-x-1"
                >
                  {copiedKey === 'dockercompose' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'dockercompose' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {dockerComposeSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-white mb-1">Step-by-Step Production Setup</h4>
                <p className="text-xs text-slate-400">Terminal commands to build, test, and deploy to production environments</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Option A: Build & Run with Docker</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('dockercmd', 'docker build -t weather-intelligence .\ndocker run -d -p 3000:3000 --name weather-app weather-intelligence')}
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      {copiedKey === 'dockercmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-cyan-300 bg-slate-900/90 p-2.5 rounded-lg overflow-x-auto">
                    {`# Build container image\ndocker build -t weather-intelligence .\n\n# Run container on port 3000\ndocker run -d -p 3000:3000 --name weather-app weather-intelligence`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Option B: Deploy to Google Cloud Run</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('cloudrun', 'gcloud builds submit --tag gcr.io/$PROJECT_ID/weather-intelligence\ngcloud run deploy weather-intelligence --image gcr.io/$PROJECT_ID/weather-intelligence --platform managed --region us-central1 --allow-unauthenticated --port 3000')}
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      {copiedKey === 'cloudrun' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-emerald-300 bg-slate-900/90 p-2.5 rounded-lg overflow-x-auto">
                    {`gcloud builds submit --tag gcr.io/$PROJECT_ID/weather-intelligence\ngcloud run deploy weather-intelligence \\\n  --image gcr.io/$PROJECT_ID/weather-intelligence \\\n  --platform managed --region us-central1 \\\n  --allow-unauthenticated --port 3000`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Option C: Standard Node & Vite Local Build</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('localcmd', 'npm install\nnpm run build\nnpm run preview')}
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      {copiedKey === 'localcmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-slate-300 bg-slate-900/90 p-2.5 rounded-lg overflow-x-auto">
                    {`npm install\nnpm run build\nnpm run preview`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resilience' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-white mb-1">Async State Handling & Network Resilience</h4>
                <p className="text-xs text-slate-400">Enterprise resilience patterns integrated into the Open-Meteo client</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-cyan-400">1. AbortController Timeout Protection</span>
                  <p className="text-slate-400">
                    Every outgoing request to <code className="text-slate-300">geocoding-api.open-meteo.com</code> and <code className="text-slate-300">api.open-meteo.com</code> is wrapped with an 8000ms AbortController to prevent hung connections during DNS or packet stalls.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-emerald-400">2. Exponential Backoff Retry</span>
                  <p className="text-slate-400">
                    Transient HTTP 5xx responses or network drops trigger up to 2 automated retries with exponential backoff delay (400ms * 2^attempt) before propagating errors.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-400">3. Two-Tier Cache Fallback (TTL & Stale-While-Revalidate)</span>
                  <p className="text-slate-400">
                    Weather forecasts are cached in browser storage with a 15-minute TTL. If offline or if an upstream outage occurs, the service automatically serves stale cached data with a visual &quot;Cached&quot; status badge.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-purple-400">4. Deterministic Offline Model</span>
                  <p className="text-slate-400">
                    In worst-case scenarios where both network and cache are unavailable, a deterministic synoptic model generates safe baseline weather and activity projections rather than crashing the UI.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-white mb-1">Environment Variables & Configuration</h4>
                <p className="text-xs text-slate-400">Variables required for production and preview environments</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div>
                  <div className="font-mono text-cyan-400 font-bold">PORT=3000</div>
                  <p className="text-slate-400 mt-0.5">The mandatory container ingress port for Cloud Run and internal proxy.</p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <div className="font-mono text-cyan-400 font-bold">NODE_ENV=production</div>
                  <p className="text-slate-400 mt-0.5">Disables development instrumentation and enables asset optimizations.</p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <div className="font-mono text-cyan-400 font-bold">OPEN_METEO_API_URL</div>
                  <p className="text-slate-400 mt-0.5">Default: https://api.open-meteo.com (No API key needed; Open-Meteo is free & open access).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Weather Intelligence Production Suite</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors font-medium"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
