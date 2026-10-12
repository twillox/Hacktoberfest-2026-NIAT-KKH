# BloodBridge — Blood Emergency Coordination Platform

> *“Every drop brings hope.”*

BloodBridge is a real, functional, responsive blood emergency coordination platform that connects people facing a blood emergency with nearby verified blood banks and registered potential donors through a secure, consent-based workflow.

---

## 1. Product Philosophy & Non-Negotiable Minimal UI

The homepage remains strictly minimal with progressive disclosure:
- **Logo and Branding**: BloodBridge insignia and tagline.
- **Top Greeting**: Personalized greeting with avatar badge and city selector pill.
- **Hero**: *“Every drop brings hope.”*
- **Primary Actions**: Two side-by-side action cards:
  - **Find Blood** (`/find-blood`): 4-step emergency request flow.
  - **Become a Donor** (`/donor/register`): Quick mobile-friendly registration.
- **Community Banner**: Artistic illustration of connected community ribbon.
- **Trust Statement**: *“Private by design.”* with data protection summary.
- **Bottom Navigation**: Home, Activity, and Profile.

No public directories, unsolicited donor phone numbers, or administrative clutter are displayed on the landing page.

---

## 2. Technical Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide React, Canvas Confetti.
- **Backend**: Firebase Cloud Functions (TypeScript), Cloud Firestore, Firebase Authentication, Emulator Suite support.
- **Location & Maps**: Browser Geolocation API, Haversine formula, OpenStreetMap & Leaflet mapping, Google Maps navigation links.
- **AI Intake**: Google Gemma 4 via Gemini API (`gemma-4-it`) with fallback mock parsing adapter.
- **WhatsApp**: WhatsApp Business Platform Cloud API adapter with interactive simulation modal, HMAC signature verification, and delivery tracking.
- **Testing**: Vitest unit and integration test suite.

---

## 3. Key Routes & Features

| Route | Role | Description |
|---|---|---|
| `/` | Public | Minimal homepage matching mobile reference UI |
| `/find-blood` | Requester | 4-step emergency request (Requirement → Location → Review & Consent → Submission) |
| `/blood-banks` | Public | Real coordinate distance-sorted blood banks with Call & Get Directions buttons |
| `/emergency/:id` | Requester | Live status tracking, donor response counter, coordinate actions |
| `/donor/register` | Donor | Registration with blood group, radius, notification preferences, explicit consent |
| `/donor/dashboard` | Donor | Active availability toggle, emergency invitations, response actions |
| `/donor/invitation/:id/screening` | Donor | Preliminary non-clinical safety questionnaire |
| `/assistant` | Any | Gemma 4 AI natural language parser extracting structured fields |
| `/coordinator` | Coordinator | Active emergencies overview, screening status, security audit log |
| `/activity` | Any | History of user's submitted requests and donor responses |
| `/profile` | Any | Profile details, role switcher (Ajit / Priya / Dr. Rao), reset demo data |
| `/privacy` | Public | Full transparency on data minimization and medical disclaimers |

---

## 4. Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v22)
- npm v9+

### Installation & Local Run

```bash
cd "BLOOD DONAR"

# Install dependencies (already performed)
npm install

# Run the development server
npm run dev

# Run automated tests
npm test
```

The application starts at `http://localhost:5173`.

---

## 5. Environment Variables & Modes

See `.env.example` for details:

```env
# Mode: 'demo' (out-of-the-box local reactive storage & mock adapters) or 'production'
VITE_APP_MODE=demo

# Firebase Config (Optional in demo mode)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=bloodbridge-demo

# Gemma 4 / Gemini API (Optional - local fallback parser used when blank)
VITE_GEMINI_API_KEY=...
VITE_GEMMA_MODEL_ID=gemma-4-it
```

---

## 6. Medical Disclaimer

BloodBridge is a coordination platform, **not** a blood bank or medical authority. BloodBridge never guarantees clinical availability, donor eligibility, or that a donation will be accepted. All donations require on-site clinical screening and physician authorization at the treating facility.
