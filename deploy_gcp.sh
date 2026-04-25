#!/bin/bash
set -e

# ==========================================================
# ANUBIS - Google Cloud Run Deployment
# Make sure you have the gcloud CLI installed and authenticated:
# gcloud auth login
# gcloud config set project YOUR_PROJECT_ID
# ==========================================================

echo "🚀 Deploying ANUBIS to Google Cloud Run..."

PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: Google Cloud Project ID not set. Run 'gcloud config set project YOUR_PROJECT_ID'"
    exit 1
fi

echo "📦 1/2 Deploying Backend..."
cd backend
gcloud run deploy anubis-backend \
  --source . \
  --platform managed \
  --region asia-south2 \
  --allow-unauthenticated \
  --set-env-vars DEMO_MODE=false,OPENWEATHERMAP_API_KEY=${OPENWEATHERMAP_API_KEY},GEMINI_API_KEY=${GEMINI_API_KEY},NEWSAPI_KEY=${NEWSAPI_KEY},OPENROUTESERVICE_API_KEY=${OPENROUTESERVICE_API_KEY}
cd ..

# Fetch backend URL to pass to frontend
BACKEND_URL=$(gcloud run services describe anubis-backend --platform managed --region asia-south2 --format 'value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

echo "🎨 2/2 Deploying Frontend..."
cd frontend
gcloud run deploy anubis-frontend \
  --source . \
  --platform managed \
  --region asia-south2 \
  --allow-unauthenticated \
  --set-build-env-vars VITE_API_BASE_URL="$BACKEND_URL/api/v1",VITE_MAPTILER_KEY=${VITE_MAPTILER_KEY}
cd ..

echo "🏺 Deployment Complete! The Guardian of Flow is live on GCP."