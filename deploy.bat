@echo off
echo 🚀 BudgetWise Cloud Deployment Preparation
echo ==========================================

echo 1. Building frontend for production...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    exit /b 1
)
echo ✅ Frontend built successfully!

echo.
echo 2. Building backend JAR...
cd ../backend
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ❌ Backend build failed!
    exit /b 1
)
echo ✅ Backend JAR built successfully!

echo.
echo 3. Creating deployment package...
if not exist "..\deploy" mkdir ..\deploy
xcopy /E /I /Y "..\frontend\dist" "..\deploy\frontend\"
copy "target\*.jar" "..\deploy\backend.jar"
copy "Dockerfile" "..\deploy\"
copy "docker-compose.yml" "..\deploy\"

echo.
echo 📦 Deployment package created in 'deploy' folder!
echo.
echo Next steps:
echo 1. Push code to GitHub
echo 2. Deploy backend to Railway/Render/AWS
echo 3. Deploy frontend to Vercel/Netlify
echo 4. Update environment.prod.ts with backend URL
echo.
echo Happy deploying! 🎉