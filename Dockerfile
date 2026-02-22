# Multi-stage build for production React app

# Stage 1: Build stage
FROM docker.io/oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy environment file for production build
COPY .env.production ./

# Copy source code
COPY . .

# Build the application with production mode
# Vite will use .env.production automatically when mode is production
RUN bun run build

# Stage 2: Production stage with nginx
FROM docker.io/nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1


# Start nginx
CMD ["nginx", "-g", "daemon off;"]
