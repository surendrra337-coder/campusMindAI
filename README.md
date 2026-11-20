# CampusMind AI – Intelligent College Assistant & Student Support Ecosystem

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4.svg)](https://ai.google.dev/)

An individual B.Tech Artificial Intelligence & Data Science software engineering project. **CampusMind AI** is a production-grade, full-stack digital campus companion designed to solve repetitive administrative inquiries, automate FAQ resolutions with zero hallucination, dispatch student grievances, and provide actionable analytics for college leadership.

---

> ⚠️ **Demonstration Prototype Notice:**
> This application is a student software engineering prototype using illustrative college data for **Apex Institute of Technology**. Course fees, cutoff ranks, hostel charges, and contact details are simulated to demonstrate the retrieval and user experience pipeline.

---

## 🌟 Key Capabilities & Features

### 1. 🤖 Conversational AI Campus Assistant (RAG Pipeline)
- **Zero Hallucination Guardrails:** Answers are strictly grounded in official college regulatory documents.
- **Source Attribution:** Shows exact cited document name, section, and similarity confidence score for each answer.
- **Dual-Model Support:**
  - **Live Gemini Mode:** Connected to Google Gemini API via secure backend.
  - **Smart Offline Demo Mode:** Built-in semantic keyword retriever providing comprehensive, structured answers when no API key is provided.
- **Interactive Tools:** Text-to-speech audio playback, copy-to-clipboard, timestamping, latency tracker, and dynamic suggested follow-up questions.

### 2. 📚 Smart Knowledge Base & Admin CRUD
- 14 pre-seeded verified guides covering Admissions, Curriculums, Fees, Attendance Rules, 10-Point CGPA Grading, Hostels, and Supercomputing HPC Facilities.
- Real-time instant search with highlighted tag matching.
- **Demo Admin Mode:** Allows adding new FAQs, editing existing answers, and deleting obsolete entries with instant indexing.

### 3. 🎯 Admission Guidance & Eligibility Wizard
- 5-step visual roadmap from Entrance Examination to ERP ID generation.
- Interactive **Physical Verification Checklist** where students can tick collected documents and track preparation percentage.
- Working **Admission Enquiry Form** with real-time validation and submission logging.

### 4. 🎓 Courses & Department Catalog
- Detailed explorer for **B.Tech Artificial Intelligence & Data Science**, **Computer Science & Engineering**, and more.
- Information on annual intake, fees, cutoff percentiles, HOD credentials, specialized labs (including the **Turing HPC Center with NVIDIA A100 GPUs**), and placement statistics.
- One-click **"Ask AI About This Course"** shortcut.

### 5. 🎫 Student Support Center (Helpdesk)
- Formal grievance submission with category selection (`Academic`, `Fee & Scholarship`, `Hostel`, `Examinations`, `Placement`, `Technical Support`).
- Auto-generates unique tracking numbers (e.g. `TKT-1082`).
- State machine lifecycle: `Submitted` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved`.
- **Demo Admin Status Updater:** Update ticket statuses and enter resolution notes directly.

### 6. 🎙️ Voice Assistant
- Powered by the browser's native **Web Speech API** (`SpeechRecognition` & `SpeechSynthesis`).
- Animated glowing mic orb with real-time speech visualizer.
- Spoken responses with auto-playback and mute toggles.
- Graceful error handling for unsupported browsers or microphone permissions.

### 7. 📊 Admin Analytics Dashboard
- Built with **Recharts** and dynamically calculated from live stored records.
- **Real Metrics:** Total inquiries, resolution rate percentage, average resolution SLA hours, category distribution pie chart, weekly volume area chart, and real-time application activity stream.

---

## 🏗️ Project Architecture

```
CampusConnect-AI/
├── server/
│   ├── index.js               # Express API server with RAG retriever & Gemini integration
│   └── data/
│       ├── knowledge.json     # Verified college knowledge records
│       ├── tickets.json       # Helpdesk support tickets store
│       └── enquiries.json     # Prospective student enquiry records
├── src/
│   ├── main.tsx               # React application entry point
│   ├── App.tsx                # Master app shell with navigation & page router
│   ├── index.css              # Custom styling, dark/light variables, glassmorphism
│   ├── context/
│   │   └── AppContext.tsx     # Global reactive state (Theme, Admin mode, Demo mode, Tickets, Chat)
│   ├── services/
│   │   ├── api.ts             # Unified API client with automatic client-side fallback
│   │   └── speech.ts          # Web Speech recognition and synthesis service
│   ├── components/layout/
│   │   ├── Navbar.tsx         # Top bar with theme switcher, admin mode toggle, and search
│   │   ├── Sidebar.tsx        # 10-page responsive navigation drawer
│   │   ├── Footer.tsx         # Institutional disclaimer & tech stack
│   │   ├── DemoBanner.tsx     # Top illustrative prototype alert
│   │   └── ToastContainer.tsx # Real-time notification toasts
│   ├── pages/
│   │   ├── LandingPage.tsx    # Hero section, value propositions, key metrics
│   │   ├── DashboardPage.tsx  # Student portal overview, urgent notices, recent queries
│   │   ├── ChatPage.tsx       # Core AI Chatbot with RAG citations
│   │   ├── KnowledgeBasePage.tsx # Searchable FAQs with Admin CRUD modal
│   │   ├── AdmissionPage.tsx  # Step-by-step roadmap, checklist, enquiry form
│   │   ├── CoursesPage.tsx    # Academic departments, faculty, and GPU labs
│   │   ├── SupportPage.tsx    # Ticket submission, status badges, resolution modal
│   │   ├── VoicePage.tsx      # Hands-free voice assistant console
│   │   ├── AnalyticsPage.tsx  # Recharts analytics derived from live data
│   │   └── AboutPage.tsx      # Whitepaper & 5-7 min demonstration playbook
│   ├── data/
│   │   ├── sampleKnowledge.ts # Default TypeScript knowledge seed
│   │   └── sampleDepartments.ts # Comprehensive academic departments data
│   └── types/
│       └── index.ts           # Central TypeScript type definitions
├── test/
│   └── verify-system.js       # Automated test suite for RAG & data integrity
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node.js v24.20.0)
- **npm**: v9.0.0 or higher

### Installation
1. Clone or extract the repository:
   ```bash
   cd CampusConnect-AI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration (Optional)
Copy the example environment file:
```bash
cp .env.example .env
```
Open `.env` to configure your Gemini API Key (if you wish to use live Google Gemini):
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```
> *Note:* If `GEMINI_API_KEY` is omitted or left blank, CampusMind AI automatically runs in its intelligent offline **Smart Demo Mode** with full RAG citations and suggested follow-ups.

### Running the Application

To run both the backend server and frontend concurrently with one command:
```bash
npm run dev
```
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

Alternatively, run them separately:
```bash
# Terminal 1 (Backend)
npm run server

# Terminal 2 (Frontend)
npm run client
```

### Running Automated Verification Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

---

## 🎙️ 5–7 Minute Classroom Demonstration Playbook

Follow this step-by-step flow during your live demonstration:

1. **Step 1: Landing Page & Problem Context (1 min)**
   - Open [http://localhost:5173](http://localhost:5173).
   - Point out the metrics bar (100% automated FAQ answers, <1.2s latency, 14 knowledge domains).
   - Click **"Student Dashboard"**.

2. **Step 2: Student Dashboard Overview (1 min)**
   - Highlight the personalized greeting, active support ticket counters, and urgent notices (exam schedules & NVIDIA A100 lab hours).
   - Click one of the popular FAQ questions (e.g., *"What are the attendance rules and relaxation policies?"*).

3. **Step 3: AI Assistant in Action (1.5 min)**
   - The assistant opens and answers with verified university regulations (citing *University Academic Ordinance Chapter IV*).
   - Expand the **"Referenced Knowledge Documents"** dropdown to reveal the exact document snippet and relevance score.
   - Click the audio speaker button to demonstrate **Text-to-Speech synthesis**.
   - Show the **DEMO MODE / GEMINI ACTIVE** badge.

4. **Step 4: Smart Knowledge Base & Demo Admin CRUD (1 min)**
   - Navigate to **Smart Knowledge Base** in the sidebar.
   - Type `"NVIDIA"` in the search bar to demonstrate instant real-time filtering.
   - In the top navbar, click **"Admin Mode"** (turns purple).
   - Click **"Add New FAQ Entry"** to create a custom campus policy or click the pencil icon to edit an existing answer.

5. **Step 5: Support Ticket System (1 min)**
   - Navigate to **Student Support Center**.
   - Click **"Create Support Ticket"**, fill out a student inquiry (e.g. *"Hostel Wi-Fi issue in Kaveri Block"*), and click **Dispatch**.
   - Watch the new ticket appear with its unique ID (`TKT-xxxx`) and `Submitted` status badge.
   - Use Admin Mode to update its status to `In Progress` with official resolution notes.

6. **Step 6: Admin Analytics Dashboard (1 min)**
   - Navigate to **Admin Analytics**.
   - Highlight that all Recharts graphs (Query Volume, Category Breakdown, Ticket Status distribution) are calculated **directly from the live records created during your demo**.

7. **Step 7: Voice Assistant & Wrap-Up (30 sec)**
   - Navigate to **Voice Assistant**.
   - Click the microphone orb or sample voice queries to demonstrate hands-free question answering and speech synthesis.
   - Conclude with the **About Project** architecture page.

---

## 🛡️ License
Built for educational and presentation purposes under the ISC License. Designed and engineered for excellence in modern Artificial Intelligence web applications.
