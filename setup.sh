#!/bin/bash
set -e

echo "🌟 Initializing ANUBIS Supply Intelligence System..."

# Check dependencies
command -v python3 >/dev/null 2>&1 || { echo "Python 3 required. Install from https://python.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "Node.js (npm) required. Install from https://nodejs.org"; exit 1; }

# Copy env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️ Created .env file. Please fill in your API keys before proceeding."
  echo "    Open .env in any text editor and replace 'your_key_here' values."
  echo "    Then run this script again."
  exit 0
fi

# Backend setup
echo "🏗️ Installing backend dependencies..."
cd backend
python3 -m venv venv || python -m venv venv
source venv/bin/activate || source venv/Scripts/activate
pip install -r requirements.txt --quiet

echo "📊 Generating training dataset..."
python scripts/generate_dataset.py

echo "🧠 Training Anubis ML model..."
python model/train.py

echo "🌱 Seeding demo data..."
python scripts/seed_firestore.py

echo "🚀 Starting backend server..."
python -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Frontend setup
echo "🎨 Installing frontend dependencies..."
cd frontend
npm install --silent

echo "✨ Starting frontend dev server..."
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "👁️ ANUBIS is awakening..."
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'ANUBIS has returned to slumber.'" EXIT
wait
