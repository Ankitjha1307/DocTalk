# Production Configuration Guide

## Backend Integration with Railway

The DocTalk frontend is now configured to work with the production backend hosted on Railway.

### Current Configuration

**Backend URL**: https://doctalk-production-a83f.up.railway.app

### Environment Variables

The frontend uses the following environment variable to connect to the backend:

```
NEXT_PUBLIC_API_URL=https://doctalk-production-a83f.up.railway.app
```

#### Local Development

1. **Development against local backend**:
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. **Development against production backend**:
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=https://doctalk-production-a83f.up.railway.app
   ```

3. **Run development server**:
   ```bash
   npm install
   npm run dev
   # Open http://localhost:3000
   ```

### Production Deployment (Vercel)

1. **Add environment variable in Vercel project settings**:
   - Go to Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=https://doctalk-production-a83f.up.railway.app`

2. **Deploy**:
   ```bash
   npm run build
   npm start
   # Or use Vercel CLI: vercel --prod
   ```

### API Endpoints Integrated

The frontend connects to these backend endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get profile

#### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update settings

#### Reports
- `POST /api/reports/upload` - Upload lab report (PDF)
- `GET /api/reports` - List user reports
- `GET /api/reports/{id}` - Get specific report
- `DELETE /api/reports/{id}` - Delete report
- `POST /api/reports/{id}/analyze` - Analyze report

#### Medicines
- `GET /api/medicines/search?q=query` - Search medicines
- `GET /api/medicines/{id}` - Get medicine details
- `POST /api/medicines/interactions` - Check drug interactions
- `GET /api/medicines` - List all medicines

#### Health Trends
- `GET /api/health/trends?days=30` - Get all health trends
- `GET /api/health/trends/blood-sugar?days=30` - Blood sugar trends
- `GET /api/health/trends/cholesterol?days=30` - Cholesterol trends
- `GET /api/health/trends/blood-pressure?days=30` - Blood pressure trends
- `POST /api/health/metrics` - Add health metric

#### Reminders
- `GET /api/reminders` - Get all reminders
- `GET /api/reminders/today` - Get today's reminders
- `GET /api/reminders/upcoming?days=7` - Get upcoming reminders
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/{id}` - Update reminder
- `DELETE /api/reminders/{id}` - Delete reminder
- `POST /api/reminders/{id}/complete` - Mark as completed

#### Health Records
- `GET /api/health-records` - Get all health records
- `POST /api/health-records/upload` - Upload health record
- `DELETE /api/health-records/{id}` - Delete record
- `GET /api/health-records/{id}/download` - Download record

#### Emergency Card
- `GET /api/emergency-card` - Get emergency card
- `PUT /api/emergency-card` - Update emergency card
- `POST /api/emergency-card/contacts` - Add emergency contact
- `PUT /api/emergency-card/contacts/{id}` - Update contact
- `DELETE /api/emergency-card/contacts/{id}` - Delete contact

#### AI Pharmacist
- `POST /api/ai-pharmacist/chat` - Send message to AI
- `GET /api/ai-pharmacist/history` - Get chat history
- `DELETE /api/ai-pharmacist/history` - Clear chat history

#### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary
- `GET /api/dashboard/activity` - Get recent activity
- `GET /api/dashboard/health-overview` - Get health overview

### Authentication

The frontend uses localStorage to store authentication tokens:

```javascript
// Token stored as 'auth_token' in localStorage
localStorage.setItem('auth_token', token);
```

All API requests automatically include the token in the Authorization header:
```
Authorization: Bearer {token}
```

### CORS Configuration

The backend should have CORS enabled for the frontend domain:

**For local development**:
```
CORS_ORIGINS: http://localhost:3000
```

**For production**:
```
CORS_ORIGINS: https://yourdomain.com
```

### Error Handling

The frontend handles API errors gracefully:

1. Network errors - Shows error toast notification
2. Authentication errors (401) - Redirects to login
3. Validation errors (422) - Shows field-specific errors
4. Server errors (500) - Shows error message with retry option

### Testing the Integration

1. **Test API connectivity**:
   ```javascript
   // In browser console
   fetch('https://doctalk-production-a83f.up.railway.app/api/health/status')
     .then(r => r.json())
     .then(console.log)
   ```

2. **Check Network tab**:
   - Open DevTools → Network tab
   - Perform an action (login, search medicine, etc.)
   - Verify requests go to the backend URL

3. **Monitor API responses**:
   - Check console for any [API Error] messages
   - Verify response status codes (200, 201, etc.)

### Troubleshooting

**Issue: "API Error: 403" or "Unauthorized"**
- Check if auth token is being sent
- Verify token is valid and not expired
- Try logging in again

**Issue: "Failed to fetch" or CORS error**
- Check backend is running and accessible
- Verify CORS is enabled on backend
- Check NEXT_PUBLIC_API_URL is correct in .env.local

**Issue: "API Error: 404" on specific endpoint**
- Verify endpoint path matches backend routes
- Check backend implementation exists
- Review backend API documentation

**Issue: Slow API responses**
- Check Railway logs for backend performance
- Monitor database queries
- Check network latency

### Monitoring

Monitor backend health using Railway dashboard:
- Visit: https://railway.app
- Check deployment logs
- Monitor CPU/Memory usage
- Check request/error rates

### Next Steps

1. Test all features against production backend
2. Monitor error logs in both frontend and backend
3. Optimize slow endpoints
4. Set up automated monitoring/alerting
5. Configure backup strategies

For issues or questions about backend implementation, check the backend repository documentation.
