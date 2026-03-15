# Backend Integration Checklist

This document provides a complete checklist for integrating the DocTalk frontend with your Python backend.

## Configuration Setup

- [ ] Copy `.env.example` to `.env.local`
- [ ] Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to your backend (e.g., `http://localhost:8000`)
- [ ] Verify backend is running and accessible

## API Endpoint Implementation Checklist

### Authentication Endpoints
- [ ] `POST /api/auth/login` - Accept email, password → Return token, user data
- [ ] `POST /api/auth/register` - Accept email, password, name → Return token, user data
- [ ] `GET /api/auth/profile` - Return current user profile (requires auth token)

### User Management Endpoints
- [ ] `GET /api/user/profile` - Return user profile data
- [ ] `PUT /api/user/profile` - Update user profile (name, email, phone, etc.)
- [ ] `GET /api/user/settings` - Return user app settings
- [ ] `PUT /api/user/settings` - Update user app settings

### Report (Lab Report) Endpoints
- [ ] `POST /api/reports/upload` - Accept file upload, return report with ID
- [ ] `GET /api/reports` - Return list of all user reports
- [ ] `GET /api/reports/{id}` - Return specific report details
- [ ] `DELETE /api/reports/{id}` - Delete a report
- [ ] `POST /api/reports/{id}/analyze` - Analyze report and return parameters

#### Report Response Format Example
```json
{
  "id": "report_123",
  "filename": "lab_report_jan_2024.pdf",
  "uploadedAt": "2024-01-15T10:00:00Z",
  "parameters": [
    {
      "name": "Hemoglobin",
      "value": 10.2,
      "unit": "g/dL",
      "status": "low",
      "normal": "13.5-17.5",
      "explanation": "Possible mild anemia..."
    }
  ]
}
```

### Medicine Endpoints
- [ ] `GET /api/medicines/search?q=query&limit=10` - Search medicines by name/type
- [ ] `GET /api/medicines/{id}` - Get specific medicine details
- [ ] `POST /api/medicines/interactions` - Check interactions between medicines
- [ ] `GET /api/medicines` - Get list of all medicines (optional pagination)

#### Medicine Response Format Example
```json
{
  "medicines": [
    {
      "id": "med_1",
      "name": "Ibuprofen",
      "type": "NSAID",
      "uses": "Pain relief, fever reduction...",
      "dosage": "Adults: 200-400mg every 4-6 hours...",
      "sideEffects": ["Stomach upset", "Heartburn"],
      "warnings": ["Do not take with aspirin"],
      "interactions": ["Aspirin", "Warfarin"]
    }
  ]
}
```

#### Interaction Response Format Example
```json
{
  "summary": "Found 1 significant interaction",
  "safeCount": 0,
  "warningCount": 1,
  "pairs": [
    {
      "medicine1": "Ibuprofen",
      "medicine2": "Aspirin",
      "severity": "Dangerous",
      "interaction": "Increased bleeding risk",
      "recommendation": "Do not combine...",
      "alternative": "Paracetamol"
    }
  ]
}
```

### Health Trends Endpoints
- [ ] `GET /api/health/trends?days=30` - Get all health trends for period
- [ ] `GET /api/health/trends/blood-sugar?days=30` - Get blood sugar trend
- [ ] `GET /api/health/trends/cholesterol?days=30` - Get cholesterol trend
- [ ] `GET /api/health/trends/blood-pressure?days=30` - Get blood pressure trend
- [ ] `POST /api/health/metrics` - Add new health metric

#### Trends Response Format Example
```json
{
  "blood_sugar": [
    { "date": "2024-01-01", "value": 95 },
    { "date": "2024-01-08", "value": 98 }
  ],
  "blood_pressure": [
    { "date": "2024-01-01", "value": 120 }
  ],
  "cholesterol": [
    { "date": "2024-01-01", "value": 180 }
  ]
}
```

### Reminders Endpoints
- [ ] `GET /api/reminders` - Get all reminders
- [ ] `GET /api/reminders/today` - Get today's reminders
- [ ] `GET /api/reminders/upcoming?days=7` - Get upcoming reminders
- [ ] `POST /api/reminders` - Create new reminder
- [ ] `PUT /api/reminders/{id}` - Update reminder
- [ ] `DELETE /api/reminders/{id}` - Delete reminder
- [ ] `POST /api/reminders/{id}/complete` - Mark reminder as completed

#### Reminder Request/Response Format Example
```json
{
  "id": "reminder_1",
  "medicineName": "Metformin",
  "time": "08:00",
  "frequency": "daily",
  "dosage": "500mg",
  "notes": "Take with breakfast",
  "nextDue": "2024-01-20T08:00:00Z",
  "status": "pending"
}
```

### Health Records Endpoints
- [ ] `GET /api/health-records` - Get all health records
- [ ] `POST /api/health-records/upload` - Upload health document
- [ ] `DELETE /api/health-records/{id}` - Delete record
- [ ] `GET /api/health-records/{id}/download` - Download record file

#### Health Record Response Format Example
```json
{
  "id": "record_1",
  "filename": "vaccination_cert.pdf",
  "type": "Vaccination",
  "uploadedAt": "2024-01-10T00:00:00Z",
  "size": "1.1 MB"
}
```

### Emergency Card Endpoints
- [ ] `GET /api/emergency-card` - Get emergency card data
- [ ] `PUT /api/emergency-card` - Update emergency card
- [ ] `POST /api/emergency-card/contacts` - Add emergency contact
- [ ] `PUT /api/emergency-card/contacts/{id}` - Update emergency contact
- [ ] `DELETE /api/emergency-card/contacts/{id}` - Delete emergency contact

#### Emergency Card Format Example
```json
{
  "name": "John Doe",
  "dob": "1985-06-15",
  "bloodType": "O+",
  "allergies": ["Penicillin", "Peanuts"],
  "medications": [
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily"
    }
  ],
  "medicalConditions": ["Type 2 Diabetes", "Hypertension"],
  "emergencyContacts": [
    {
      "name": "Sarah Doe",
      "relationship": "Spouse",
      "phone": "+1-555-0101"
    }
  ],
  "insurance": {
    "provider": "Blue Cross",
    "policyNumber": "BC123456789",
    "groupNumber": "GRP987654"
  }
}
```

### AI Pharmacist Endpoints
- [ ] `POST /api/ai-pharmacist/chat` - Send message to AI pharmacist
- [ ] `GET /api/ai-pharmacist/history` - Get chat history
- [ ] `DELETE /api/ai-pharmacist/history` - Clear chat history

#### Chat Response Format Example
```json
{
  "message": "Based on your question about Metformin, here are the key points...",
  "timestamp": "2024-01-20T10:00:00Z",
  "source": "ai_pharmacist"
}
```

### Dashboard Endpoints
- [ ] `GET /api/dashboard/summary` - Get dashboard summary
- [ ] `GET /api/dashboard/activity` - Get recent activity log
- [ ] `GET /api/dashboard/health-overview` - Get health overview cards

#### Dashboard Summary Format Example
```json
{
  "health_metrics": [
    {
      "label": "Blood Pressure",
      "value": "120/80",
      "status": "Normal",
      "trend": "stable"
    }
  ],
  "recent_activity": [
    {
      "title": "Report uploaded",
      "description": "Lab Report - January 2024",
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ]
}
```

## Authentication & Security

- [ ] Implement JWT token generation on login
- [ ] Verify token in all protected endpoints
- [ ] Set appropriate token expiration (e.g., 24 hours)
- [ ] Implement refresh token mechanism (optional)
- [ ] Hash passwords with bcrypt or similar
- [ ] Implement rate limiting on login endpoint
- [ ] Add CORS headers to allow frontend requests

### CORS Configuration Example
```python
# For FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## File Upload Handling

- [ ] Accept PDF and image files for reports
- [ ] Accept PDF and image files for health records
- [ ] Validate file types on backend
- [ ] Implement file size limits
- [ ] Store files securely (not in response path)
- [ ] Return file metadata in response

## Error Handling

All endpoints should return errors in this format:

```json
{
  "error": "Error message",
  "status": 400
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## Database Integration

- [ ] Create User table/collection
- [ ] Create Report/LabResult table
- [ ] Create Medicine/Drug table
- [ ] Create Reminder table
- [ ] Create HealthRecord table
- [ ] Create EmergencyCard table
- [ ] Create RemoteMessage/ChatHistory table
- [ ] Add indexes for frequently queried fields

## Testing the Integration

### Manual Testing Steps

1. **Test Authentication**
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "password"}'
   ```

2. **Test Medicine Search**
   ```bash
   curl -X GET "http://localhost:8000/api/medicines/search?q=metformin"
   ```

3. **Test Protected Endpoint**
   ```bash
   curl -X GET http://localhost:8000/api/user/profile \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Test File Upload**
   ```bash
   curl -X POST http://localhost:8000/api/reports/upload \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "file=@report.pdf"
   ```

### Frontend Testing

1. Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local`
2. Run frontend: `npm run dev`
3. Test each page and verify API calls in browser DevTools

## Deployment

- [ ] Update `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Ensure CORS is configured for production domain
- [ ] Test all API endpoints in production
- [ ] Set up error monitoring/logging
- [ ] Configure rate limiting for production
- [ ] Implement analytics tracking

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key  # Optional
```

### Backend (example .env)
```env
DATABASE_URL=postgresql://user:password@localhost/doctalk
JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h
GEMINI_API_KEY=your_gemini_key  # Optional
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Verify backend CORS config allows frontend URL |
| 404 errors | Check API_URL is correct and endpoint exists |
| Auth failures | Verify token format and JWT secret |
| File upload fails | Check file size limit, content-type, multipart handling |
| Slow responses | Check database queries, add indexes, implement caching |

## Documentation References

- Backend API docs: Check your backend repository
- Frontend API client: `/lib/api.js`
- Migration guide: `./MIGRATION_GUIDE.md`
- Component documentation: Check individual component JSDoc comments

## Next Steps

1. Implement all API endpoints in backend
2. Run backend on `http://localhost:8000`
3. Update `.env.local` with API URL
4. Test frontend against backend
5. Fix any integration issues
6. Deploy to production

## Support

For integration issues, check:
- Backend logs for server errors
- Browser DevTools Network tab for API responses
- Console errors in browser
- API endpoint response formats match expected schema
