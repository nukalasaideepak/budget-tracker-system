# Free Cloud Deployment Options (No Account Required)

## 🚀 Option 1: GitHub Pages + Local Backend (Simplest)

### Frontend Deployment (Free):
```bash
# Install GitHub CLI or push manually to GitHub
npm install -g gh
gh auth login
gh repo create budgetwise-frontend --public --source=. --push

# Deploy to GitHub Pages
npm install -g angular-cli-ghpages
ng build --configuration production --base-href /budgetwise-frontend/
npx angular-cli-ghpages --dir=dist/frontend
```

**Result**: Frontend available at `https://yourusername.github.io/budgetwise-frontend`

### Backend: Run Locally
- Keep backend running on your machine
- Use ngrok for temporary public access: `ngrok http 8082`

---

## 🌐 Option 2: Netlify + Railway (Free Tiers)

### Frontend (Netlify - Free):
1. **No Account Needed Initially**:
   - Drag & drop the `deploy/frontend` folder to [netlify.com/drop](https://netlify.com/drop)
   - Or use Netlify CLI: `npm install -g netlify-cli && netlify deploy --dir=deploy/frontend --prod`

### Backend (Railway - Free):
```bash
# Railway CLI (no account needed for basic deploy)
npm install -g @railway/cli
railway login  # Will prompt for GitHub auth
railway init
railway up
```

---

## ⚡ Option 3: Vercel (Free for Frontend)

### Frontend Only (Free):
```bash
# Vercel CLI
npm install -g vercel
vercel --prod --yes
# Follow prompts, no account needed initially
```

**URL**: `https://budgetwise-yourname.vercel.app`

### Backend: Use ngrok
```bash
# Install ngrok
npm install -g ngrok
ngrok http 8082
# Get temporary URL like: https://abc123.ngrok.io
```

---

## 🐳 Option 4: Docker + Play-with-Docker (Free)

### Containerized Deployment:
```bash
# Build and run locally
docker-compose --profile cloud up --build

# Deploy to Play-with-Docker (free temporary environment)
# Visit: https://labs.play-with-docker.com/
# Run your docker-compose.yml in their free environment
```

---

## 🔧 Option 5: Surge.sh (Command Line Only)

### Frontend Only (Free):
```bash
# Install Surge
npm install -g surge

# Deploy
cd deploy/frontend
surge --domain budgetwise.surge.sh
# No account needed, creates temporary domain
```

---

## 📱 Option 6: Local Network Deployment

### Make Your Local Server Public:
```bash
# Using ngrok (free tier)
npm install -g ngrok
ngrok http 4200  # Frontend
ngrok http 8082  # Backend

# Using localtunnel
npm install -g localtunnel
lt --port 4200  # Frontend
lt --port 8082  # Backend
```

---

## 🏠 Option 7: Self-Hosting on Personal Server

### If you have a VPS/server:
```bash
# Install Docker on your server
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Deploy your app
scp deploy/backend.jar user@yourserver:~
scp -r deploy/frontend user@yourserver:~

# Run on server
docker run -p 8080:8080 -e DATABASE_URL=... openjdk:17 java -jar backend.jar
# Serve frontend with nginx/apache
```

---

## 📋 Quick Start (No Accounts Required):

1. **Build for production**:
   ```bash
   cd /path/to/budget
   .\deploy.bat  # Windows
   # or manually: cd frontend && npm run build && cd ../backend && mvn package
   ```

2. **Deploy Frontend (Free)**:
   ```bash
   # Option A: Netlify drop
   # Go to https://netlify.com/drop and drag deploy/frontend folder

   # Option B: Surge
   npm install -g surge
   cd deploy/frontend
   surge
   ```

3. **Deploy Backend (Free)**:
   ```bash
   # Option A: ngrok for temporary access
   npm install -g ngrok
   cd backend
   mvn spring-boot:run &
   ngrok http 8082

   # Option B: Railway CLI
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

4. **Update Frontend API URL**:
   - Edit `deploy/frontend/assets/environment.prod.ts`
   - Set `apiUrl: 'https://your-ngrok-url.ngrok.io'` or Railway URL

---

## 🎯 Recommended Free Stack:

- **Frontend**: Netlify Drop (drag & drop, no account)
- **Backend**: ngrok (temporary) or Railway (free tier)
- **Database**: Railway MySQL (free) or local MySQL

## ⚠️ Limitations:
- Free tiers have usage limits
- Temporary URLs may change
- Some services require GitHub for persistence
- Production use may need paid plans eventually

Start with **Netlify Drop + ngrok** for instant deployment without any accounts!