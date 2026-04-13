# Copy env if it doesn't exist
if (-Not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env file."
}

Write-Host "Starting backend setup..."
cd backend
if (-Not (Test-Path "venv")) {
    python -m venv venv
}
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts\generate_dataset.py
python model\train.py
python scripts\seed_firestore.py
Write-Host "Starting backend server on port 8000..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PSScriptRoot\backend'; .\venv\Scripts\Activate.ps1; python -m uvicorn main:app --reload --port 8000`""

Write-Host "Starting frontend setup..."
cd ..\frontend
npm install --silent
Write-Host "Starting frontend server..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PSScriptRoot\frontend'; npm run dev`""

Write-Host "Both servers are starting in new windows!"
Write-Host "Frontend will be at http://localhost:5173"
Write-Host "Backend will be at http://localhost:8000"
