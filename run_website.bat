@echo off
echo ==================================================
echo   HVPGNTK - KHOI DONG TOAN BO HE THONG
echo ==================================================

echo [1/3] Kiem tra moi truong...
if not exist "backend\manage.py" (
    echo [LOI] Khong tim thay backend!
    pause
    exit
)
if not exist "frontend\package.json" (
    echo [LOI] Khong tim thay frontend!
    pause
    exit
)

echo [2/3] Dang bat Backend Server (Django port 8000)...
start "HVPGNTK Backend" /d backend python manage.py runserver

echo [3/3] Dang bat Frontend (React port 3000)...
cd frontend
start "HVPGNTK Frontend" npm run dev

echo.
echo ==================================================
echo   HE THONG DANG KHOI DONG!
echo   Hay doi 10-15 giay roi truy cap: http://localhost:3000
echo ==================================================
timeout /t 5 >nul
start http://localhost:3000
pause
