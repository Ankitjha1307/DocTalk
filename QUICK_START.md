# DocTalk Frontend - Quick Start Guide

## Backend is Live! 🚀

Your production backend is running at:
```
https://doctalk-production-a83f.up.railway.app
```

The frontend is **already configured** to use this backend.

## Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### Step 2: Run Development Server
```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

All API calls automatically go to the production backend at `https://doctalk-production-a83f.up.railway.app`

### Step 3: Test It Out
1. Open http://localhost:3000 in your browser
2. Test the features:
   - Login with your credentials
   - Upload a lab report (PDF)
   - Search for medicines
   - Check drug interactions
   - View health trends
   - Create a reminder
   - Use AI Pharmacist chat

## Test API Connection

Open your browser console and run:
```javascript
import { testAPIConnection } from '@/lib/test-api'
testAPIConnection()
```

This will verify your connection to the backend.

## Environment Configuration

The frontend automatically reads from `.env.local`:
```
NEXT_PUBLIC_API_URL=https://doctalk-production-a83f.up.railway.app
```

This file is automatically created and configured for the production backend.

### To Switch to Local Backend
If you're developing locally against a local backend:

1. Edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. Restart the development server:
   ```bash
   npm run dev
   ```

## Common Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production build
npm run build        # Build for production
npm start            # Start production server

# Testing
npm test             # Run tests (if configured)

# Deployment to Vercel
npm run build
vercel --prod        # Deploy to production
```

## Troubleshooting

### Issue: "Failed to fetch" from API
**Solution**: Check that the backend is running at `https://doctalk-production-a83f.up.railway.app`

### Issue: 401 Unauthorized errors
**Solution**: Try logging in again. Your token might be expired.

### Issue: Slow API responses
**Solution**: Check the Railway dashboard for backend performance metrics

### Issue: CORS errors
**Solution**: Ensure backend has CORS enabled for http://localhost:3000 (dev) or your production domain

## File Structure

Key files:
- `.env.local` - Backend URL configuration (production)
- `lib/api.js` - API client with all endpoints
- `lib/test-api.js` - Utility to test API connectivity
- `app/dashboard/` - All dashboard pages

## Documentation

For detailed information, see:
- `INTEGRATION_COMPLETE.md` - Full integration status
- `PRODUCTION_CONFIG.md` - Detailed production setup
- `BACKEND_INTEGRATION.md` - API endpoint specifications

## What's Already Set Up

✅ Frontend fully configured for production backend
✅ All 11 dashboard pages with real API integration
✅ Authentication with token management
✅ Error handling with fallbacks
✅ Dark/light mode support
✅ Responsive design
✅ Ready for production deployment

## Next Steps

1. Test all features against the production backend
2. Monitor API responses in DevTools Network tab
3. Create test accounts and data
4. Fix any integration issues
5. Deploy to production (Vercel, Docker, etc.)

## Questions?

Check the other documentation files:
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `BACKEND_INTEGRATION.md` - API details
- `PRODUCTION_CONFIG.md` - Production deployment

Happy coding! 🎉
