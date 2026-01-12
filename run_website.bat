@echo off
title HVPGNTK - Khoi Dong He Thong
color 0f

echo ==================================================
echo   HVPGNTK - WEB PORTAL LAUNCHER
echo   (Backend: Django | Frontend: React/Vite)
echo ==================================================
echo.

:: 1. Check Backend
if not exist "backend\manage.py" (
    color 0c
    echo [LOI] Khong tim thay thu muc 'backend' hoac file 'manage.py'!
    echo Vui long kiem tra lai quy trinh cai dat.
    pause
    exit
)

:: 2. Check Frontend
if not exist "frontend\package.json" (
    color 0c
    echo [LOI] Khong tim thay thu muc 'frontend' hoac file 'package.json'!
    pause
    exit
)

echo [1/2] Khoi dong Backend Server (Port: 8000)...
start "HVPGNTK Backend" /min cmd /k "cd backend && python manage.py runserver 0.0.0.0:8000"

echo [2/2] Khoi dong Frontend Client (Port: 5173)...
start "HVPGNTK Frontend" /min cmd /k "cd frontend && npm run dev"

echo.
echo ==================================================
echo   HE THONG DANG KHOI DONG...
echo   Vui long doi khoang 10 giay.
echo   Trang web se tu dong mo.
echo ==================================================

timeout /t 5 >nul
start http://localhost:5173
start http://localhost:8000/admin

echo.
echo [TUY CHON]
echo   - Web Portal:  http://localhost:5173
echo   - Admin Portal: http://localhost:8000/admin
echo.
echo Neu he thong bao loi Database, hay chay file 'setup_database.bat'
echo hoac go lenh: cd backend ^&^& python manage.py migrate
echo.
pause
