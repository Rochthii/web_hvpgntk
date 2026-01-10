@echo off
echo ==========================================
echo   HVPGNTK - SYSTEM INITIALIZATION SCRIPT
echo ==========================================

echo [1/3] Applying Database Migrations...
cd backend
python manage.py migrate
if %errorlevel% neq 0 (
    echo [ERROR] Migration failed!
    pause
    exit /b %errorlevel%
)

echo [2/3] Seeding Database (CMS, Users, Academic)...
python manage.py seed_data
if %errorlevel% neq 0 (
    echo [ERROR] Seeding failed!
    pause
    exit /b %errorlevel%
)

echo [3/3] DONE! Database is ready.
echo ==========================================
echo You can now start the server with: start_server.bat
pause
