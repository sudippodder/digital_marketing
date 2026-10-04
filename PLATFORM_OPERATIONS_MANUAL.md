# OmniFlow AI — Full Platform Process, Administrator & User Guide

---

## 📑 Table of Contents
1. [End-to-End Platform Operational Lifecycle](#1-end-to-end-platform-operational-lifecycle)
2. [Complete Administrator Operations Guide](#2-complete-administrator-operations-guide)
3. [Client Portal User Handbook](#3-client-portal-user-handbook)
4. [Autonomous AI Agents Architecture](#4-autonomous-ai-agents-architecture)
5. [The "START DIGITAL MARKETING" Activation Workflow](#5-the-start-digital-marketing-activation-workflow)
6. [Pre-Seeded Demo Credentials & Fast Onboarding](#6-pre-seeded-demo-credentials--fast-onboarding)

---

## 1. End-to-End Platform Operational Lifecycle

OmniFlow AI executes a continuous, persistent, closed-loop marketing workflow:

```
[1. Client Onboarding]
       ↓ (Segregated tenant workspace created)
[2. Knowledge Base Ingestion]
       ↓ (Products & Services registered with exact specs)
[3. Integration Layer Configuration]
       ↓ (Google Search Console, GA4, Ads, Meta, WordPress, HubSpot)
[4. Strategy & 30-Day Plan Generation]
       ↓ (Orchestrator generates target personas & channel budgets)
[5. START DIGITAL MARKETING Button]
       ↓ (Pre-flight validation checklist → Idempotent Execution ID)
[6. Multi-Agent Autonomous Execution Queue]
       ↓ (Market Research, SEO, Content, Social, Ads, Leads, Analytics)
[7. Human Approval & Safety Checkpoint]
       ↓ (Public blog posts & ad spend changes reviewed)
[8. Daily Executive Performance Report]
       ↓ (Auto-synthesized at 00:00 UTC & pushed to Client Portal)
```

---

## 2. Complete Administrator Operations Guide

### A. How to Create and Manage Client Workspaces
1. Navigate to **Clients Directory** (`/clients`) from the sidebar.
2. Click **Register New Client** in the top header.
3. Fill in the required fields:
   - **Company Name & Website**: The legal business name and primary domain.
   - **Industry Vertical**: Specific industry (e.g. *Healthcare SaaS, Clean Beauty D2C, Solar Energy*).
   - **Target Countries & Cities**: Geographies for SEO and paid search targeting.
   - **Monthly Marketing Budget ($)**: Total planned ad spend and execution budget.
   - **Target Audience Profile**: Detailed decision-maker / buyer persona demographics.
   - **Brand Tone & Voice**: Guidelines for writing style (e.g. *Clinical, Authoritative, Minimalist*).
4. Click **Create Client Workspace**. The platform provisions a dedicated multi-tenant space.

### B. How to Build the Knowledge Base (Products & Services)
1. Open the client workspace (`/clients/:clientId`).
2. **Products Tab**: Click **Add Product** and specify SKU, category, features, benefits, price, discount, and target keywords.
3. **Services Tab**: Click **Add Service** and provide service scope, pricing tier, landing page URL, conversion goals, and FAQs.
4. **Factual Grounding Rule**: The AI Specialized Agents strictly reference this knowledge base. Never fabricate product certifications, prices, discounts, or specifications.

### C. How to Configure & Test Third-Party Integrations
1. Navigate to **Integrations Hub** (`/integrations`).
2. Select any integration card:
   - **SEO & Analytics**: Google Search Console, Google Analytics 4 (GA4).
   - **Advertising**: Google Ads (Search & PMax), Meta Ads (Facebook & Instagram).
   - **Social & B2B**: LinkedIn Marketing Solutions.
   - **Website CMS**: WordPress / WooCommerce REST API.
   - **CRM & Email**: HubSpot CRM, Brevo (Sendinblue).
   - **Billing**: Razorpay Subscriptions.
3. Click **Connect** to store credentials.
4. Click **Test API** to run an automated connection test.
5. If live API keys are not supplied, the platform runs in **Simulated Live Mode** with realistic metrics.

### D. How to Generate and Approve the 30-Day Strategy
1. Navigate to **Marketing Projects** (`/campaigns`).
2. Click **Generate AI Strategy**. The Marketing Orchestrator Agent reads the client profile and synthesizes:
   - Target ICP Personas with pain points and value hooks.
   - Budget allocation across Google Search, Meta Ads, SEO distribution, and CRM nurture.
   - 4 strategic execution phases (Discovery & Audit → Activation → CRO → Scale).
3. Review the strategy and click **Approve Strategy**.

### E. How to Launch with "START DIGITAL MARKETING"
1. Click the prominent **START DIGITAL MARKETING** button.
2. The system executes pre-flight checks (Company details, Knowledge items, Budget, Audience, Tone).
3. Click **START DIGITAL MARKETING** in the modal.
4. The system generates an **Execution ID** (e.g. `EXEC-APEX-20261001-A9F821`), creates day-by-day persistent tasks in the database, queues background workers, and renders confetti.

### F. How to Review Items in the Approval Center
1. Navigate to **Approval Center** (`/approvals`).
2. Filter by `Pending` to inspect drafts of blog articles, social posts, or ad spend changes.
3. Review the payload preview and risk grading (*Low, Medium, High*).
4. Click **Authorize & Publish** to push live, or click **Reject / Request Changes** with feedback notes.

### G. How to Pause, Resume, or Stop Campaigns
1. Navigate to **Marketing Projects** (`/campaigns`).
2. **Pause**: Temporarily stops execution while preserving active ad sets.
3. **Resume**: Re-activates background task runners.
4. **Stop**: Cancels future scheduled tasks while preserving all historical logs and reports.

---

## 3. Client Portal User Handbook

### A. How to Log In Securely
1. Navigate to the platform login screen (`/login`).
2. Enter your client email and password (e.g. `client@apexhealth.io` / `password123`).
3. You will be routed directly to your organization's private **Client Portal** (`/portal`).

### B. Understanding the Executive Overview Dashboard
- **Campaign Status**: Displays active execution health and campaign ID.
- **Inbound Leads**: Total new customer inquiries captured across channels.
- **Target ROAS**: Return on ad spend achieved across Google Search and Meta Ads.
- **SEO Health Score**: Real-time website technical and Core Web Vitals health score.
- **Traffic Growth Graph**: Organic search growth velocity compared to paid visitors.

### C. Reading & Downloading Daily Marketing Reports
1. Click **Marketing Reports** (`/portal/reports`) from the sidebar.
2. Select any report date from the archive column.
3. Read the executive summary, channel breakdown (SEO clicks, Ad ROAS, new leads, social reach), and next-day action agenda.
4. Click **Print / Save PDF** in the top header to save an executive summary for your team.

### D. Viewing & Qualifying Captured Leads
1. Click **Leads** (`/portal/leads`).
2. View inbound leads captured by Google and Meta ad campaigns.
3. **AI Lead Score (0-100)**: Evaluates purchase intent and decision-maker fit. Scores of 90+ indicate immediate priority for sales outreach.
4. Review estimated contract value and automated qualification notes.

### E. Reviewing Published Content & Articles
1. Click **Content Library** (`/portal/content`).
2. Browse all published cornerstone SEO blog articles, meta descriptions, and LinkedIn posts.
3. Click **View Live** to visit the live article on your domain.

---

## 4. Autonomous AI Agents Architecture

| Agent Name | Specialist Domain | Key Responsibilities | Primary Model |
| :--- | :--- | :--- | :--- |
| **Marketing Orchestrator Agent** | Central Workflow Engine | Strategy synthesis, 30-day phase roadmap, task queue dispatch, and progress monitoring. | Gemini 1.5 Pro / GPT-4o |
| **Market Research Agent** | Competitor Intelligence | Researches target ICP personas, competitor differentiation, and market opportunities. | Gemini 1.5 Pro |
| **SEO Agent** | Technical & Search Engine Rank | Audits Core Web Vitals, analyzes internal link graphs, and monitors Search Console rankings. | Gemini 1.5 Pro |
| **Content Creation Agent** | High-Conversion Copywriting | Synthesizes SEO blog articles, social media captions, and high-CTR ad copy from knowledge base. | Gemini 1.5 Pro / GPT-4o |
| **Social Media Agent** | Multi-Platform Distribution | Platform-tailored post variations for LinkedIn, Meta, Instagram, and scheduled distribution. | Gemini 1.5 Pro |
| **Advertising Agent** | PPC & ROAS Optimization | Google Search ads, negative keyword pruning, Meta video retargeting, and daily spend caps. | Gemini 1.5 Pro |
| **Lead Generation Agent** | MQL Scoring & CRM Sync | Captures form submissions, scores leads (0-100), and syncs qualified MQLs with HubSpot CRM. | Gemini 1.5 Pro |
| **Reporting Agent** | Daily Executive Digests | Synthesizes 24-hour multi-channel performance digests and next-day action agendas. | Gemini 1.5 Pro |

---

## 5. Pre-Seeded Demo Credentials

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@omniflow.ai` | `password123` | Full agency platform operations & system settings |
| **Marketing Manager** | `manager@omniflow.ai` | `password123` | Client management, campaigns & approvals |
| **Apex Health SaaS (Client)** | `client@apexhealth.io` | `password123` | B2B Healthcare SaaS Client Portal |
| **LuxeAura Cosmetics (Client)** | `client@luxeaura.com` | `password123` | D2C Clean Skincare Client Portal |
