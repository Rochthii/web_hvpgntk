@echo off
title HVPGNTK Backend Server
echo ==================================================
echo   KHOI DONG SERVER BACKEND (DJANGO)
echo ==================================================
echo.
cd backend
echo Dang khoi dong server tai http://127.0.0.1:8000 ...
python manage.py runserver
if %errorlevel% neq 0 (
    echo [LOI] Khong the khoi dong server. Vui long kiem tra lai.
    pause
)
pause
