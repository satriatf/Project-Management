@echo off
echo ========================================
echo Starting BOA-APPS Frontend (Vite)
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Node.js version...
node -v
echo.

echo Installing dependencies (if needed)...
if not exist "node_modules\" (
    echo Installing npm packages...
    call npm install
) else (
    echo Dependencies already installed.
)
echo.

echo Starting Vite dev server...
echo Frontend will run on: http://localhost:7890
echo.

npm run dev

pause
