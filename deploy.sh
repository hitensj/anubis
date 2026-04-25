#!/bin/bash
set -e

# ==========================================================
# ANUBIS - Google Cloud Run Deployment (Delhi Region)
# ==========================================================

echo "🚀 Deploying ANUBIS to Google Cloud Run..."

# Ensure Project ID is set
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" == "(unset)" ]; then
  echo "❌ Error: Google Cloud Project ID not set."
  echo "Run: gcloud config set project [YOUR_PROJECT_ID]"
  exit 1
fi

REGION="asia-south2"

echo "📦 1/2 Deploying Backend..."
cd backend
gcloud run deploy anubis-backend \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated
cd ..

# Fetch backend URL to pass to frontend
BACKEND_URL=$(gcloud run services describe anubis-backend --platform managed --region $REGION --format 'value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

echo "🎨 2/2 Deploying Frontend..."
cd frontend
# Note: Google Cloud Build handles the 'npm run build' automatically via Buildpacks
gcloud run deploy anubis-frontend \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-build-env-vars VITE_API_BASE_URL="$BACKEND_URL/api/v1"
cd ..

echo "🏺 Deployment Complete! The Guardian of Flow is live on GCP (Delhi)."