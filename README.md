# Hollyhill Dental Clinic Platform

A comprehensive, state-of-the-art dental clinic management platform and patient portal, custom-built for **Hollyhill Dental Clinic** (Unit 6 Hollyhill Shopping Centre, Cork). Led by **Dr. Roghay Alizadeh**, the system incorporates an Express Node.js backend, a modern Next.js client web application, and rich Google Gemini AI integrations.

---

## 🏛️ System Architecture & Tech Stack

The application is structured as a fullstack workspace:

```
hollydental-platform/
├── client/           # Frontend Next.js Application (Port 3000)
├── server/           # Backend Express Node.js API (Port 5000)
└── README.md         # System-wide documentation
```

### Core Technologies
- **Frontend Client**: Next.js (App Router), TypeScript, TailwindCSS/Vanilla CSS, Lucide icons, Zustand (State Management).
- **Backend API**: Node.js, Express, Drizzle ORM, PostgreSQL (Neon/Pool), Cookie-parser, Helmet (CSPs), Express-Rate-Limit (Brute-force protection).
- **AI Integrations**: Google Generative AI (Gemini 1.5 Flash) for chatbot interactions, symptom advice, SEO articles, and clinical writing assistants.
- **Static Assets**: Cloudinary integration for secure clinical files (X-rays, diagnostic photos) and documents upload/storage.

---

## 🔒 Security Hardening

- **Cookie-Based JWT Auth**: Sessions are stored in a secure, `httpOnly`, cross-origin `SameSite=Lax` browser cookie (`token`). Client-side javascript cannot access the token, preventing XSS-based theft.
- **Forced Password Rotation**: Default accounts (such as the seeded admin doctor credentials) are flagged with `mustChangePassword: true` in the database. Restricted token scopes block all resource access except `/change-password` and `/logout` until a strong password (minimum 10 characters, uppercase, lowercase, digit, and special char) is set.
- **API Rate Limiting**:
  - `globalLimiter`: Enforces a maximum of 600 requests per 15 minutes per IP.
  - `authLimiter`: Strict 15 requests per 15 minutes limit on `/api/auth/` routes to prevent brute-forcing passwords.
  - `aiLimiter`: Strict 12 requests per minute on `/api/ai/` routes to prevent API quota exhaustion and financial cost abuse.
- **Clinician Audit Trail**: Deleting patient records, files, and chat messages is restricted or logged. Chat messages are immutable (message deletion disabled in the UI for both admin and patients, and blocked via `403 Forbidden` on the backend).

---

## 🦷 Key Features

### 1. Patient Portal
- **Dashboard**: Quick summaries of upcoming appointments, pending booking requests, unread notification counts, and rapid action links.
- **My Appointments**: Request new appointments, select services, select slots, view confirmation statuses (pending vs confirmed), and cancel upcoming bookings.
- **Treatment History**: Timeline list of all completed clinical procedures, dates, and doctor notes.
- **Interactive Dental Chart**: A read-only SVG tooth map of the patient's mouth. Patients can click on any of their 32 teeth to view its current status (crowned, filled, extracted, needs treatment) and read Dr. Roghay's diagnostic notes.
- **My Files**: Download secure clinical attachments (X-rays, consent PDFs, diagnostic pictures) uploaded by the dentist.
- **Billing & Invoices**: Review billing statements, check fee balances, and download raw PDF receipts directly.
- **Profile Settings**: Manage personal info, change password, export GDPR data in JSON format, or delete the portal account.

### 2. Admin & Staff Dashboard
- **Approvals Queue**: Approve or decline pending appointment requests, notifying patients automatically.
- **Schedule Management**: Interactive calendar showing confirmed, arrived, in-progress, and completed slots.
- **Clinical Quick Actions**:
  - *Prescribe Inline*: Instantly create and record patient medical scripts (e.g. Amoxicillin, Ibuprofen).
  - *Bill Patient Inline*: Pre-fill appointment treatment and generate a printable invoice in one click.
- **Interactive Dental Chart**: Visual SVG interface to modify any of the 32 teeth statuses and save custom clinical observations.
- **AI Clinical Assistant**:
  - *Clinical Brief*: Compile patient histories, medical notes, and treatments into a concise dental summary.
  - *SEO Article Generator*: Scribe high-quality articles with keywords for the Hollyhill blog.
  - *Review Reply*: Generate warm, professional responses to Google/trustpilot reviews.
  - *SMS Reminders*: Generate patient follow-up alert drafts.
- **Live Messaging Center**: Auto-refreshes every 5 seconds, providing a real-time clinical support line to chat with active patients.
- **System Activity Log**: Real-time audit logs of administrative actions.

### 3. Patient-Facing AI Assistants
- **AI Chatbot**: Floating bubble widget for booking queries, clinic hours, directions, and prices.
- **AI Symptom Checker**: Embedded on the Emergency page. Provides interactive guidance for dental emergencies, helping patients manage pain and understand clinical urgency before calling.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL Database URL (Neon or local)
- Gemini API Key (`GEMINI_API_KEY`)
- Cloudinary Credentials (for uploads)

### Setup & Run
1. **Configure Environment Variables**:
   In `server/`, create a `.env` file:
   ```env
   DATABASE_URL=postgres://user:pass@host/db?sslmode=require
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   CLOUDINARY_URL=cloudinary://key:secret@name
   CLIENT_URL=http://localhost:3000
   ```
2. **Start Backend Server**:
   ```bash
   cd server
   npm install
   npm run dev # Runs database migrations, seeds defaults, and starts Express on port 5000
   ```
3. **Start Frontend Client**:
   ```bash
   cd client
   npm install
   npm run dev # Starts Next.js app on port 3000
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the application.
