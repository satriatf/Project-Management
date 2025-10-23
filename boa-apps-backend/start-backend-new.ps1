# Start BOA-APPS Backend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting BOA-APPS Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "c:\xampp\htdocs\Magang\BOA-APPS\boa-apps-backend"

Write-Host "Checking Java version..." -ForegroundColor Yellow
java -version
Write-Host ""

Write-Host "Starting Spring Boot Application..." -ForegroundColor Yellow
Write-Host "Backend will run on: http://localhost:8080" -ForegroundColor Green
Write-Host "API Base URL: http://localhost:8080/api/" -ForegroundColor Green
Write-Host ""

mvn spring-boot:run
