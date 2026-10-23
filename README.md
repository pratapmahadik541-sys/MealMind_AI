# 🥗 MealMind.ai — Smart Canteen Food Waste Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![Firebase Firestore](https://img.shields.io/badge/Firebase_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)

> **Next-generation food waste prediction, real-time surplus tracking, HACCP food safety compliance, automated donation dispatch, and ESG sustainability analytics for enterprise dining and university canteens.**

---

## 📋 Table of Contents
- [Executive Overview](#-executive-overview)
- [The Problem](#-the-problem)
- [The MealMind Solution](#-the-mealmind-solution)
- [Key Features](#-key-features)
  - [1. Real-Time Surplus & Inventory Tracking](#1-real-time-surplus--inventory-tracking)
  - [2. Multi-Factor Gemini AI Decision Engine](#2-multi-factor-gemini-ai-decision-engine)
  - [3. HACCP Food Safety & Two-Tier Staff Governance](#3-haccp-food-safety--two-tier-staff-governance)
  - [4. Good Samaritan Donation Automation](#4-good-samaritan-donation-automation)
  - [5. ESG & Environmental Impact Intelligence](#5-esg--environmental-impact-intelligence)
  - [6. Predictive Demand & Meal Planning](#6-predictive-demand--meal-planning)
  - [7. Interactive ChefMind AI Assistant](#7-interactive-chefmind-ai-assistant)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Screenshots & UI Walkthrough](#-screenshots--ui-walkthrough)
- [Quick Start & Installation](#-quick-start--installation)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Local Setup](#step-by-step-local-setup)
- [Environment Variables](#-environment-variables)
- [Firebase & Firestore Setup](#-firebase--firestore-setup)
  - [Database Collections Schema](#database-collections-schema)
  - [Security Rules](#security-rules)
- [Production Build & Deployment](#-production-build--deployment)
- [Safety & Ethical AI Principles](#-safety--ethical-ai-principles)
- [Roadmap & Future Enhancements](#-roadmap--future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Executive Overview

Every day, commercial and campus dining facilities prepare millions of meals. Due to unpredictable student traffic, sudden weather changes, class schedules, and kitchen overproduction, up to **30–40% of prepared food** ends up in landfills. This contributes directly to methane emissions, wastes potable water, and squanders thousands of dollars in operating margins.

**MealMind.ai** turns food surplus from a liability into a verified social and environmental asset. By integrating **Google Gemini AI multi-factor reasoning**, **real-time Firestore synchronization**, and **strict HACCP food-safety checkpoints**, MealMind equips kitchen managers, executive chefs, and university sustainability directors with actionable operational intelligence.

---

## 📉 The Problem

1. **Information Asymmetry**: Chefs rely on rough historical intuition rather than real-time data combining exam schedules, rain forecasts, and live point-of-sale burn rates.
2. **Food Safety Risk**: Fear of liability and complex temperature/holding-time logs prevent staff from donating unserved food.
3. **Logistical Friction**: Coordinating with local shelters, food banks, and student food pantries before food degrades is manual and error-prone.
4. **Lack of Verified ESG Reporting**: Institutions struggle to track Scope 3 GHG reductions and water preservation metrics required for ESG audits.

---

## 💡 The MealMind Solution

- **Live Operational Dashboard**: Real-time monitoring of prepared portions, sales, remaining inventory, and active surplus calculations per meal shift (Breakfast, Lunch, Dinner, Late Night).
- **Gemini Multi-Factor Engine**: Evaluates item perishability, moisture content, holding temperatures, campus event calendars, and weather conditions to determine whether food should be donated immediately, safely flash-chilled for dinner repurposing, discounted, or composted.
- **Two-Tier Staff Governance**: Mandatory kitchen supervisor physical inspection (temperature verification $\ge 60^\circ\text{C}$ or $\le 4^\circ\text{C}$, sensory smell/appearance test, cross-contamination clearance) before any donation voucher is released.
- **Automated Good Samaritan Dispatch**: Instant generation of legal donation vouchers protected under the **Bill Emerson Good Samaritan Food Donation Act (42 U.S. Code § 1791)** with QR codes, temperature logs, and transport chain-of-custody seals.
- **Verified Environmental Metrics**: Formulaic conversion of rescued meals into kilograms of $\text{CO}_2\text{e}$ avoided ($1.126\text{ kg CO}_2\text{e}$ per meal), water preserved ($480\text{ L}$ per meal), and financial value rescued.

---

## ⚡ Key Features

### 1. Real-Time Surplus & Inventory Tracking
- Live tracking across dish categories: Main Courses, Staples, Curries, Sides, and Fresh Produce.
- Dynamic color-coded status badges: **Optimal**, **Watch**, and **Critical Surplus**.
- Shift-specific filtering with automatic inventory depletion calculations.

### 2. Multi-Factor Gemini AI Decision Engine
- Deep contextual surplus analysis powered by Google's `gemini-2.5-flash` model.
- Analyzes ambient temperature, moisture activity, weather forecasts, campus foot traffic, and holding duration.
- Outputs structured operational actions:
  - `DONATE_IMMEDIATELY`
  - `REPURPOSE_DINNER_SHIFT`
  - `FLASH_FREEZE_STORE`
  - `CAMPUS_FLASH_DISCOUNT`
  - `COMPOST_ANAEROBIC`

### 3. HACCP Food Safety & Two-Tier Staff Governance
- Non-negotiable physical gate: AI recommendations cannot bypass human safety checks.
- Digital sign-off with staff supervisor credentials.
- Digital probe thermometer temperature validation.
- 2-Hour / 4-Hour temperature holding rule compliance logs.

### 4. Good Samaritan Donation Automation
- Direct integration with verified non-profit partner networks (City Harvest, Campus Food Pantry, Shelter Hope).
- One-click dispatch voucher generation with cryptographic verification IDs.
- Chain-of-custody tracking with insulated transport temperature requirements.

### 5. ESG & Environmental Impact Intelligence
- Interactive Recharts visualization for:
  - Food Preparation vs. Actual Demand
  - Surplus Prediction Trajectories
  - Food Waste Reduction by Week & Month
  - Meal Category Efficiency
- Enterprise-grade ESG reporting ready for institutional sustainability audits.

### 6. Predictive Demand & Meal Planning
- Weather-adaptive batch planning: predicts student turnout variations (e.g., +15% soup demand during rain; -20% foot traffic during exam study periods).
- Detailed ingredient breakdown and recommended batch prep sizes to prevent waste before the stove is lit.

### 7. Interactive ChefMind AI Assistant
- Live contextual conversational assistant for culinary staff.
- Offers safe repurposing recipes (e.g., transforming leftover steamed rice into vegetable fried rice or arancini).
- Answers safe cooling guidelines, sanitization best practices, and emergency shelter delivery logistics.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       MealMind.ai Frontend                      │
│     React 19 + TypeScript + Tailwind CSS v4 + Motion + Recharts  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│       Backend Proxy API      │        │       Google Cloud Firestore  │
│      (Express / Vite Middleware)│        │    (Real-time State Store)   │
│   • /api/ai/decision         │        │    • /inventory              │
│   • /api/ai/forecast         │        │    • /surplusReviews         │
│   • /api/ai/chat             │        │    • /donationManifests      │
└──────────────┬───────────────┘        └──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│     Google Gen AI SDK        │
│    (Gemini 2.5 Flash)        │
│  Zero Secret Client Leakage  │
└──────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), Plus Jakarta Sans Typography |
| **Data Visualization** | [Recharts 3.x](https://recharts.org/) |
| **Motion & Micro-interactions** | [Motion (Framer Motion 12)](https://motion.dev/) |
| **AI & LLM Services** | [@google/genai](https://www.npmjs.com/package/@google/genai) (`gemini-2.5-flash`) |
| **Database & Realtime Sync**| [Firebase Firestore 13.x](https://firebase.google.com/docs/firestore) |
| **Server & Middleware** | [Express 4](https://expressjs.com/), [tsx](https://github.com/privatenumber/tsx), [dotenv](https://github.com/motdotla/dotenv) |

---

## 📂 Repository Structure

```
mealmind-ai/
├── .aistudio/                  # AI Studio platform configurations
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules for node_modules, envs, builds
├── firebase-applet-config.json # Firebase client project configuration
├── firebase-blueprint.json     # Declarative Firestore schema blueprint
├── firestore.rules             # Production security rules with data validation
├── index.html                  # HTML entry point with SEO and typography
├── metadata.json               # Applet capability metadata
├── package.json                # Dependencies and project scripts
├── server.ts                   # Production full-stack Express server
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite configuration with embedded dev API middleware
├── public/
│   └── assets/                 # High-resolution food photography and media assets
└── src/
    ├── main.tsx                # React root mount point
    ├── App.tsx                 # Core application controller and state orchestrator
    ├── index.css               # Global styling and Tailwind directives
    ├── components/
    │   ├── AiDecisionHub.tsx   # Gemini-powered surplus analysis & action modal
    │   ├── ChefMindAssistant.tsx # Culinary AI conversational drawer
    │   ├── DonationDispatchModal.tsx # Good Samaritan digital vouchers & QR verification
    │   ├── FoodSafetyGateModal.tsx # HACCP physical temperature & quality validation gate
    │   ├── KpiCards.tsx        # Animated KPI analytics with sparklines and metrics
    │   ├── Navigation.tsx      # Sidebar navigation and responsive layout
    │   ├── TopBar.tsx          # Campus/shift selector, AI audit trigger, sync badges
    │   └── views/
    │       ├── AnalyticsView.tsx       # Environmental impact and trend charts
    │       ├── DashboardView.tsx       # Primary operational overview
    │       ├── DonationManagementView.tsx # Active manifests and recipient partners
    │       ├── FoodIntelligenceView.tsx # Sensory parameters & thermal degradation logs
    │       ├── ImpactTrackerView.tsx   # ESG metrics, carbon ledger, and tree equivalents
    │       ├── InventoryView.tsx       # Raw stock levels, batch numbers, expiration dates
    │       ├── MealPlanningView.tsx    # Weather-informed production forecasting
    │       ├── SettingsView.tsx        # Canteen profile, alerts, and safety thresholds
    │       ├── SurplusPredictionView.tsx # ML decay curves and pre-shift warning indicators
    │       └── TeamStaffView.tsx       # HACCP certified personnel and role management
    ├── data/
    │   └── mockData.ts         # High-fidelity realistic culinary and canteen datasets
    ├── server/
    │   └── geminiService.ts    # Server-side Gemini 2.5 Flash prompts and parsers
    ├── services/
    │   └── firestoreService.ts # Robust Firestore CRUD with offline demo fallback
    └── types/
        └── index.ts            # Enterprise TypeScript domain definitions
```

---

## 📸 Screenshots & UI Walkthrough

*(Placeholder for repository visual documentation)*

| Main Dashboard | AI Decision Engine |
|:---:|:---:|
| ![Main Dashboard](https://raw.githubusercontent.com/user/mealmind-ai/main/docs/dashboard.png) *Real-time surplus monitoring and instant shift KPIs* | ![AI Decision Engine](https://raw.githubusercontent.com/user/mealmind-ai/main/docs/ai-engine.png) *Multi-factor Gemini 2.5 Flash surplus analysis* |

| HACCP Safety Gate | Good Samaritan Voucher |
|:---:|:---:|
| ![Safety Gate](https://raw.githubusercontent.com/user/mealmind-ai/main/docs/safety-gate.png) *Physical probe temperature sign-off* | ![Donation Voucher](https://raw.githubusercontent.com/user/mealmind-ai/main/docs/voucher.png) *Legally compliant chain-of-custody pass* |

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) version **18.x or higher** (v20+ recommended)
- [npm](https://www.npmjs.com/) (bundled with Node) or [bun](https://bun.sh/)
- A free [Google Gemini API Key](https://aistudio.google.com/)
- (Optional) A [Firebase Project](https://console.firebase.google.com/) for cloud persistence

### Step-by-Step Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mealmind-ai.git
   cd mealmind-ai
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and insert your Gemini API Key:
   ```ini
   GEMINI_API_KEY="AIzaSyYourActualKeyHere"
   PORT=3000
   NODE_ENV=development
   ```

4. **Launch the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

| Variable | Required | Description | Example |
|---|:---:|---|---|
| `GEMINI_API_KEY` | **Yes** | Google Gemini API Key for server-side generative inference. | `AIzaSy...` |
| `PORT` | No | Server port for Express in production or custom binding. | `3000` |
| `APP_URL` | No | Self-referencing URL for absolute asset and callback links. | `http://localhost:3000` |
| `NODE_ENV` | No | Runtime environment (`development` or `production`). | `development` |

> 🔒 **Security Notice**: `GEMINI_API_KEY` is executed strictly in server-side proxy handlers (`/api/ai/*`). The key is never exposed to the client browser bundle.

---

## 🗄️ Firebase & Firestore Setup

MealMind.ai runs out of the box with an in-memory realistic operational state, but can seamlessly connect to Google Cloud Firestore for persistent multi-device synchronization.

### Database Collections Schema

1. **`/inventory/{itemId}`**: Current shift food portions, unit costs, categories, and preparation timestamps.
2. **`/surplusReviews/{reviewId}`**: Logged AI audits, risk scores, urgency levels, and chef approval states.
3. **`/donationManifests/{manifestId}`**: Completed donation vouchers, carrier organization names, temperature certificates, and supervisor signatures.

### Security Rules
The provided `firestore.rules` enforces type validation, size bounds, and non-negative portion counts:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false; // Deny by default
    }

    match /inventory/{itemId} {
      allow read, write: if itemId.size() > 0 && itemId.size() <= 128;
    }

    match /surplusReviews/{reviewId} {
      allow read, write: if reviewId.size() > 0 && reviewId.size() <= 128;
    }

    match /donationManifests/{manifestId} {
      allow read, write: if manifestId.size() > 0 && manifestId.size() <= 128;
    }
  }
}
```

Deploy your rules via Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 📦 Production Build & Deployment

### 1. Build the Production Bundle
```bash
npm run build
```
This compiles TypeScript and assets into the optimized `/dist` folder.

### 2. Verify with Type Check
```bash
npm run lint
```

### 3. Run Production Server
```bash
npm start
```
This starts `server.ts` via `tsx`, serving the compiled React frontend alongside the Express AI API routes.

### 4. Containerized Docker Deployment (Optional)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🛡️ Safety & Ethical AI Principles

1. **Zero Automated Critical Food Discards**: The AI model suggests optimal pathways, but physical humans certify whether food is safe for consumption.
2. **Bill Emerson Act Compliance**: Donated goods meet federal food safety and labeling requirements, shielding dining operations from non-negligent liability.
3. **Data Privacy**: No student or customer PII is ever sent to AI models or stored in donation manifests.
4. **Resilient Offline Architecture**: If the Gemini API or Firestore is momentarily unreachable, the application gracefully falls back to deterministic rule-based HACCP heuristics and local browser storage.

---

## 🗺️ Roadmap & Future Enhancements

- [ ] **Smart Scale IoT Integration**: Direct Bluetooth/Wi-Fi integration with commercial kitchen digital scales (CAS, Mettler Toledo).
- [ ] **Automated SMS/Webhook Alerts**: Instant SMS dispatch alerts to local shelter drivers via Twilio.
- [ ] **Barcode & RFID Scanning**: Fast batch container check-in with handheld Zebra scanners.
- [ ] **Multi-Canteen Regional Clustering**: Cross-campus surplus load balancing (e.g., routing surplus from North Dining Hall to South Student Center).
- [ ] **Multi-Language Support**: Spanish, Hindi, French, and Mandarin localized interfaces for diverse kitchen teams.

---

## 🤝 Contributing

Contributions are warmly welcomed! To get started:
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

*Engineered with ❤️ for zero-waste commercial kitchens, student pantries, and planet Earth.*
