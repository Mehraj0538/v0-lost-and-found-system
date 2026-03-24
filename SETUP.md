# Lost & Found Information System - Setup Guide

## Overview
This is a comprehensive Lost & Found management system built with Next.js 14, MongoDB, and JWT authentication.

## Prerequisites
- Node.js 18+ and npm/pnpm
- MongoDB Atlas account (or local MongoDB instance)
- Git (for version control)

## Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd lost-found-system
```

### 2. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Optional: API Base URL (for local development)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. MongoDB Setup

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `<username>`, `<password>`, and `<cluster>` in the MONGODB_URI

#### Option B: Local MongoDB
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Connection string for local MongoDB
MONGODB_URI=mongodb://localhost:27017/lost-found
```

### 5. Seed the Database

Run the seed script to populate the database with sample data and create the admin user:

```bash
pnpm run seed
# or
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@lostfound.com`
- Password: `admin123`

⚠️ **IMPORTANT:** Change these credentials immediately after first login in a production environment.

### 6. Start the Development Server

```bash
pnpm dev
# or
npm run dev
```

The application will be available at:
- **Public Site:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

## Features

### Public Features
- **Browse Items:** Search and filter lost/found items by category, location, and date
- **Submit Item:** Report a lost or found item with photos and descriptions
- **Track Submission:** Track your submission status using reference code (LF-YYYY-XXXX)
- **Claim Item:** Submit a claim if you believe an item belongs to you
- **Contact:** Send inquiries about specific items

### Admin Features
- **Dashboard:** View statistics and activity overview
- **Manage Items:** Create, edit, verify, and delete items
- **Manage Categories:** Create and manage item categories
- **Manage Claims:** Review and process item claims
- **Manage Inquiries:** Respond to user inquiries
- **View Activity Log:** Track all system activities
- **Manage Users:** View and manage user accounts

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Items
- `GET /api/items` - List all items (with filters)
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get item details
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/[id]` - Get category details
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Claims
- `GET /api/claims` - List all claims
- `POST /api/claims` - Create new claim
- `GET /api/claims/[id]` - Get claim details
- `PUT /api/claims/[id]` - Update claim status
- `DELETE /api/claims/[id]` - Delete claim

### Inquiries
- `GET /api/inquiries` - List all inquiries
- `POST /api/inquiries` - Create new inquiry
- `GET /api/inquiries/[id]` - Get inquiry details
- `PUT /api/inquiries/[id]` - Update inquiry
- `DELETE /api/inquiries/[id]` - Delete inquiry

## Database Schema

### Collections

#### Users
- `_id`: ObjectId
- `email`: String (unique)
- `password`: String (hashed with bcryptjs)
- `name`: String
- `role`: String ('user' or 'admin')
- `createdAt`: Date
- `updatedAt`: Date

#### Items
- `_id`: ObjectId
- `referenceCode`: String (unique, format: LF-YYYY-XXXX)
- `type`: String ('lost' or 'found')
- `category`: String
- `description`: String
- `location`: String
- `foundDate`: Date
- `submittedBy`: ObjectId (ref: User)
- `status`: String ('pending', 'verified', 'claimed')
- `image`: String (URL)
- `createdAt`: Date
- `updatedAt`: Date

#### Claims
- `_id`: ObjectId
- `item`: ObjectId (ref: Item)
- `claimedBy`: ObjectId (ref: User)
- `description`: String
- `status`: String ('pending', 'approved', 'rejected')
- `createdAt`: Date
- `updatedAt`: Date

#### Categories
- `_id`: ObjectId
- `name`: String (unique)
- `description`: String
- `createdAt`: Date
- `updatedAt`: Date

#### Inquiries
- `_id`: ObjectId
- `item`: ObjectId (ref: Item)
- `name`: String
- `email`: String
- `message`: String
- `status`: String ('pending', 'resolved')
- `createdAt`: Date
- `updatedAt`: Date

#### ActivityLog
- `_id`: ObjectId
- `action`: String
- `user`: ObjectId (ref: User, optional)
- `details`: Object
- `createdAt`: Date

## Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. User logs in with email/password
2. Server validates credentials and generates JWT token
3. Token is stored in httpOnly cookie (secure)
4. Token is automatically sent with every request
5. Admin routes are protected by middleware
6. Token expires after 24 hours

## Email Notifications

Currently, email notifications are logged to console for testing. In production, integrate with:
- **Resend** (recommended)
- SendGrid
- AWS SES
- Mailgun

See `lib/utils/helpers.ts` `sendEmailNotification()` function for integration point.

## Error Handling

The API includes comprehensive error handling:
- Input validation
- Database error handling
- Authentication errors
- Authorization errors
- Not found errors
- Server errors

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication with httpOnly cookies
- ✅ CORS protection
- ✅ Request validation
- ✅ Protected admin routes with middleware
- ✅ Database connection pooling
- ✅ Input sanitization

## Development Tips

### Debug Logs
Enable debug logs by setting:
```bash
DEBUG=* npm run dev
```

### Database Queries
Monitor MongoDB queries in MongoDB Atlas Cluster:
- Go to Atlas > Cluster > Performance Advisor
- Check slow queries and optimize indexing

### Testing API Endpoints
Use tools like Postman or curl:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lostfound.com","password":"admin123"}'

# Get items
curl http://localhost:3000/api/items
```

## Troubleshooting

### MongoDB Connection Error
- Verify MONGODB_URI in .env.local
- Check MongoDB Atlas whitelist includes your IP
- Ensure network connectivity to MongoDB

### JWT Token Error
- Verify JWT_SECRET is set in .env.local
- Check token hasn't expired (24 hour expiration)
- Clear browser cookies and try logging in again

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9
```

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Add MONGODB_URI and JWT_SECRET in Environment Variables
4. Deploy

### Other Platforms
Ensure environment variables are set before deployment:
- MONGODB_URI
- JWT_SECRET

## Production Checklist

- [ ] Change admin password from default
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Setup email service (Resend, SendGrid, etc.)
- [ ] Configure CORS properly
- [ ] Setup rate limiting
- [ ] Enable MongoDB backups
- [ ] Setup monitoring and logging
- [ ] Test all API endpoints
- [ ] Load test the application

## Support & Documentation

For more information:
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT Authentication](https://jwt.io)

## License

MIT License - feel free to use for personal or commercial projects.
