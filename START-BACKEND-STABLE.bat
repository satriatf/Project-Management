@echo off
cd /d "c:\xampp\htdocs\Magang\BOA-APPS\boa-apps-backend"
echo Starting BOA-APPS Backend...
echo Backend will run on http://localhost:8080
echo.
echo DO NOT CLOSE THIS WINDOW!
echo.
mvn spring-boot:run
pause
