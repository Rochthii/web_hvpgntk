Write-Host "Starting HVPGNTK Web Portal (PRODUCTION MODE)..." -ForegroundColor Cyan

# 1. Stop existing processes
Write-Host "[1/5] Cleaning up old processes..." -ForegroundColor Gray
taskkill /F /IM python.exe /T 2>$null
taskkill /F /IM node.exe /T 2>$null
Start-Sleep -Seconds 1

# 2. Database Preparations
Write-Host "[2/5] Preparing Database..." -ForegroundColor Yellow
cd backend
# Check if venv exists and activate
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "Using Virtual Environment..." -ForegroundColor Gray
    & "venv\Scripts\Activate.ps1"
}
# Run migrations and seed data
python manage.py migrate
python manage.py seed_initial_data
cd ..

# 3. Start Backend
Write-Host "[3/5] Starting Backend Server (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; if(Test-Path 'venv/Scripts/Activate.ps1'){& 'venv/Scripts/Activate.ps1'}; python manage.py runserver 0.0.0.0:8000"
Start-Sleep -Seconds 5

# 4. Start Frontend
Write-Host "[4/5] Starting Frontend (Port 3000)..." -ForegroundColor Yellow
# Clean vite cache to ensure updates show
if (Test-Path "frontend\node_modules\.vite") {
    Remove-Item -Recurse -Force "frontend\node_modules\.vite"
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# 5. Launch Browser
Write-Host "[5/5] Launching System..." -ForegroundColor Green
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "SYSTEM IS RUNNING!" -ForegroundColor Cyan
Write-Host "Admin Portal: http://localhost:8000/admin (User: admin@hvpgntk.edu.vn / Pass: admin)" -ForegroundColor Cyan
