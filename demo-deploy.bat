@echo off
echo 🚀 BudgetWise - No Account Deployment Demo
echo ==========================================
echo.

echo Your app is ready for deployment without cloud accounts!
echo.

echo 📁 Available deployment files:
echo ================================
dir /b deploy\
echo.

echo 🌐 QUICK START OPTIONS:
echo =======================
echo.

echo 1. Frontend Only (Netlify Drop):
echo    - Open: https://netlify.com/drop
echo    - Drag the 'deploy\frontend' folder
echo    - Get instant live URL!
echo.

echo 2. Frontend Only (Surge.sh):
echo    - Run: npm install -g surge
echo    - Run: cd deploy\frontend ^&^& surge
echo    - Get free .surge.sh domain
echo.

echo 3. Backend Public Access (ngrok):
echo    - Your backend is running on localhost:8082
echo    - Run: ngrok http 8082
echo    - Get temporary public URL like: https://abc123.ngrok.io
echo.

echo 4. Test Your Deployed Frontend:
echo    - Open deploy-test.html in browser
echo    - Follow the deployment guides
echo.

echo 📋 Current Status:
echo ===================
echo ✅ Frontend built and ready in deploy\frontend\
echo ✅ Backend JAR ready in deploy\backend.jar
echo ✅ Docker setup ready
echo ✅ Environment configs ready
echo.

echo 🎯 Recommended Quick Start:
echo ============================
echo 1. Deploy frontend to Netlify Drop (no account needed)
echo 2. Use ngrok for backend access (temporary)
echo 3. Update frontend API URL to ngrok URL
echo 4. Test your live application!
echo.

echo 📖 Full documentation:
echo =======================
echo - FREE_DEPLOYMENT.md (no account options)
echo - CLOUD_DEPLOYMENT.md (paid cloud options)
echo - deploy-test.html (interactive guide)
echo.

echo Happy deploying! 🎉
pause