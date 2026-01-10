Write-Host "Starting HVPGNTK Web Portal..." -ForegroundColor Cyan

# Stop existing
taskkill /F /IM python.exe /T 2>$null
taskkill /F /IM node.exe /T 2>$null
Start-Sleep -Seconds 2

# Clean cache
if (Test-Path "frontend\node_modules\.vite") {
    Remove-Item -Recurse -Force "frontend\node_modules\.vite"
}

# Start Backend
Write-Host "Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python manage.py runserver"
Start-Sleep -Seconds 3

# Start Frontend  
Write-Host "Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
Start-Sleep -Seconds 5

# Open Browser
Write-Host "Opening browser: http://localhost:3000" -ForegroundColor Green
Start-Process "http://localhost:3000"
