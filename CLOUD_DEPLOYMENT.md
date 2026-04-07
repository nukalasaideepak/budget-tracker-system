# BudgetWise Cloud Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Railway (Easiest - Full Stack)
1. **Connect GitHub**: Push your code to GitHub
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **Deploy Backend**:
   - New Project → Deploy from GitHub
   - Select backend folder
   - Add environment variables:
     ```
     DATABASE_URL=jdbc:mysql://containers-us-west-xxx.railway.app:xxxx/budget_db
     DB_USERNAME=railway_user
     DB_PASSWORD=railway_password
     PORT=8080
     ```
4. **Deploy Database**: Add MySQL database to project
5. **Deploy Frontend**:
   - New Project → Deploy from GitHub
   - Select frontend folder
   - Build command: `npm run build`
   - Update `environment.prod.ts` with backend URL

### Option 2: Render (Free Tier Available)
1. **Backend Deployment**:
   - Connect GitHub repo
   - Runtime: Docker
   - Environment variables (same as Railway)
2. **Database**: Use Render PostgreSQL or external MySQL
3. **Frontend**: Static site deployment

### Option 3: Vercel + Railway
1. **Backend**: Deploy to Railway (as above)
2. **Frontend**: Deploy to Vercel
   - Connect GitHub
   - Build settings: `npm run build`
   - Update environment.prod.ts

## 📁 Files Created for Deployment

- `backend/application-cloud.properties` - Cloud database config
- `backend/Dockerfile` - Containerization
- `backend/docker-compose.yml` - Local testing
- `frontend/src/environments/` - Environment configurations
- Updated `auth.service.ts` - Environment-aware API calls

## 🔧 Environment Variables Needed

### Backend:
```
DATABASE_URL=jdbc:mysql://your-db-host:3306/budget_db
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
PORT=8080
```

### Frontend:
Update `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.com'
};
```

## 🐳 Docker Commands

```bash
# Build backend image
docker build -t budgetwise-backend .

# Run with docker-compose (local testing)
docker-compose --profile cloud up --build
```

## 🌐 Domain & SSL

Most platforms provide:
- Automatic SSL certificates
- Custom domains
- CDN integration

## 📊 Production Checklist

- [ ] Update CORS origins in backend
- [ ] Set production database credentials
- [ ] Configure email service (if needed)
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Test all endpoints
- [ ] Performance optimization

## 💰 Cost Estimates

- **Railway**: ~$5-15/month (hobby plan)
- **Render**: Free tier available, ~$7/month for paid
- **Vercel**: Free for frontend, backend costs vary
- **AWS**: ~$10-50/month depending on usage