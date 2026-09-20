# Multi-stage production build for Weather Intelligence App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install clean dependencies
RUN npm ci

# Copy source files
COPY . .

# Build production bundle
RUN npm run build

# Production runtime stage with lightweight Nginx
FROM nginx:alpine-slim

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose required container port
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
