# Deployment Notes - Staging

## Quick Deploy to Staging

### Option 1: Railway / Render (Recommended for staging)

1. **Backend:**
   - Connect your GitHub repo
   - Set root directory to `server`
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add all environment variables from `.env.example`
   - Set `NODE_ENV=production`
   - Use MongoDB Atlas for the database (free tier available)

2. **Frontend:**
   - Set root directory to `client`
   - Set build command: `npm install && npm run build`
   - Set publish directory: `dist`
   - Set env var: `VITE_API_URL=https://your-backend-url.com/api`
   - Set env var: `VITE_SOCKET_URL=https://your-backend-url.com`

### Option 2: VPS / Docker

```bash
# Build frontend
cd client
npm run build

# The dist/ folder can be served via nginx or express.static

# Start backend
cd server
NODE_ENV=production npm start
```

## Pre-deployment Checklist

- [ ] Set strong JWT_SECRET and JWT_REFRESH_SECRET (use `openssl rand -hex 32`)
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB Atlas or production database
- [ ] Update CLIENT_URL to match the frontend deploy URL
- [ ] Update GOOGLE_CALLBACK_URL for production domain
- [ ] Run `npm test` and verify all tests pass
- [ ] Build frontend with `npm run build` and check for errors
- [ ] Verify CORS origin matches your frontend URL

## Database

- MongoDB Atlas free tier (M0) works for staging
- Create indexes will be auto-created by Mongoose on first connection
- Compound index on `notifications` collection: `{ recipient: 1, read: 1, createdAt: -1 }`

## Monitoring

- Health check endpoint: `GET /api/health`
- Morgan logging enabled in development
- Error stack traces only shown in development mode
