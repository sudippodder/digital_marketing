# OmniFlow AI — Production Multi-Tenant Automated Digital Marketing SaaS Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?style=flat&logo=React&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6.svg?style=flat&logo=TypeScript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-D71F00.svg?style=flat&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791.svg?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com)

**OmniFlow AI** is a multi-tenant, enterprise-grade Automated Digital Marketing SaaS Platform. Built with a central **Marketing Orchestrator Agent** and 8 specialized autonomous agents, OmniFlow allows administrators to onboard clients, ingest their products and services into an AI knowledge base, and trigger 30-day autonomous omnichannel marketing execution plans at the click of the **START DIGITAL MARKETING** button.

---

## 🌟 Key Features

### 1. The Central Marketing Orchestrator & Autonomous Agent Suite
- **Marketing Orchestrator Agent**: Manages client configuration validation, strategy synthesis, 30-day phase planning, task scheduling, and progress coordination.
- **Market Research Agent**: Researches target ICP personas, competitor differentiation, and market opportunities.
- **SEO Agent**: Audits website architecture, Core Web Vitals, and tracks high-intent keyword ranking movements.
- **Content Creation Agent**: Synthesizes SEO cornerstone blog articles, social media captions, and high-CTR advertising copy.
- **Social Media Agent**: Formats and schedules platform-specific posts for LinkedIn, Meta, and Instagram.
- **Advertising Agent**: Optimizes paid search & social campaigns across Google Ads and Meta Ads with daily spending caps.
- **Lead Generation Agent**: Captures inbound form fills, computes AI qualification scores (0-100), and syncs with CRMs.
- **Analytics Agent**: Computes multi-touch attribution, conversion funnels, and channel ROI benchmarks.
- **Reporting Agent**: Generates automated daily executive performance digests and next-day action agendas.

### 2. The Famous "START DIGITAL MARKETING" Activation Workflow
- Comprehensive pre-flight validation checklist (Company details, Knowledge Base items, Marketing objectives, Audience profile, Monthly budget, Brand guidelines).
- Idempotent execution ID generation preventing duplicate campaigns.
- Auto-generation of 30-day strategic roadmap and persistent day-by-day task execution queue.
- Real-time celebration effect with confetti and live status updates.

### 3. Client Portal & Multi-Tenant Data Isolation
- Strict tenant-scoped access control ensuring clients can only access their own organization's metrics and data.
- Dedicated Client Portal with Executive Overview, Daily Reports reader, SEO Analytics, Social Media tracker, Paid Advertising ROAS counters, and Leads pipeline.
- In-app User Guide & Operational Manual with step-by-step walkthroughs for both Admins and Clients.

### 4. Integration Adapter Layer
Modular adapters with connection testing, live/mock simulation, and credential security:
- **Google Search Console & Google Analytics 4 (GA4)**
- **Google Ads & Meta Marketing (Facebook & Instagram Ads)**
- **LinkedIn Marketing Solutions**
- **WordPress REST API**
- **HubSpot CRM & Brevo (Sendinblue Email)**
- **Razorpay Subscription Billing**

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- (Optional) Docker & Docker Compose

### 1. Clone & Setup Environment
```bash
# Copy environment configuration
cp .env.example .env
```

### 2. Backend Setup
```bash
# Install backend dependencies
pip install -r backend/requirements.txt email-validator

# Run backend (auto-initializes database and seeds demo data on startup)
uvicorn app.main:app --app-dir backend --reload --port 8000
```
Backend API will be live at `http://localhost:8000` with interactive OpenAPI docs at `http://localhost:8000/api/v1/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend Web Application will be live at `http://localhost:5173`.

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Login Ready)

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@omniflow.ai` | `password123` | Full agency platform operations & system settings |
| **Marketing Manager** | `manager@omniflow.ai` | `password123` | Client management, campaigns & approvals |
| **Apex Health SaaS (Client)** | `client@apexhealth.io` | `password123` | B2B Healthcare SaaS Client Portal |
| **LuxeAura Cosmetics (Client)** | `client@luxeaura.com` | `password123` | D2C Skincare Brand Client Portal |

*(The login screen also features 1-click demo buttons for instantaneous login without manual typing!)*

---

## 🐳 Docker Deployment

To launch the full production environment with PostgreSQL, Redis, Celery, FastAPI, and Nginx:
```bash
docker-compose up -d --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/api/v1/docs`

---

## 🧪 Running Automated Tests

Run the backend pytest suite:
```bash
python -m pytest
```

---

## 🏗️ Architecture Overview

```
digital_marketing/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # REST API endpoints (Auth, Clients, Projects, Tasks, Reports, Approvals, Integrations)
│   │   ├── core/            # JWT Security, Password Hashing, RBAC & Tenant context
│   │   ├── db/              # SQLAlchemy 2.0 models, Session, and Seed data generator
│   │   ├── schemas/         # Pydantic v2 validation contracts
│   │   ├── services/
│   │   │   ├── agents/      # BaseAgent + 8 Specialized AI Agents (LLM & Heuristic fallback)
│   │   │   ├── integrations/# Google, Meta, LinkedIn, WordPress, HubSpot, Brevo adapters
│   │   │   ├── orchestrator.py # Campaign Orchestration & Plan Synthesizer
│   │   │   └── task_runner.py  # Background Task Execution Engine
│   │   ├── config.py        # Settings management
│   │   └── main.py          # FastAPI application entry point
│   ├── tests/               # Pytest test suite
│   ├── Dockerfile           # Backend container
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar, StartMarketingModal, TaskLogsModal, NewClientModal
│   │   ├── pages/           # Admin Dashboard, Clients, Projects, Tasks, Approvals, Content, Leads, Reports, Settings
│   │   │   └── ClientPortal/# Client Overview, Reports, SEO, Social, Ads, Leads, Content, User Guide
│   │   ├── services/        # Typed API service client
│   │   ├── store/           # Zustand Auth & Active Client workspace state
│   │   ├── types/           # Full TypeScript data contracts
│   │   ├── App.tsx          # Main routing tree with protected role guards
│   │   └── index.css        # Modern glassmorphism & typography styling
│   ├── Dockerfile           # Multi-stage frontend container
│   ├── nginx.conf           # Reverse proxy config
│   └── package.json
├── docker-compose.yml       # Production stack orchestrator
└── README.md
```

---

## 🛡️ Security & Tenant Isolation
- **Authentication**: Salted password hashing via `bcrypt`, signed JWT access tokens with role scopes.
- **Tenant Isolation**: Every database query verifies organization and client IDs against the authenticated user context.
- **Human Approval Checkpoint**: High-impact actions (public blog publishing, ad spend increases) are held in the Approval Center for human verification before deployment.
- **Deterministic AI Fallback**: AI agents execute using live Gemini/OpenAI API keys if supplied, or seamlessly utilize domain-specific heuristic generators to guarantee 100% uptime with zero runtime failures.
#   d i g i t a l _ m a r k e t i n g  
 