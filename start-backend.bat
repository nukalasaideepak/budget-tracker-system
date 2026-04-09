@echo off
echo 🚀 Starting BudgetWise Backend
echo ===============================

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%backend"

echo Checking for existing Java processes...
taskkill /F /IM java.exe /T >nul 2>&1
if %errorlevel% equ 0 (
    echo Successfully terminated existing Java processes
) else (
    echo No existing Java processes found or failed to terminate
)

echo Checking for processes using port 8082...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8082"') do (
    echo Found process %%a using port 8082, terminating...
    taskkill /F /PID %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo Successfully terminated process %%a
    ) else (
        echo Failed to terminate process %%a
    )
)

echo Waiting for port to be completely freed...
timeout /t 8 /nobreak >nul

echo Checking MySQL service...
sc query MySQL96 | find "RUNNING" >nul
if errorlevel 1 (
    echo ERROR: MySQL service is not running. Please start MySQL service first.
    echo You can start it with: net start MySQL96
    pause
    exit /b 1
)
echo MySQL service is running ✓

echo Starting Spring Boot application...
cd /d "%BACKEND_DIR%"
if not exist "pom.xml" (
    echo ERROR: pom.xml not found in %BACKEND_DIR%
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo Running: mvn spring-boot:run
mvn spring-boot:run

echo.
echo Backend stopped.
pause