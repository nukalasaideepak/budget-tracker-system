@echo off
echo Starting Budget Backend Server...
echo.

REM Kill any existing Java processes using port 8082
echo Checking for processes using port 8082...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8082" ^| find "LISTENING"') do (
    echo Found process %%a using port 8082, terminating...
    taskkill /f /pid %%a >nul 2>&1
)

REM Wait for port to be fully released
echo Waiting for port 8082 to be released...
timeout /t 5 /nobreak >nul

REM Check if MySQL service is running
echo Checking MySQL service...
sc query MySQL96 | find "RUNNING" >nul
if errorlevel 1 (
    echo MySQL service is not running. Please start MySQL service first.
    pause
    exit /b 1
)

echo MySQL service is running.

REM Navigate to backend directory
cd /d "%~dp0backend"

REM Clean and start the application
echo Starting Spring Boot application...
mvn clean spring-boot:run

echo.
echo Backend server stopped.
pause