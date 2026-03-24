# Lost & Found System - Deployment Guide

## Quick Start (Development)

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- pnpm or npm

### Steps

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set Environment Variables**
   Create `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-secret-key-here-min-32-chars
   ```

3. **Seed Database** (includes admin account)
   ```bash
   pnpm run seed
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```

5. **Access the Application**
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Admin login: admin@lostfound.com / admin123

## Production Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

3. **Import Project**
   - Click "New Project"
   - Select your repository
   - Click "Import"

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Generate a strong 32+ character secret
   
   Generate JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

6. **Run Seed Script** (after first deployment)
   ```bash
   # Option 1: Via Vercel CLI
   vercel env pull
   node scripts/seed.ts
   
   # Option 2: Via MongoDB Atlas
   # Create collections and seed data manually
   ```

### Environment Variables Checklist

- [ ] MONGODB_URI set
- [ ] JWT_SECRET set (32+ characters)
- [ ] NEXT_PUBLIC_API_URL set (if different from deployment URL)

## Database Configuration

### MongoDB Atlas Setup

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Cluster**
   - Click "Create Deployment"
   - Choose "Shared" (free tier)
   - Select region
   - Click "Create"

3. **Create User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set password to auto-generated for security

4. **Whitelist IP**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Add 0.0.0.0/0 for development (restrictive in production)

5. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<username>`, `<password>`, `<database>`

### Local MongoDB Setup

Using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Connection string:
```
mongodb://localhost:27017/lost-found
```

## Seed Data

The seed script creates:
- Admin user (admin@lostfound.com / admin123)
- 10 sample items (mix of lost and found)
- 5 categories
- Sample claims and inquiries

Run seed:
```bash
pnpm run seed
```

## Security Checklist

### Pre-Deployment
- [ ] JWT_SECRET is 32+ characters
- [ ] Database user has strong password
- [ ] Admin password changed from default
- [ ] CORS configured appropriately
- [ ] Environment variables are private

### Post-Deployment
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Verify HTTPS is enforced
- [ ] Check database backups enabled
- [ ] Monitor error logs
- [ ] Setup monitoring (Sentry, etc.)

## Performance Optimization

### MongoDB Indexes
Automatically created by Mongoose models:
- User email (unique)
- Item reference code (unique)
- Item status and type
- Claim status
- Activity log timestamps

### Caching Strategy
- Cache categories in memory (update on change)
- Cache user sessions in JWT
- Use SWR for client-side data fetching
- Set appropriate HTTP cache headers

### CDN Configuration
For Vercel:
- Static assets cached indefinitely
- Images optimized with Next.js Image
- API responses cached with appropriate headers

## Monitoring & Logging

### Enable Monitoring
```javascript
// In middleware or API routes
console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);
```

### Error Tracking
Consider integrating:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [New Relic](https://newrelic.com) for APM

## Scaling Considerations

### Current Architecture Limits
- MongoDB free tier: 512MB storage
- Vercel serverless: 12s timeout per request
- Cold start: ~1s (acceptable for most use cases)

### Upgrade Path
1. Upgrade MongoDB cluster (paid tier)
2. Add caching layer (Redis via Upstash)
3. Implement background jobs (Bull, AWS SQS)
4. Add CDN for images (Vercel Blob, Cloudinary)

## Rollback Procedure

### Vercel
1. Go to "Deployments" tab
2. Select previous deployment
3. Click "Redeploy"

### Database
- Ensure MongoDB backups are enabled
- For critical changes, take manual backup first

```javascript
// Backup command in MongoDB Atlas
mongodump --uri="mongodb+srv://..." --out=./backup
```

## Cost Estimation

### Development (Free/Low Cost)
- MongoDB: Free tier (512MB, 3 shared clusters)
- Vercel: Free tier (up to 100GB bandwidth)
- Total: ~$0-10/month

### Small Production (100-1000 users)
- MongoDB: $57/month (M10 cluster)
- Vercel: $0-20/month (depending on usage)
- Total: ~$60-80/month

### Medium Production (1000-10000 users)
- MongoDB: $514/month (M30 cluster)
- Vercel: $20-100/month
- Redis caching: $10-50/month
- Total: ~$600-700/month

## Support & Troubleshooting

### Common Issues

**MongoDB Connection Timeout**
```
Error: connect ECONNREFUSED
```
Solution: Check MONGODB_URI, IP whitelist, network connectivity

**JWT Token Expired**
```
Error: jwt expired
```
Solution: User needs to log in again, token expires after 24 hours

**CORS Error**
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
Solution: Check CORS configuration in middleware

### Getting Help
- Check SETUP.md for detailed configuration
- Review error logs in Vercel dashboard
- Check MongoDB Atlas metrics
- Test with curl/Postman

## Next Steps

1. Deploy to Vercel
2. Setup monitoring
3. Configure backup strategy
4. Plan scaling roadmap
5. Setup CI/CD pipeline (GitHub Actions)
