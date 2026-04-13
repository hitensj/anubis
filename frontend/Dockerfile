# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We need to expose env vars during build for Vite
ARG VITE_MAPTILER_KEY
ARG VITE_API_BASE_URL
ENV VITE_MAPTILER_KEY=$VITE_MAPTILER_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy custom nginx config if you have one, or just dump into html
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
