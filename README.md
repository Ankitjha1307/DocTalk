# 🩺 DocTalk — AI Powered Health Assistant Frontend

DocTalk is an **AI-powered healthcare web platform** designed to simplify how people understand and manage their medical information.  
It helps users interpret **lab reports, medicine information, drug interactions, health trends, and reminders** — all in one secure platform.

The goal of DocTalk is to make healthcare **clearer, safer, and more accessible** by turning complex medical information into simple insights.

## 🖥️ Frontend Overview

This is the modern, fully responsive frontend built with **Next.js 16**, **React 18**, **Tailwind CSS**, and **shadcn/ui components**. It provides a professional healthcare SaaS dashboard experience with dark/light mode support.

---

# 🚀 Features

## 📊 Lab Report Analyzer
Upload lab reports and receive **easy-to-understand explanations**.

- AI translates complex medical values
- Color-coded insights for quick understanding
- Highlights abnormal values and potential risks

Example:
Hemoglobin: 10.2 g/dL
⚠ Slightly Low

Possible mild anemia
Consider iron rich foods

---

## 💊 Medicine Information Database
Search any medicine and get reliable information including:

- Purpose and usage
- Recommended dosage
- Side effects
- Warnings
- Drug interactions

---

## ⚠ Drug Interaction Checker
Check whether **multiple medicines are safe to take together**.

Example:
Ibuprofen + Aspirin
⚠ Moderate Risk

May increase bleeding risk

Severity levels:

- 🟢 Safe  
- 🟡 Mild  
- 🟠 Moderate  
- 🔴 Dangerous  

---

## 🔄 Alternative Medicine Suggestions
If a dangerous interaction is detected, DocTalk suggests **safer alternatives**.

Example:
Ibuprofen + Warfarin
🔴 Dangerous

Suggested Alternative:
Paracetamol

---

## 📈 Health Trend Tracking
Track long-term health progress through **AI-generated analytics**.

Features include:

- Blood sugar trends
- Cholesterol tracking
- Blood pressure monitoring
- AI insights on improvements or risks

---

## ⏰ Smart Health Reminders
DocTalk helps users stay consistent with their health routines.

Reminders for:

- medicines
- doctor appointments
- health checkups
- vaccinations

Example:
Take Metformin
8:00 AM – Daily

---

## 🗂 Health Record Locker
Securely store important medical data in one place.

Supports:

- lab reports
- prescriptions
- vaccination records
- family health profiles

Users can also **export reports as PDF**.

---

## 🤖 AI Pharmacist
Users can ask medical questions about medicines and interactions.

Example:
User: Can I take Crocin with Azithromycin?

DocTalk: No major interaction detected. However mild stomach irritation may occur.


---

## 🚑 Emergency Health Card
Instant access to important health information in emergencies.

Displays:

- Blood group
- Allergies
- Current medications
- Emergency contacts

---

# 🧠 How It Works

1. Upload lab reports or prescriptions  
2. AI analyzes the data and extracts key insights  
3. Medicine database checks interactions and safety  
4. Health trends are generated from stored records  
5. Users receive reminders and AI health guidance

---

# 🛠 Tech Stack

### Frontend (This Repository)
- **Framework**: Next.js 16
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Components**: shadcn/ui (custom built)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Theme**: Next-themes (Dark/Light mode)
- **Package Manager**: npm/pnpm/yarn

### Backend (Separate Repository)
- Python (FastAPI/Flask)
- PostgreSQL / MongoDB
- Redis for caching

### AI Layer
- Gemini API for medical insights
- LLM integration for AI Pharmacist

### Deployment
- Vercel (Frontend)
- Cloud hosting for backend

---

# 📂 Project Structure

```
doctalk-frontend/
├── app/
│   ├── page.tsx                 # Landing page with hero, features, testimonials
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles & CSS variables
│   └── dashboard/               # Protected dashboard routes
│       ├── layout.tsx           # Dashboard layout (sidebar + navbar)
│       ├── page.tsx             # Main dashboard with health overview
│       ├── reports/             # Lab Report Analyzer
│       ├── medicine-safety/     # Drug Interaction Checker
│       ├── medicine-database/   # Medicine Search & Details
│       ├── health-trends/       # Health Analytics & Charts
│       ├── reminders/           # Medicine & Health Reminders
│       ├── health-records/      # Medical Document Storage
│       ├── ai-pharmacist/       # AI Chat Interface
│       ├── emergency-card/      # Emergency Health Card
│       └── settings/            # Account Settings
│
├── components/
│   ├── ui/
│   │   ├── button.tsx           # Reusable button component
│   │   └── card.tsx             # Reusable card component
│   ├── sidebar.tsx              # Navigation sidebar
│   ├── navbar.tsx               # Top navigation bar
│   └── theme-provider.tsx       # Next-themes provider
│
├── lib/
│   └── utils.ts                 # Utility functions (cn, etc.)
│
├── public/                      # Static assets
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```


---

# 🚀 Getting Started

## Prerequisites
- Node.js 18 or higher
- npm, pnpm, or yarn

## Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd doctalk

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your backend API URL
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

---

# 📋 Features Breakdown

### 🏠 Landing Page
- Compelling hero section with CTA buttons
- Feature cards showcasing main benefits
- Testimonials from users
- Footer with links and info

### 📊 Dashboard
- Health summary cards (Blood Pressure, Cholesterol, Blood Sugar, Vitamin Levels)
- Quick action cards for main features
- Health trend charts
- Recent activity log
- AI Pharmacist CTA section

### 📄 Report Analyzer
- Drag-and-drop PDF upload
- Lab parameter analysis with color-coded status
- Severity indicators (Normal, Low, High, Critical)
- Medical explanations for each parameter
- Historical trend charts
- Multiple report management

### ⚠️ Medicine Safety Checker
- Add multiple medicines to check
- Real-time interaction detection
- Severity level indicators
- Detailed interaction descriptions
- Safety recommendations
- Suggested alternatives
- Doctor consultation CTA

### 💊 Medicine Database
- Search functionality
- Medicine cards with quick info
- Detailed information panel including:
  - Uses and indications
  - Dosage recommendations
  - Common side effects
  - Important warnings
  - Known drug interactions
- Doctor consultation button

### 📈 Health Trends
- Blood sugar trends over time
- Cholesterol levels (LDL, HDL, Triglycerides)
- Blood pressure monitoring
- AI insights cards
- Interactive Recharts visualizations
- Multiple time period views

### ⏰ Reminders
- View today's reminders
- Upcoming reminders section
- Mark reminders as completed
- Create new reminders modal
- Set frequency, time, and notes
- Delete reminders

### 🗂️ Health Records
- Upload medical documents
- Organized document grid
- Document type badges (Lab Report, Vaccination, Prescription, etc.)
- Document viewer modal
- Download functionality
- Delete option
- Filter by type

### 🚑 Emergency Health Card
- Personal information section
- Blood type and allergies (highlighted)
- Current medications list
- Medical conditions
- Emergency contacts with phone numbers
- Insurance information
- Edit mode for updates
- Professional card layout

### 💬 AI Pharmacist Chat
- Chat interface
- User and bot message differentiation
- Real-time messaging
- Tips and suggestions
- Question history

### ⚙️ Settings
- Profile management
- Email and phone update
- Notification preferences
- Security settings (2FA, private profile)
- Privacy & data options
- Download data / Delete account
- Sign out button
- Version info

---

# 🎨 Design Features

- **Responsive Design**: Mobile-first approach, works on all screen sizes
- **Dark/Light Mode**: Theme toggle in navbar using next-themes
- **Professional Healthcare UI**: Clean, accessible design following healthcare standards
- **Color Coded Status**: Red/Yellow/Green indicators for health metrics
- **Interactive Charts**: Recharts integration for data visualization
- **Smooth Animations**: Tailwind CSS transitions and animations
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

---

# 🔐 Security Considerations

- Form inputs use proper HTML attributes
- No sensitive data in client-side code
- Environment variables for API endpoints
- HTTPS ready for production
- Data validation on inputs

---

# 🔌 Integration Points

The frontend is designed to integrate with the backend API at these endpoints:

```
POST   /api/auth/login           # User authentication
POST   /api/auth/register        # User registration
GET    /api/user/profile         # Get user info
POST   /api/reports/upload       # Upload lab reports
GET    /api/reports              # Get user reports
POST   /api/medicines/check-interaction  # Check drug interactions
GET    /api/medicines/search     # Search medicine database
GET    /api/health/trends        # Get health analytics
GET    /api/reminders            # Get user reminders
POST   /api/reminders            # Create reminder
GET    /api/records              # Get health records
POST   /api/records/upload       # Upload health record
GET    /api/emergency-card       # Get emergency info
PUT    /api/emergency-card       # Update emergency info
POST   /api/ai/chat              # Chat with AI pharmacist
```

---

# 🎯 Vision

DocTalk aims to make healthcare **simpler, safer, and more proactive** by helping people understand their health data and make informed decisions.

---

# 👨‍💻 Team

- **Ankit Jha** (Full Stack)
- **Prateek** (Backend)
- **Ekta Chauhan** (Design/Frontend)
- **Harshit Choudhary** (AI/Integration)

---

# 📝 Notes

- This is the **Frontend** repository. The backend API is in a separate repository.
- All pages are fully functional with mock data for demonstration.
- Replace mock data with actual API calls when integrating with backend.
- Component library is built from scratch using shadcn/ui patterns.
- No external component library dependencies (except Lucide for icons).

---

# 📄 License

MIT License - Feel free to use this project!

---

# 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

For major changes, please open an issue first to discuss.

---

# 📞 Support & Feedback

Found a bug or have a suggestion? Open an issue on GitHub!

