# ==========================================================
# ANUBIS - Google Cloud Run Deployment
# Make sure you have the gcloud CLI installed and authenticated:
# gcloud auth login
# gcloud config set project YOUR_PROJECT_ID
# ==========================================================

Write-Host "Deploying ANUBIS to Google Cloud Run..."

$PROJECT_ID = (gcloud config get-value project)
if ([string]::IsNullOrWhiteSpace($PROJECT_ID)) {
    Write-Host "Error: Google Cloud Project ID not set. Run 'gcloud config set project YOUR_PROJECT_ID'"
    exit 1
}

# Pull env variables
$env_vars = Get-Content .env | Where-Object { $_ -match '=' -and -not $_.StartsWith('#') } | ConvertFrom-StringData

Write-Host "1/2 Deploying Backend..."
Set-Location backend

$BACKEND_ENV="DEMO_MODE=false,OPENWEATHERMAP_API_KEY="+$env_vars.OPENWEATHERMAP_API_KEY+",GEMINI_API_KEY="+$env_vars.GEMINI_API_KEY+",NEWSAPI_KEY="+$env_vars.NEWSAPI_KEY+",OPENROUTESERVICE_API_KEY="+$env_vars.OPENROUTESERVICE_API_KEY
gcloud run deploy anubis-backend --source . --platform managed --region us-central1 --allow-unauthenticated --set-env-vars $BACKEND_ENV

Set-Location ..

# Fetch backend URL to pass to frontend
$BACKEND_URL = (gcloud run services describe anubis-backend --platform managed --region us-central1 --format 'value(status.url)')
Write-Host "Backend deployed at: $BACKEND_URL"

Write-Host "2/2 Deploying Frontend..."
Set-Location frontend

$FRONTEND_ENV="VITE_API_BASE_URL="+$BACKEND_URL+"/api/v1,VITE_MAPTILER_KEY="+$env_vars.VITE_MAPTILER_KEY
gcloud run deploy anubis-frontend --source . --platform managed --region us-central1 --allow-unauthenticated --set-build-env-vars $FRONTEND_ENV

Set-Location ..

Write-Host "Deployment Complete! The Guardian of Flow is live on GCP."
