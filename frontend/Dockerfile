# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine
# Copy custom nginx config if you have one, or just dump into html
COPY --from=builder /app/dist /usr/share/nginx/html
# Change nginx to listen on port 8080 instead of 80 for Cloud Run
RUN sed -i 's/listen  *80;/listen 8080;/g' /etc/nginx/conf.d/default.conf
# Expose port 8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
