# Lost & Found Information System

A comprehensive web application for managing lost and found items built with Next.js 14, MongoDB, and JWT authentication.

## Quick Navigation

- **New to this project?** Start with [QUICKSTART.md](./QUICKSTART.md)
- **Need detailed setup?** See [SETUP.md](./SETUP.md)
- **Ready to deploy?** Check [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Want the overview?** Read [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

## Overview

This is a full-stack Lost & Found management system that allows:

**Public Features:**
- Browse lost and found items with advanced search/filters
- Submit lost or found items with photos
- Track submission status with reference codes
- Claim items or send inquiries

**Admin Features:**
- Manage all items, categories, and claims
- Review and approve item claims
- Respond to user inquiries
- View activity logs and statistics
- User management

## Tech Stack

```
Frontend: Next.js 14 + React + TypeScript + Tailwind CSS
Backend: Next.js API Routes + Node.js
Database: MongoDB + Mongoose
Auth: JWT (JSON Web Tokens) + bcryptjs
Hosting: Vercel (recommended)
```

## Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (Atlas or local)
- pnpm or npm

### Setup (5 minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env.local file with:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key

# 3. Seed database with demo data
pnpm run seed

# 4. Start development server
pnpm dev
```

### Access the App
- **Public site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin
- **Demo login:** admin@lostfound.com / admin123

## Project Structure

```
app/                 - Next.js app (pages, API routes)
lib/                 - Database models, utilities
hooks/               - Custom React hooks
middleware.ts        - Auth middleware
scripts/             - Seed script
.env.example         - Environment template
QUICKSTART.md        - 5-minute guide
SETUP.md             - Detailed setup
DEPLOYMENT.md        - Production guide
```

## Key Features

✅ JWT-based authentication with httpOnly cookies
✅ MongoDB with Mongoose ORM
✅ Reference code generation (LF-YYYY-XXXX)
✅ Item status tracking (pending, verified, claimed)
✅ Search and filtering capabilities
✅ Admin dashboard with statistics
✅ Claims and inquiries management
✅ Activity logging
✅ Responsive design
✅ Production-ready error handling

## API Endpoints

All endpoints documented in [SETUP.md](./SETUP.md#api-endpoints)

Key routes:
- `POST /api/auth/login` - User login
- `GET /api/items` - List items
- `POST /api/items` - Create item
- `GET /api/categories` - List categories
- `POST /api/claims` - Claim an item
- `POST /api/inquiries` - Send inquiry

## Database

MongoDB collections:
- **Users** - User accounts with hashed passwords
- **Items** - Lost/found items with metadata
- **Categories** - Item categories
- **Claims** - Item claims with status tracking
- **Inquiries** - User inquiries about items
- **ActivityLog** - System activity tracking

See [SETUP.md](./SETUP.md#database-schema) for full schema details.

## Authentication

- Email/password login with JWT tokens
- Secure httpOnly cookies
- Protected admin routes with middleware
- 24-hour token expiration
- Password hashing with bcryptjs

**Default admin credentials:**
```
Email: admin@lostfound.com
Password: admin123
```

⚠️ Change these immediately in production!

## Environment Variables

Required for running the application:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT secret key (use a strong random string, min 32 chars)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Optional: API URL (for client-side requests)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

See `.env.example` for all variables.

## Common Tasks

### Run seed script (populate demo data)
```bash
pnpm run seed
```

### Start development server
```bash
pnpm dev
```

### Build for production
```bash
pnpm build
```

### Start production server
```bash
pnpm start
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add `MONGODB_URI` and `JWT_SECRET` in Environment Variables
4. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Other Platforms
- Set `MONGODB_URI` and `JWT_SECRET` in environment
- Run `npm install` then `npm run build`
- Start with `npm start`

## Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check IP is whitelisted in MongoDB Atlas
- Ensure network connectivity

### JWT Token Error
- Verify `JWT_SECRET` is set
- Check token hasn't expired (24 hours)
- Clear browser cookies and log in again

### Port Already in Use
```bash
lsof -ti :3000 | xargs kill -9
```

See [SETUP.md#troubleshooting](./SETUP.md#troubleshooting) for more solutions.

## File Size & Performance

- Built with Next.js 14 for optimal performance
- Image optimization included
- Static asset caching configured
- API routes optimized for serverless
- MongoDB indexes created automatically

## Security

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ httpOnly cookies (XSS protection)
- ✅ Protected admin routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Error handling

## Testing

### Test API with curl
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lostfound.com","password":"admin123"}'

# Get items
curl http://localhost:3000/api/items
```

### Manual Testing
1. Visit http://localhost:3000 - public site
2. Visit http://localhost:3000/admin - admin login
3. Test browsing items, submitting items
4. Log in to admin panel
5. Test admin features

## Cost

- **MongoDB**: Free tier available (512MB)
- **Vercel**: Free tier available
- **Total**: $0 for development, ~$60-80/month for small production

## Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | 5-minute setup guide |
| [SETUP.md](./SETUP.md) | Detailed configuration |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Complete feature overview |

## Support

For questions or issues:
1. Check the relevant documentation file
2. Review troubleshooting section
3. Check error messages and logs
4. Verify environment variables are set

## License

MIT License - Free for personal and commercial use

---

**Ready to get started?**

Start with [QUICKSTART.md](./QUICKSTART.md) for a 5-minute setup!

**What's next?**
1. Install dependencies: `pnpm install`
2. Set environment variables in `.env.local`
3. Run seed script: `pnpm run seed`
4. Start server: `pnpm dev`
5. Visit http://localhost:3000

For detailed help, see [SETUP.md](./SETUP.md).
