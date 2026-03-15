# TypeScript to JavaScript Migration Guide

This document explains the conversion from TypeScript to JavaScript and how to integrate with the backend APIs.

## Overview

The frontend has been converted from TypeScript (`.tsx`) to JavaScript (`.js`) and now includes full backend API integration using the centralized API client in `/lib/api.js`.

## What's Changed

### 1. File Extensions
- `components/ui/button.tsx` → `components/ui/button.js`
- `components/ui/card.tsx` → `components/ui/card.js`
- `components/theme-provider.tsx` → `components/theme-provider.js`
- `components/sidebar.tsx` → `components/sidebar.js`
- `components/navbar.tsx` → `components/navbar.js`
- `app/page.tsx` → `app/page.js`
- `app/dashboard/page.tsx` → `app/dashboard/page.js`
- And all other pages...

### 2. Type Annotations Removed
All TypeScript type annotations have been removed:

```typescript
// Before (TypeScript)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => { ... }
);
```

```javascript
// After (JavaScript)
const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  // ...
});
```

### 3. API Integration Added

A comprehensive API client (`/lib/api.js`) provides all necessary endpoints:

```javascript
import { reportAPI, medicineAPI, remindersAPI, healthTrendsAPI } from '@/lib/api';

// Use API calls in components
const fetchData = async () => {
  const reports = await reportAPI.getReports();
  const medicines = await medicineAPI.search('metformin');
};
```

## API Client Structure

### Available API Modules

#### Authentication
```javascript
authAPI.login(email, password)
authAPI.register(email, password, name)
authAPI.logout()
authAPI.getProfile()
```

#### User
```javascript
userAPI.getProfile()
userAPI.updateProfile(data)
userAPI.updateSettings(settings)
userAPI.getSettings()
```

#### Reports
```javascript
reportAPI.uploadReport(file)
reportAPI.getReports()
reportAPI.getReport(id)
reportAPI.deleteReport(id)
reportAPI.analyzeReport(reportId)
```

#### Medicines
```javascript
medicineAPI.search(query, limit)
medicineAPI.getDetails(medicineId)
medicineAPI.checkInteractions(medicineIds)
medicineAPI.getMedicineList()
```

#### Health Trends
```javascript
healthTrendsAPI.getBloodSugarTrends(days)
healthTrendsAPI.getCholesterolTrends(days)
healthTrendsAPI.getBloodPressureTrends(days)
healthTrendsAPI.getAllTrends(days)
healthTrendsAPI.addHealthMetric(metricType, value, date)
```

#### Reminders
```javascript
remindersAPI.getReminders()
remindersAPI.getTodayReminders()
remindersAPI.getUpcomingReminders(days)
remindersAPI.createReminder(reminderData)
remindersAPI.updateReminder(reminderId, reminderData)
remindersAPI.deleteReminder(reminderId)
remindersAPI.markAsCompleted(reminderId)
```

#### Health Records
```javascript
healthRecordsAPI.getRecords()
healthRecordsAPI.uploadRecord(file, recordType)
healthRecordsAPI.deleteRecord(recordId)
healthRecordsAPI.downloadRecord(recordId)
```

#### Emergency Card
```javascript
emergencyCardAPI.getCard()
emergencyCardAPI.updateCard(cardData)
emergencyCardAPI.addEmergencyContact(contact)
emergencyCardAPI.updateEmergencyContact(contactId, contact)
emergencyCardAPI.deleteEmergencyContact(contactId)
```

#### AI Pharmacist
```javascript
aiPharmacistAPI.sendMessage(message)
aiPharmacistAPI.getChatHistory()
aiPharmacistAPI.clearChatHistory()
```

#### Dashboard
```javascript
dashboardAPI.getSummary()
dashboardAPI.getRecentActivity()
dashboardAPI.getHealthOverview()
```

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Optional: Gemini API Key
# NEXT_PUBLIC_GEMINI_API_KEY=your_key
```

The `NEXT_PUBLIC_` prefix makes these variables available in the browser.

## Updated Pages

All pages have been converted and integrated with backend APIs:

### Pages Created/Updated

1. **`/app/page.js`** - Landing page (no API calls)
2. **`/app/dashboard/page.js`** - Main dashboard with API integration
3. **`/app/dashboard/reports/page.js`** - Lab report analyzer with file upload
4. **`/app/dashboard/medicine-safety/page.js`** - Drug interaction checker
5. **`/app/dashboard/medicine-database/page.js`** - Medicine search and details
6. **`/app/dashboard/health-trends/page.js`** - Health analytics and charts
7. **`/app/dashboard/reminders/page.js`** - Medicine reminders management
8. **`/app/dashboard/health-records/page.js`** - Medical document storage
9. **`/app/dashboard/ai-pharmacist/page.js`** - AI chat interface
10. **`/app/dashboard/emergency-card/page.js`** - Emergency health information
11. **`/app/dashboard/settings/page.js`** - User settings and preferences

## Example Usage

### Fetching Data in a Component

```javascript
'use client';

import { useEffect, useState } from 'react';
import { medicineAPI } from '@/lib/api';

export default function MedicinePage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const data = await medicineAPI.search('metformin');
        setMedicines(data.medicines || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        medicines.map((med) => <div key={med.id}>{med.name}</div>)
      )}
    </div>
  );
}
```

### Uploading Files

```javascript
import { reportAPI } from '@/lib/api';

const handleFileUpload = async (file) => {
  try {
    const result = await reportAPI.uploadReport(file);
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Form Submission with API

```javascript
const handleCreateReminder = async () => {
  try {
    const reminder = await remindersAPI.createReminder({
      medicineName: 'Metformin',
      time: '08:00',
      frequency: 'daily',
      notes: 'Take with breakfast',
    });
    console.log('Reminder created:', reminder);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Authentication

### Login Flow

```javascript
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      // Token is automatically stored by authAPI
      localStorage.setItem('auth_token', response.token);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // Login form JSX
  );
}
```

### Authorization

The API client automatically includes the auth token in requests:

```javascript
// In lib/api.js
const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
if (token) {
  config.headers['Authorization'] = `Bearer ${token}`;
}
```

## Error Handling

All API calls use try-catch for error handling:

```javascript
try {
  const data = await remindersAPI.getReminders();
  setReminders(data);
} catch (error) {
  console.error('[Component] Error:', error);
  setError(`Failed to load reminders: ${error.message}`);
}
```

## Backend API Expectations

The backend should provide these endpoints:

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/profile
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/settings
PUT    /api/user/settings
POST   /api/reports/upload
GET    /api/reports
GET    /api/reports/{id}
DELETE /api/reports/{id}
POST   /api/reports/{id}/analyze
GET    /api/medicines/search?q=query&limit=10
GET    /api/medicines/{id}
POST   /api/medicines/interactions
GET    /api/medicines
GET    /api/health/trends?days=30
GET    /api/health/trends/blood-sugar?days=30
GET    /api/health/trends/cholesterol?days=30
GET    /api/health/trends/blood-pressure?days=30
POST   /api/health/metrics
GET    /api/reminders
GET    /api/reminders/today
GET    /api/reminders/upcoming?days=7
POST   /api/reminders
PUT    /api/reminders/{id}
DELETE /api/reminders/{id}
POST   /api/reminders/{id}/complete
GET    /api/health-records
POST   /api/health-records/upload
DELETE /api/health-records/{id}
GET    /api/health-records/{id}/download
GET    /api/emergency-card
PUT    /api/emergency-card
POST   /api/emergency-card/contacts
PUT    /api/emergency-card/contacts/{id}
DELETE /api/emergency-card/contacts/{id}
POST   /api/ai-pharmacist/chat
GET    /api/ai-pharmacist/history
DELETE /api/ai-pharmacist/history
GET    /api/dashboard/summary
GET    /api/dashboard/activity
GET    /api/dashboard/health-overview
```

## Remaining TypeScript Files to Convert

The following files still have `.tsx` extension and can be converted:

1. `tsconfig.json` - Can remove TypeScript settings or keep for reference
2. `next.config.js` - Already JavaScript, no conversion needed
3. Other configuration files are already in JavaScript

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Common Issues and Solutions

### Issue: API calls fail with 404
**Solution**: Ensure `NEXT_PUBLIC_API_URL` is correctly set in `.env.local` and points to your backend server.

### Issue: Authentication token not found
**Solution**: Ensure the login API returns a `token` field and the user is properly logged in.

### Issue: CORS errors
**Solution**: Configure CORS on your backend to allow requests from your frontend URL.

### Issue: File uploads failing
**Solution**: Ensure the backend accepts `multipart/form-data` and the file size limits are appropriate.

## Next Steps

1. Update `.env.local` with your backend API URL
2. Ensure all backend endpoints are implemented
3. Test each page and feature
4. Deploy to production when ready

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/)

## Support

For issues or questions about the migration, refer to the code comments or check the backend API documentation.
