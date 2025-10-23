# Start Backend Server
Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting BOA-APPS Backend Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Set-Location -Path "c:\xampp\htdocs\Magang\BOA-APPS\boa-apps-backend"

Write-Host "Checking Java version..." -ForegroundColor Cyan
java -version
Write-Host ""

Write-Host "Starting Spring Boot Application..." -ForegroundColor Cyan
Write-Host "Backend will run on: http://localhost:8080" -ForegroundColor Yellow
Write-Host "Swagger UI: http://localhost:8080/swagger-ui.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

mvn spring-boot:run
