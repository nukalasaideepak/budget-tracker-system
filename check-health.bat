@echo off
echo 🔍 BudgetWise Backend Health Check
echo ===================================

echo Checking if backend is running on port 8082...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8082' -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✅ Backend is responding' -ForegroundColor Green } else { Write-Host '❌ Backend returned status:' $response.StatusCode -ForegroundColor Red } } catch { Write-Host '❌ Backend is not responding' -ForegroundColor Red }"

echo.
echo Checking database connectivity...
powershell -Command "& 'C:\Program Files\MySQL\MySQL Server 9.6\bin\mysql.exe' -u root -pDeepak@12345 -e 'SELECT 1;' 2>$null; if ($LASTEXITCODE -eq 0) { Write-Host '✅ Database connection successful' -ForegroundColor Green } else { Write-Host '❌ Database connection failed' -ForegroundColor Red }"

echo.
echo Checking API endpoints...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8082/auth/login' -Method POST -Body '{\""username\"":\""test\"",\""password\"":\""test\""}' -ContentType 'application/json' -TimeoutSec 5; Write-Host '✅ Auth endpoint accessible' -ForegroundColor Green } catch { Write-Host '❌ Auth endpoint not accessible' -ForegroundColor Red }"

echo.
echo 📊 System Status:
echo ================
powershell -Command "Get-NetTCPConnection -LocalPort 8082 -ErrorAction SilentlyContinue | Select-Object State; if ($?) { Write-Host '✅ Port 8082 is listening' -ForegroundColor Green } else { Write-Host '❌ Port 8082 is not in use' -ForegroundColor Red }"

echo.
echo 🎯 Quick Actions:
echo ================
echo - Run 'start-backend.bat' to start the backend
echo - Run 'deploy.bat' to build for production
echo - Run 'free-deploy.bat' for deployment options
echo.

pause