@echo off
echo Building backend...
call mvnw.cmd clean package -DskipTests
if %ERRORLEVEL% EQU 0 (
    echo Build successful!
    echo Starting backend...
    java -jar target\boa-apps-0.0.1-SNAPSHOT.jar
) else (
    echo Build failed!
    pause
)
