# HVPGNTK - Stop All Services

Write-Host "========================================" -ForegroundColor Red
Write-Host "  🛑 STOPPING ALL SERVICES" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

Write-Host "Stopping Python (Django)..." -ForegroundColor Yellow
taskkill /F /IM python.exe /T 2>$null

Write-Host "Stopping Node (Vite)..." -ForegroundColor Yellow  
taskkill /F /IM node.exe /T 2>$null

Write-Host ""
Write-Host "✅ All services stopped!" -ForegroundColor Green
Write-Host ""
