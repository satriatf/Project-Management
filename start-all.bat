@echo off
echo ========================================
echo BOA-APPS - Starting Both Servers
echo ========================================
echo.
echo This will start:
echo 1. Backend (Spring Boot) on http://localhost:8080
echo 2. Frontend (Vue + Vite) on http://localhost:7890
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul
echo.

cd /d "%~dp0"

echo ========================================
echo Starting Backend Server...
echo ========================================
start "BOA-APPS Backend" cmd /k "cd /d "%~dp0boa-apps-backend" && run-backend.bat"

timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
start "BOA-APPS Frontend" cmd /k "cd /d "%~dp0" && run-frontend.bat"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:7890
echo.
echo Close this window when you're done.
pause
