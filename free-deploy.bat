@echo off
echo 🚀 BudgetWise - No Account Cloud Deployment
echo ===========================================

echo Choose your deployment option:
echo 1. Netlify Drop (Frontend only - drag and drop)
echo 2. Surge.sh (Frontend only - command line)
echo 3. ngrok (Backend temporary public access)
echo 4. localtunnel (Backend alternative)
echo 5. GitHub Pages (Requires GitHub account)
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo 🌐 Netlify Drop Deployment:
    echo 1. Open https://netlify.com/drop in your browser
    echo 2. Drag the entire 'deploy\frontend' folder to the page
    echo 3. Your site will be live instantly!
    echo.
    echo Note: For backend, use ngrok (option 3)
    goto end
)

if "%choice%"=="2" (
    echo.
    echo ⚡ Surge.sh Deployment:
    echo Installing Surge globally...
    npm install -g surge
    echo.
    echo Deploying frontend...
    cd deploy\frontend
    surge --domain budgetwise-%random%.surge.sh
    goto end
)

if "%choice%"=="3" (
    echo.
    echo 🌐 ngrok Public Access:
    echo Installing ngrok...
    npm install -g ngrok
    echo.
    echo Starting backend...
    cd ..\backend
    start /B mvn spring-boot:run
    timeout /t 10 /nobreak > nul
    echo.
    echo Creating public tunnel...
    ngrok http 8082
    goto end
)

if "%choice%"=="4" (
    echo.
    echo 🌐 localtunnel Public Access:
    echo Installing localtunnel...
    npm install -g localtunnel
    echo.
    echo Starting backend...
    cd ..\backend
    start /B mvn spring-boot:run
    timeout /t 10 /nobreak > nul
    echo.
    echo Creating public tunnel...
    lt --port 8082
    goto end
)

if "%choice%"=="5" (
    echo.
    echo 📚 GitHub Pages Deployment:
    echo This requires a GitHub account.
    echo.
    echo Steps:
    echo 1. Create a GitHub repository
    echo 2. Push your code: git init ^&^& git add . ^&^& git commit -m "deploy" ^&^& git push
    echo 3. Install: npm install -g angular-cli-ghpages
    echo 4. Deploy: ng build --base-href /your-repo-name/ ^&^& npx angular-cli-ghpages
    echo.
    echo For backend, use Railway or ngrok
    goto end
)

echo Invalid choice. Please run again and choose 1-5.
:end
echo.
echo Happy deploying! 🎉