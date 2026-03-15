# Quick Setup Instructions

This document provides step-by-step instructions to get the DocTalk frontend running with backend integration.

## Prerequisites

- Node.js 18+ installed
- npm, pnpm, or yarn package manager
- Backend API running (Python, FastAPI/Flask, etc.)

## Step 1: Project Setup

```bash
# Clone or navigate to the project
cd doctalk-frontend

# Install dependencies
npm install

# Or with pnpm
pnpm install

# Or with yarn
yarn install
```

## Step 2: Environment Configuration

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local and set your backend URL
# For development (local backend)
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Step 3: Start Development Server

```bash
npm run dev
```

Application will be available at: `http://localhost:3000`

## Step 4: Verify Backend Connection

1. Open browser at `http://localhost:3000`
2. Check browser console (F12) for any API errors
3. Try to navigate to dashboard (it will prompt for login)
4. Verify API calls in Network tab

## File Structure Overview

```
doctalk-frontend/
├── app/
│   ├── page.js                    # Landing page
│   ├── layout.js                  # Root layout
│   ├── globals.css                # Global styles
│   └── dashboard/
│       ├── layout.js              # Dashboard layout
│       ├── page.js                # Dashboard home
│       ├── reports/page.js        # Lab reports
│       ├── medicine-safety/page.js # Drug interactions
│       ├── medicine-database/page.js
│       ├── health-trends/page.js
│       ├── reminders/page.js
│       ├── health-records/page.js
│       ├── ai-pharmacist/page.js
│       ├── emergency-card/page.js
│       └── settings/page.js
│
├── components/
│   ├── navbar.js                  # Top navigation
│   ├── sidebar.js                 # Side navigation
│   ├── theme-provider.js          # Theme switcher
│   └── ui/
│       ├── button.js              # Button component
│       └── card.js                # Card component
│
├── lib/
│   ├── api.js                     # API client (centralized)
│   └── utils.js                   # Utility functions
│
├── public/                        # Static assets
├── .env.example                   # Environment template
├── MIGRATION_GUIDE.md             # TypeScript → JavaScript migration
├── BACKEND_INTEGRATION.md         # Backend API documentation
├── SETUP_INSTRUCTIONS.md          # This file
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Key Files

### API Client: `/lib/api.js`
Central location for all API calls. All modules (reportAPI, medicineAPI, etc.) are exported from here.

**Example usage:**
```javascript
import { reportAPI, medicineAPI } from '@/lib/api';

// Get reports
const reports = await reportAPI.getReports();

// Search medicines
const medicines = await medicineAPI.search('metformin');
```

### Pages with API Integration
All dashboard pages automatically fetch data from backend:
- `reports/page.js` - Uploads files, fetches reports
- `medicine-database/page.js` - Searches medicines
- `health-trends/page.js` - Fetches health data
- `reminders/page.js` - Manages reminders
- And more...

## Common Development Tasks

### Add a New API Call

1. Define endpoint in `/lib/api.js`:
```javascript
export const newAPI = {
  getData: () => apiCall('/api/new-endpoint'),
  updateData: (data) => apiCall('/api/new-endpoint', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};
```

2. Use in component:
```javascript
import { newAPI } from '@/lib/api';

const data = await newAPI.getData();
```

### Create a New Dashboard Page

1. Create file: `app/dashboard/new-page/page.js`
2. Use template:
```javascript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { someAPI } from '@/lib/api';

export default function NewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await someAPI.getData();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8">New Page</h1>
      {/* Your content here */}
    </main>
  );
}
```

3. Add navigation link in `components/sidebar.js`:
```javascript
{ href: "/dashboard/new-page", icon: Icon, label: "New Page" }
```

### Modify Authentication Logic

Edit the login/logout flow in:
- API calls: `/lib/api.js` (authAPI module)
- Navbar: `components/navbar.js`
- Settings: `app/dashboard/settings/page.js`

### Customize Styling

- **Global styles**: `app/globals.css`
- **Tailwind config**: `tailwind.config.js`
- **Component styles**: Inline with Tailwind classes

## Testing Checklist

- [ ] Frontend loads without errors
- [ ] Can navigate between pages
- [ ] API calls show in Network tab
- [ ] Error messages display correctly
- [ ] Authentication flow works
- [ ] File uploads work
- [ ] Charts render properly
- [ ] Responsive design works on mobile
- [ ] Dark/light mode toggle works

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### API Connection Errors
1. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
2. Verify backend is running: `curl http://localhost:8000/`
3. Check CORS headers in browser Network tab
4. Verify endpoint paths match backend

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Module Not Found
Make sure to use correct import paths:
- Absolute imports: `@/lib/api`, `@/components/ui/button`
- Not relative: `../../lib/api`

## Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Update `.env.local` (or Vercel dashboard):
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or connect GitHub for automatic deployments
```

### Deploy Elsewhere
Any Node.js hosting works:
- Heroku
- DigitalOcean
- AWS
- Railway
- Fly.io
- etc.

## Documentation

### For Developers
- **API Reference**: `BACKEND_INTEGRATION.md`
- **Migration Details**: `MIGRATION_GUIDE.md`
- **Code Comments**: Check individual files

### For Backend Integration
- See `BACKEND_INTEGRATION.md` for complete API documentation
- Check response format examples
- Verify all endpoints are implemented

## Support & Resources

- **Frontend Issues**: Check browser console errors
- **API Issues**: Check backend logs
- **Styling Issues**: Check Tailwind CSS documentation
- **Next.js Issues**: https://nextjs.org/docs

## Next Steps

1. ✅ Setup frontend (you're here!)
2. ⬜ Implement backend APIs (see BACKEND_INTEGRATION.md)
3. ⬜ Test integration
4. ⬜ Deploy to production
5. ⬜ Monitor and maintain

## Quick Command Reference

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build           # Build for production
npm start              # Start production server

# Quality
npm run lint           # Run ESLint (if configured)

# Environment
cat .env.example       # View template
cp .env.example .env.local  # Create local env
```

## Success Indicators

✅ Frontend is running at http://localhost:3000
✅ No console errors in browser
✅ Sidebar navigation works
✅ All pages load (with or without data)
✅ Dark/light mode toggle works
✅ Responsive on mobile
✅ Ready to integrate with backend APIs

---

**You're all set!** Proceed to `BACKEND_INTEGRATION.md` to implement the backend API endpoints.
