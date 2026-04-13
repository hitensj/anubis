#!/bin/bash
set -e

echo "🚀 Deploying ANUBIS to Railway..."

# Check Railway CLI
if ! command -v railway &>/dev/null; then
  echo "Installing Railway CLI..."
  npm install -g @railway/cli
fi

echo "Please log in to Railway:"
railway login

echo "Deploying backend..."
cd backend
railway up --service anubis-backend
cd ..

echo "Deploying frontend..."
cd frontend
npm run build
railway up --service anubis-frontend
cd ..

echo ""
echo "✨ ANUBIS deployed successfully!"
echo "Check your Railway dashboard for the live URLs."
