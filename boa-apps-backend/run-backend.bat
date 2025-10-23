@echo off
echo ========================================
echo Starting BOA-APPS Backend Server
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Java version...
java -version
echo.

echo Starting Spring Boot Application...
echo Backend will run on: http://localhost:8080
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo.

mvn spring-boot:run

pause
