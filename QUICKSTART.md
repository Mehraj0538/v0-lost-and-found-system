# Lost & Found System - Quick Start Guide

## What You Need

1. **MongoDB Connection String**
   - Get from MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas
   - Or use local MongoDB with: `mongodb://localhost:27017/lost-found`

2. **Node.js 18+**
   - Download from: https://nodejs.org

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd lost-found-system
pnpm install  # or npm install
```

### 2. Create `.env.local` File
```bash
# In the root directory, create a file named .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
```

### 3. Seed Database
```bash
pnpm run seed
```

This creates:
- Admin user: `admin@lostfound.com` / `admin123`
- 10 sample items
- 5 categories
- Sample data for testing

### 4. Start Development Server
```bash
pnpm dev
```

### 5. Access the Application

**Public Site:**
- Home: http://localhost:3000
- Browse Items: http://localhost:3000/browse
- Submit Item: http://localhost:3000/submit
- Track Submission: http://localhost:3000/track

**Admin Panel:**
- Login: http://localhost:3000/admin
- Email: `admin@lostfound.com`
- Password: `admin123`

## Admin Features

Once logged in, you can:
- View dashboard with statistics
- Manage items (create, edit, delete, verify)
- Manage categories
- Review and process claims
- Respond to inquiries
- View activity logs

## Public Features

Visitors can:
- Browse all lost and found items
- Filter by category, location, date
- Submit a lost or found item
- Track their submission by reference code
- Send inquiries about specific items
- Claim items they believe belong to them

## Database Models

The system uses these collections:

- **Users**: Store user accounts and admin access
- **Items**: Lost and found items with details
- **Categories**: Item categories (Electronics, Keys, etc.)
- **Claims**: Claims made for items
- **Inquiries**: Questions about items
- **ActivityLog**: Track all system changes

## Default Admin Account

⚠️ **IMPORTANT**: Change these immediately in production!

- Email: `admin@lostfound.com`
- Password: `admin123`

To change:
1. Log in to admin panel
2. Update profile
3. Change password in settings

## API Endpoints

All API endpoints are available at `/api/*`:

```
POST   /api/auth/login          - Login user
POST   /api/auth/logout         - Logout user
POST   /api/auth/register       - Register new user
GET    /api/auth/me             - Get current user

GET    /api/items               - List all items
POST   /api/items               - Create new item
GET    /api/items/[id]          - Get item details
PUT    /api/items/[id]          - Update item
DELETE /api/items/[id]          - Delete item

GET    /api/categories          - List categories
POST   /api/categories          - Create category
GET    /api/categories/[id]     - Get category details
PUT    /api/categories/[id]     - Update category
DELETE /api/categories/[id]     - Delete category

GET    /api/claims              - List claims
POST   /api/claims              - Create claim
PUT    /api/claims/[id]         - Update claim

GET    /api/inquiries           - List inquiries
POST   /api/inquiries           - Create inquiry
PUT    /api/inquiries/[id]      - Update inquiry
```

## Testing

### Test Login with curl
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lostfound.com",
    "password": "admin123"
  }'
```

### Test Get Items
```bash
curl http://localhost:3000/api/items
```

### Test with Filters
```bash
# By category
curl "http://localhost:3000/api/items?category=Electronics"

# By type (lost or found)
curl "http://localhost:3000/api/items?type=found"

# By status
curl "http://localhost:3000/api/items?status=pending"

# Combined filters
curl "http://localhost:3000/api/items?type=lost&status=verified&category=Electronics"
```

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

### MongoDB connection fails
- Check MONGODB_URI in `.env.local`
- Verify database user credentials
- Ensure IP is whitelisted in MongoDB Atlas

### Admin login doesn't work
- Run seed script again: `pnpm run seed`
- Check that JWT_SECRET is set in `.env.local`
- Clear browser cookies and try again

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Or use a different port
pnpm dev -- -p 3001
```

## File Structure

```
lost-found-system/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── browse/            # Browse items page
│   ├── submit/            # Submit item page
│   ├── track/             # Track submission page
│   └── page.tsx           # Home page
├── lib/
│   ├── models/            # MongoDB models (Mongoose)
│   ├── db.ts              # Database connection
│   ├── jwt.ts             # JWT utilities
│   ├── errors.ts          # Error handling
│   └── utils/             # Helper functions
├── middleware.ts          # Auth middleware
├── package.json           # Dependencies
├── SETUP.md              # Detailed setup guide
├── DEPLOYMENT.md         # Deployment instructions
└── QUICKSTART.md         # This file
```

## Next Steps

1. ✅ Install and run locally
2. 📝 Review admin features
3. 🧪 Test public features
4. 🔐 Change admin password
5. 🚀 Deploy to Vercel (see DEPLOYMENT.md)

## Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [JWT Authentication](https://jwt.io)
- [Mongoose Docs](https://mongoosejs.com)

## Support

For detailed setup instructions, see: **SETUP.md**
For deployment guide, see: **DEPLOYMENT.md**
For troubleshooting, see: **SETUP.md** (Troubleshooting section)

---

**Ready to get started? Run `pnpm dev` and open http://localhost:3000**
