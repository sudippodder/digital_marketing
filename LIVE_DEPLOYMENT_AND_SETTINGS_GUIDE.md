# OmniFlow AI — Live Production Deployment & Complete Settings Guide

This guide provides step-by-step instructions to take the OmniFlow AI platform from local development to a secure, live production environment, along with a comprehensive settings reference for **Administrators** and **Client Users**.

---

## 📑 Table of Contents
1. [Production Cloud Deployment Guide (Making the Project Live)](#1-production-cloud-deployment-guide)
   - [A. Hardware & Infrastructure Prerequisites](#a-hardware--infrastructure-prerequisites)
   - [B. Production `.env` Environment Setup](#b-production-env-environment-setup)
   - [C. Automated SSL & Nginx Reverse Proxy](#c-automated-ssl--nginx-reverse-proxy)
   - [D. One-Click Docker Compose Live Deployment](#d-one-click-docker-compose-live-deployment)
   - [E. Production Database Migrations & Seeding](#e-production-database-migrations--seeding)
   - [F. Celery Background Worker & Beat Scheduler](#f-celery-background-worker--beat-scheduler)
2. [Complete Administrator Settings Guide](#2-complete-administrator-settings-guide)
   - [A. Platform White-Labeling & Agency Branding](#a-platform-white-labeling--agency-branding)
   - [B. AI Provider & LLM Engine Settings](#b-ai-provider--llm-engine-settings)
   - [C. Third-Party API Keys & Live Adapter Setup](#c-third-party-api-keys--live-adapter-setup)
   - [D. Execution Safety Policies & Spending Caps](#d-execution-safety-policies--spending-caps)
   - [E. Team & RBAC User Management](#e-team--rbac-user-management)
   - [F. Security Audit Logs & Compliance](#f-security-audit-logs--compliance)
3. [Complete Client User Settings Guide](#3-complete-client-user-settings-guide)
   - [A. Profile & Primary Contact Credentials](#a-profile--primary-contact-credentials)
   - [B. Brand Voice & Knowledge Base Parameters](#b-brand-voice--knowledge-base-parameters)
   - [C. Automated Notification & Lead Alert Preferences](#c-automated-notification--lead-alert-preferences)
   - [D. Security, Password & Session Management](#d-security-password--session-management)

---

## 1. Production Cloud Deployment Guide

### A. Hardware & Infrastructure Prerequisites
- **Recommended Server**: Linux Ubuntu 22.04 or 24.04 LTS (AWS EC2, DigitalOcean Droplet, Hetzner, GCP Compute Engine).
- **Minimum Specs**: 2 vCPUs, 4GB RAM, 40GB SSD.
- **Recommended Specs**: 4 vCPUs, 8GB RAM (for high-volume background tasks & concurrent client AI agents).
- **Installed Software**: `docker` and `docker compose` (v2+), `git`.

### B. Production `.env` Environment Setup
Create a production `.env` file on your server:

```bash
# Environment
ENVIRONMENT=production
SECRET_KEY=generate-a-secure-64-character-jwt-key-here-ex-99a8b7c6d5e4f3a2b1

# Database (PostgreSQL with pgvector)
POSTGRES_USER=omniflow_admin
POSTGRES_PASSWORD=strong_postgres_password_123!
POSTGRES_DB=omniflow_production
DATABASE_URL=postgresql://omniflow_admin:strong_postgres_password_123!@postgres:5432/omniflow_production

# Redis & Celery Workers
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0

# Live AI Providers
DEFAULT_AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSyYourActualGoogleGeminiLiveKeyHere
OPENAI_API_KEY=sk-proj-YourActualOpenAILiveKeyHere

# Production Domain URLs
CORS_ORIGINS=["https://app.yourdomain.com", "https://api.yourdomain.com"]
```

### C. Automated SSL & Nginx Reverse Proxy
Point your custom domain DNS records to your server's Public IPv4 address:
- `A` Record: `app.yourdomain.com` ➔ `YOUR_SERVER_IP`
- `A` Record: `api.yourdomain.com` ➔ `YOUR_SERVER_IP`

Generate automated Let's Encrypt SSL certificates using Certbot:
```bash
sudo apt update && sudo apt install -y certbot nginx
sudo certbot certonly --standalone -d app.yourdomain.com -d api.yourdomain.com
```

### D. One-Click Docker Compose Live Deployment
Clone your repository and build the container stack:
```bash
git clone https://github.com/your-org/digital_marketing.git
cd digital_marketing

# Launch all production microservices in background
docker compose up -d --build
```

Verify all services are healthy:
```bash
docker compose ps
```
You should see:
- `omniflow-postgres` (Healthy on port 5432)
- `omniflow-redis` (Running on port 6379)
- `omniflow-backend` (Running on port 8000)
- `omniflow-frontend` (Running on port 80 / 443)

### E. Production Database Migrations & Seeding
Initialize the production schema and pre-populate agency settings:
```bash
docker compose exec backend python -c "from app.db.seed import seed_database; seed_database()"
```

### F. Celery Background Worker & Beat Scheduler
For high-volume persistent scheduling, Celery Beat runs the daily midnight UTC task runner:
```bash
# Start background worker
docker compose exec -d backend celery -A app.services.task_runner worker -l info

# Start daily cron beat scheduler
docker compose exec -d backend celery -A app.services.task_runner beat -l info
```

---

## 2. Complete Administrator Settings Guide

Access the Administrator Settings Hub at **`/settings`** (Sidebar ➔ *System Settings*).

```
System Settings Hub
├── 1. General Platform       (Agency Branding, Support Email, Timezones)
├── 2. AI Providers & LLM     (Gemini API Key, OpenAI API Key, Model Selection, Fallback)
├── 3. API Keys & Adapters    (Google Search Console, Google Ads, Meta, LinkedIn, CRM)
├── 4. Safety & Spending Caps (Approval Thresholds, Emergency Pause Circuit Breakers)
├── 5. Team & RBAC Users      (Provision Admins, Marketing Managers, Client Portals)
└── 6. Security Audit Logs    (Immutable Event Trail)
```

### A. Platform White-Labeling & Agency Branding
- **SaaS Platform Title**: The public title displayed in the browser tab and navbar (e.g. *OmniFlow AI*).
- **Agency Organization Name**: Legal name included on invoices and client contracts.
- **Primary Support Email**: Contact address displayed on error pages and client guides.
- **Reporting Engine Timezone**: Set to `UTC` (or local timezone) for daily automated reporting dispatches.

### B. AI Provider & LLM Engine Settings
- **Default AI Provider**: Choose between **Google Gemini 1.5 Pro** (high reasoning & fast multimodal processing) or **OpenAI GPT-4o**.
- **Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/) and paste into the secure key field.
- **OpenAI API Key**: Obtain from [OpenAI Platform](https://platform.openai.com/api-keys) as an optional fallback provider.
- **Smart Heuristic Deterministic Fallback**: Toggle to `ON`. If external LLM API keys experience rate limits or network latency, the platform automatically switches to deterministic synthesis, ensuring 100% campaign execution uptime.

### C. Third-Party API Keys & Live Adapter Setup
Configure developer keys under the **API Keys & Adapters** tab:

1. **Google Search Console**:
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/).
   - Enable *Google Search Console API* and generate an OAuth 2.0 Client ID & Secret.
   - Paste the Client ID into the setting.
2. **Google Ads**:
   - Obtain a *Google Ads Developer Token* from your Google Ads Manager Account (MCC).
   - Enter your developer token and manager customer ID.
3. **Meta (Facebook & Instagram Ads)**:
   - Register an App in [Meta for Developers](https://developers.facebook.com/).
   - Enable *Marketing API* and copy the **App ID** and **App Secret**.
4. **LinkedIn Marketing Solutions**:
   - Create an app in [LinkedIn Developer Portal](https://www.linkedin.com/developers/) with *Marketing Developer Platform* permissions.
5. **WordPress CMS**:
   - Generate an **Application Password** in WordPress (*Users ➔ Profile ➔ Application Passwords*) for automated blog publishing.
6. **HubSpot CRM**:
   - Create a Private App in HubSpot (*Settings ➔ Integrations ➔ Private Apps*) with `crm.objects.contacts.write` scope.
7. **Brevo (Sendinblue)**:
   - Copy your v3 API Key from *Brevo SMTP & API* settings for automated email sequences.
8. **Razorpay**:
   - Copy your Key ID and Key Secret from [Razorpay Dashboard](https://dashboard.razorpay.com/) for subscription billing.

### D. Execution Safety Policies & Spending Caps
- **Mandatory Public Content Approval**: When enabled, the AI Content Agent can only save blog posts and social captions as *Drafts/In Review* until authorized by an administrator or client.
- **Paid Ad Budget Increase Threshold ($)**: Specify a dollar amount (e.g. `$500`). Any autonomous budget scaling above this limit pauses and creates a pending approval ticket in the Approval Center.
- **Emergency Global Campaign Pause**: Circuit-breaker toggle. Instantly halts all background execution and queues across all client organizations during system maintenance.

### E. Team & RBAC User Management
Click **Add System User** to provision accounts with role-based access control:
- **Super Admin**: Full platform configuration, API credential management, and billing.
- **Marketing Manager**: Client workspace management, campaign execution, and content approvals.
- **Client**: Scoped strictly to their single organization portal with zero cross-tenant visibility.

---

## 3. Complete Client User Settings Guide

Client users access their workspace settings at **`/portal/settings`** (Sidebar ➔ *Workspace Settings*).

```
Client Workspace Settings
├── 1. Company Profile & Budget  (Business details, Domain, Monthly budget)
├── 2. Brand Voice & Guidelines  (Tone persona, Compliance rules, Value pillars)
├── 3. Email & Alert Preferences (Daily digests, Score 90+ Lead alerts, SMS)
└── 4. Security & Password       (Update credentials, Session security)
```

### A. Profile & Primary Contact Credentials
- Update company legal name, primary contact person, business website, and phone.
- **Monthly Marketing Budget**: Adjust planned budget allocation. Updates will automatically recalculate daily spend pacing.

### B. Brand Voice & Knowledge Base Parameters
- **Brand Tone & Voice Persona**: Define how the AI writes (e.g. *Authoritative, Clinical, Eco-Conscious, Minimalist, Direct*).
- **Regulatory & Compliance Guidelines**: Add strict industry boundaries (e.g. *HIPAA terminology rules, FDA disclaimer requirements, warranty specifications*). The Content Creation Agent adheres to these boundaries on every generation.

### C. Automated Notification & Lead Alert Preferences
Configure automated dispatches:
- **Daily Marketing Digest Email**: Delivered every morning at 00:00 UTC summarizing clicks, impressions, and next-day agendas.
- **High-Intent Inbound Lead Alerts (Score 90+)**: Instant email notification whenever a qualified decision-maker submits a contact form.
- **Weekly Executive Overview**: High-level ROI and keyword movement summary for executive stakeholders.
- **Pending Approval Alerts**: Notifications when a draft blog post or ad campaign requires authorization.

### D. Security, Password & Session Management
- Clients can update their portal access password at any time.
- Passwords require a minimum of 8 characters and are hashed using `bcrypt` with cryptographic salt.

---

## 🚀 Live Launch Verification Checklist

- [ ] Domain DNS records (`A` record) pointing to server IP
- [ ] SSL certificate active (`https://` valid in browser)
- [ ] Production `.env` configured with strong `SECRET_KEY` and database passwords
- [ ] Database seeded with initial Super Admin user
- [ ] Google Gemini or OpenAI API keys verified in **System Settings**
- [ ] Pre-flight validation checks pass on client workspace
- [ ] Prominent **START DIGITAL MARKETING** button activated with Execution ID
- [ ] Daily report synthesized and delivered to Client Portal
