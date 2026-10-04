import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Zap,
  TrendingUp,
  ShieldCheck,
  Search,
  PenTool,
  Share2,
  DollarSign,
  Users,
  Mail,
  Eye,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Play,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  Award,
  Globe,
  Lock,
  Compass,
  Cpu,
  RefreshCw,
  Clock,
  Briefcase,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setActiveClient } = useAuthStore();

  // Mobile Menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ROI Calculator State
  const [monthlySpend, setMonthlySpend] = useState<number>(3500);
  const [avgDealValue, setAvgDealValue] = useState<number>(1200);
  const [currentLeads, setCurrentLeads] = useState<number>(25);

  // Active Tab for 8 AI Agents Showcase
  const [activeAgentTab, setActiveAgentTab] = useState<number>(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Quick 1-Click Demo Login
  const handleQuickLogin = (role: 'admin' | 'client') => {
    if (role === 'admin') {
      setUser({
        id: 'usr-admin-1',
        email: 'admin@omniflow.ai',
        full_name: 'Alex Sterling',
        role: 'super_admin',
        is_active: true
      });
      setToken('demo-jwt-admin-token');
      navigate('/dashboard');
    } else {
      const clientOrg = {
        id: 'client-apex-101',
        company_name: 'Apex Health SaaS',
        contact_person: 'Dr. Sarah Lin',
        email: 'client@apexhealth.io',
        business_website: 'https://apexhealth.io',
        industry: 'Healthcare Technology',
        business_location: 'San Francisco, CA',
        target_countries: ['US', 'CA', 'UK'],
        target_cities: ['New York', 'San Francisco', 'London'],
        preferred_languages: ['en'],
        target_audience: 'Hospitals, Clinic Directors, Medical Practice Managers',
        competitor_websites: ['https://healthflow.example', 'https://medpulse.example'],
        monthly_marketing_budget: 4500.0,
        marketing_objectives: ['lead_generation', 'brand_awareness', 'seo_ranking'],
        brand_tone: 'clinical_authoritative',
        business_images: [],
        account_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUser({
        id: 'usr-client-1',
        email: 'client@apexhealth.io',
        full_name: 'Dr. Sarah Lin',
        role: 'client',
        is_active: true,
        client_id: clientOrg.id
      });
      setToken('demo-jwt-client-token');
      setActiveClient(clientOrg);
      navigate('/portal');
    }
  };


  // Calculations for Profit Multiplier
  const estimatedAgencySavings = Math.round(monthlySpend * 0.65 * 12);
  const estimatedExtraLeads = Math.round(currentLeads * 1.85);
  const estimatedNewRevenue = Math.round(estimatedExtraLeads * 0.22 * avgDealValue * 12);
  const estimatedTotalAnnualProfit = estimatedAgencySavings + estimatedNewRevenue;
  const estimatedRoiPercentage = Math.round((estimatedTotalAnnualProfit / (monthlySpend * 12)) * 100);

  const agents = [
    {
      id: 'seo',
      name: 'SEO Mastermind Agent',
      icon: Search,
      color: 'from-blue-500 to-cyan-400',
      badge: 'Organic Visibility',
      role: 'Keyword clustering, technical site audit, automated sitemap indexing & backlink gap analysis.',
      executionDetails: [
        'Crawls site structure and identifies high-intent low-difficulty keyword opportunities',
        'Auto-injects structured schema markup and OpenGraph tags',
        'Tracks daily SERP ranking changes across Google and Bing',
        'Submits URLs automatically to Google Search Console via REST API'
      ],
      clientProfitImpact: '+340% average compound increase in non-paid organic buyer traffic within 90 days.'
    },
    {
      id: 'content',
      name: 'AI Copywriter & Blog Studio Agent',
      icon: PenTool,
      color: 'from-purple-500 to-pink-500',
      badge: 'Pillar Content & Copy',
      role: 'Generates in-depth 2,500+ word SEO articles, persuasive ad copy, and high-converting landing pages.',
      executionDetails: [
        'Adheres strictly to custom client brand voice, tone persona, and compliance rules',
        'Conducts automated semantic entity optimization and internal link structuring',
        'Generates captivating headline variations with emotional hooks',
        'Pushes directly to WordPress/Webflow CMS or creates 1-click approval drafts'
      ],
      clientProfitImpact: 'Saves $4,500/month on freelance writers while producing 4x more search-indexed assets.'
    },
    {
      id: 'social',
      name: 'Social Growth & Viral Agent',
      icon: Share2,
      color: 'from-indigo-500 to-blue-600',
      badge: 'Multi-Channel Social',
      role: 'Schedules and publishes tailored posts across LinkedIn, Twitter/X, Instagram, and Facebook.',
      executionDetails: [
        'Repurposes long-form blogs into viral Twitter threads and LinkedIn carousels',
        'Identifies optimal high-engagement posting time windows based on follower analytics',
        'Drafts visual asset prompts for instant social banners',
        'Tracks engagement growth and follower conversion velocity'
      ],
      clientProfitImpact: 'Builds continuous brand authority and generates inbound pipeline without hiring social managers.'
    },
    {
      id: 'ads',
      name: 'Paid Ads Bidding & ROAS Optimizer',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-400',
      badge: 'Google & Meta Ads',
      role: 'Continuously monitors ad spend, prunes negative keywords, and reallocates budget to top-converting variants.',
      executionDetails: [
        'Monitors Google Search, Performance Max, and Meta Ads every 6 hours',
        'Automatically pauses ad sets with declining ROAS or rising CPA',
        'A/B tests ad headlines and primary copy combinations algorithmically',
        'Enforces strict client daily spending caps to prevent budget waste'
      ],
      clientProfitImpact: 'Boosts Ad Return on Ad Spend (ROAS) from an average 1.8x to 4.2x+.'
    },
    {
      id: 'leads',
      name: 'High-Intent Lead Scorer & Enricher',
      icon: Users,
      color: 'from-amber-500 to-orange-500',
      badge: 'Instant Conversion',
      role: 'Scores inbound leads in real time (0-100), enriches firmographic data, and dispatches instant hot alerts.',
      executionDetails: [
        'Captures form submissions and calculates predictive close probability',
        'Instantly pushes score 90+ hot leads to HubSpot/Salesforce and sends instant client SMS/email',
        'Enriches company size, decision-maker LinkedIn profile, and industry classification',
        'Prioritizes sales outreach so founders and sales reps talk to buyers first'
      ],
      clientProfitImpact: 'Prevents hot leads from going cold, resulting in a +310% higher demo-to-close rate.'
    },
    {
      id: 'email',
      name: 'Email Funnel & Nurture Architect',
      icon: Mail,
      color: 'from-rose-500 to-pink-500',
      badge: 'Drip Automation',
      role: 'Designs hyper-personalized email onboarding drips, cold outreach sequences, and re-engagement campaigns.',
      executionDetails: [
        'Integrates with Brevo/Sendinblue/SendGrid for automated delivery',
        'Segments contacts by behavioral triggers (website visits, content downloads)',
        'Optimizes subject lines for 45%+ open rates and 8%+ click-through rates',
        'Cleans inactive subscribers automatically to preserve sender domain reputation'
      ],
      clientProfitImpact: 'Converts latent newsletter subscribers into paying customers on complete autopilot.'
    },
    {
      id: 'competitor',
      name: 'Competitor Intelligence Radar',
      icon: Eye,
      color: 'from-cyan-500 to-blue-500',
      badge: 'Market Domination',
      role: 'Scrapes competitor ads, keyword movements, and pricing changes to uncover unfair market opportunities.',
      executionDetails: [
        'Tracks competitor Meta & Google Ad libraries for creative angle shifts',
        'Detects when competitors lose keyword positions to seize rank 1 rankings',
        'Identifies untapped customer pain points from competitor review forums',
        'Supplies the Orchestrator with weekly counter-positioning strategies'
      ],
      clientProfitImpact: 'Allows clients to outmaneuver industry incumbents at a fraction of their marketing budget.'
    },
    {
      id: 'reporting',
      name: 'Executive Performance & Daily Digest Engine',
      icon: BarChart3,
      color: 'from-emerald-400 to-green-600',
      badge: 'Transparent ROI',
      role: 'Synthesizes multi-channel metrics into daily midnight reports and clear executive action summaries.',
      executionDetails: [
        'Aggregates GSC, GA4, Google Ads, Meta, and CRM into one unified dashboard',
        'Generates AI-written executive summaries highlighting daily wins and tomorrow’s agenda',
        'Calculates real-time ROI, Customer Acquisition Cost (CAC), and pipeline value',
        'Delivers daily digests directly to the client portal and email inbox at 00:00 UTC'
      ],
      clientProfitImpact: 'Provides 100% financial clarity on every marketing dollar spent without agency smoke and mirrors.'
    }
  ];

  const faqs = [
    {
      q: 'How does OmniFlow AI differ from standard marketing agencies?',
      a: 'Traditional agencies charge $5,000–$15,000/month retainers, operate during limited office hours, and take weeks to draft blog posts or adjust ad bids. OmniFlow AI operates 24/7 with 8 specialized AI agents that execute research, content generation, keyword ranking, and ad optimization in real time at an 85% lower operating cost.'
    },
    {
      q: 'How do clients make profit using this platform?',
      a: 'Clients profit through three key levers: 1) Massive Cost Reduction by eliminating expensive outsourced labor; 2) Increased Inbound Revenue through continuous daily SEO publishing and high-intent lead scoring; and 3) Higher Ad ROAS through autonomous 24/7 bid adjustment and negative keyword pruning.'
    },
    {
      q: 'Do I have full control over what gets published publicly?',
      a: 'Yes! The platform includes a mandatory Human-In-The-Loop Approval Center. You or your client can review, edit, or 1-click approve any blog post, social campaign, or ad creative before it goes live. You can also configure automated autonomy levels once you trust the AI output.'
    },
    {
      q: 'What happens when I click the "Start Digital Marketing" button?',
      a: 'The Central Orchestrator runs a pre-flight validation check, ingests the client profile and products, creates a persistent 30-day execution matrix, and dispatches 24 prioritized tasks to the 8 specialized AI agents. Results, articles, ad campaigns, and reports begin appearing in real time.'
    },
    {
      q: 'Can I connect my real Google Ads, Meta, WordPress, and CRM accounts?',
      a: 'Absolutely. The platform features 9 enterprise integration adapters with connection testing for Google Search Console, Google Analytics 4, Google Ads, Meta Ads, LinkedIn, WordPress REST API, HubSpot CRM, Brevo, and Razorpay.'
    }
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows & Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-brand-600/20 via-purple-600/15 to-accent-cyan/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[800px] right-[-100px] w-[600px] h-[600px] bg-accent-purple/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[1800px] left-[-100px] w-[600px] h-[600px] bg-brand-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Top Sticky Glass Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#070B12]/85 border-b border-white/10 transition-all shadow-xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* 1. Left: Brand Logo & Tag */}
          <div 
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-400 to-accent-purple flex items-center justify-center shadow-lg glow-blue group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                  OmniFlow<span className="text-brand-400">.AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Autonomous
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI Digital Marketing Platform</p>
            </div>
          </div>

          {/* 2. Center: Arranged Desktop Menu Bar */}
          <nav className="hidden xl:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-inner">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('ai-agents')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              8 AI Agents
            </button>
            <button
              onClick={() => scrollToSection('profit-model')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Client Profit Model
            </button>
            <button
              onClick={() => scrollToSection('roi-calculator')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              ROI Calculator
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              FAQ
            </button>
          </nav>

          {/* 3. Right: Action Buttons & Mobile Hamburger */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => handleQuickLogin('client')}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-all shadow-sm"
              title="Log in directly as demo client: Dr. Sarah Lin (Apex Health SaaS)"
            >
              <span>Demo Client</span>
            </button>
            
            <button
              onClick={() => handleQuickLogin('admin')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-accent-purple hover:from-brand-600 hover:to-accent-purple rounded-xl shadow-lg glow-blue transition-all flex items-center gap-1.5"
              title="Log in directly as demo Super Admin: Alex Sterling"
            >
              <span>Admin Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden px-4 pt-2 pb-6 bg-[#0B0F17]/95 border-b border-white/10 backdrop-blur-2xl shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-1 pt-2">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('ai-agents')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                8 Specialized AI Agents
              </button>
              <button
                onClick={() => scrollToSection('profit-model')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Client Profit Model
              </button>
              <button
                onClick={() => scrollToSection('roi-calculator')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                ROI & Profit Calculator
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Frequently Asked Questions
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleQuickLogin('client');
                }}
                className="w-full py-2.5 text-xs font-semibold text-center text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl"
              >
                Client Portal
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 text-xs font-semibold text-center text-white bg-brand-600 hover:bg-brand-500 rounded-xl"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Glowing Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-semibold mb-8 animate-float shadow-inner">
          <Sparkles className="w-4 h-4 text-brand-400 animate-spin" />
          <span>Next-Generation Autonomous Marketing Operating System</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-ping" />
        </div>

        {/* Main Value Proposition Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          Autonomous AI Digital Marketing That Multiplies{' '}
          <span className="text-gradient">Client Profit 24/7</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Replace expensive agency retainers with a coordinated team of <strong className="text-white font-semibold">8 Specialized AI Agents</strong>. OmniFlow AI researches, plans, writes, publishes, and optimizes SEO, Google Ads, Social, and Lead funnels on complete autopilot.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => handleQuickLogin('admin')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-brand-600 to-accent-purple hover:from-brand-600 hover:to-accent-purple text-white text-base font-bold shadow-xl glow-blue flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
          >
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span>Launch Marketing Workflows</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleQuickLogin('client')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white text-base font-semibold flex items-center justify-center gap-3 transition-all shadow-lg"
          >
            <Play className="w-4 h-4 text-brand-400 fill-brand-400" />
            <span>Explore Live Client Portal</span>
          </button>
        </div>

        {/* Real-time Proof Matrix Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl border border-white/5 text-center">
            <p className="text-3xl font-extrabold text-gradient">85%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Agency Cost Saved</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/5 text-center">
            <p className="text-3xl font-extrabold text-emerald-400">+310%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Lead Conversion Rate</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/5 text-center">
            <p className="text-3xl font-extrabold text-cyan-400">4.8x</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Average Ad ROAS</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/5 text-center">
            <p className="text-3xl font-extrabold text-purple-400">24/7</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Autonomous Execution</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW THE DIGITAL MARKETING AGENT WORKS (4-Step Pipeline) */}
      <section id="how-it-works" className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Autonomous AI Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How the Digital Marketing Agent Works
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            A continuous four-stage autonomous loop that turns raw business data into compounding market dominance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-brand-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-extrabold text-lg mb-5 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Knowledge & ICP Ingestion</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              The agent ingests the client&apos;s website, target audience profiles, value propositions, competitor URLs, and compliance rules into a multi-tenant vector memory.
            </p>
            <div className="pt-3 border-t border-white/5 text-xs text-brand-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
              <span>Zero-hallucination brand alignment</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-extrabold text-lg mb-5 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="text-xl font-bold text-white mb-2">30-Day Execution Planning</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              The Central Orchestrator synthesizes high-intent keyword opportunities, creates a 30-day cross-channel schedule, and generates 24 prioritized execution tasks.
            </p>
            <div className="pt-3 border-t border-white/5 text-xs text-purple-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Structured task queue with dependencies</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg mb-5 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="text-xl font-bold text-white mb-2">8-Agent Parallel Execution</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Specialized agents write 2,500-word SEO articles, adjust Google Ads bids, schedule LinkedIn/Twitter threads, score incoming leads, and trigger email nurture drips.
            </p>
            <div className="pt-3 border-t border-white/5 text-xs text-emerald-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Human-in-the-loop approval gates</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-lg mb-5 group-hover:scale-110 transition-transform">
              04
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Self-Optimizing Daily Loop</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              At midnight UTC, the Performance Engine computes live ROI, prunes non-converting ad keywords, ranks newly indexed pages, and delivers transparent client digests.
            </p>
            <div className="pt-3 border-t border-white/5 text-xs text-amber-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Continuous algorithmic refinement</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: 8 SPECIALIZED AI AGENTS SHOWCASE */}
      <section id="ai-agents" className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
            <Bot className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence Suite</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Meet the 8 Specialized AI Agents
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Each agent is an expert trained in a single high-impact marketing discipline, collaborating seamlessly through a shared orchestrator.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Agent Selection List */}
          <div className="lg:col-span-5 space-y-2.5">
            {agents.map((agent, idx) => {
              const Icon = agent.icon;
              const isActive = activeAgentTab === idx;
              return (
                <button
                  key={agent.id}
                  onClick={() => setActiveAgentTab(idx)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between border ${
                    isActive
                      ? 'bg-slate-800/90 border-brand-500/60 shadow-lg glow-blue'
                      : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/50 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${agent.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                      <p className="text-xs text-slate-400">{agent.badge}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    isActive ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isActive ? 'Active View' : 'Inspect'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Active Agent Deep-Dive Card */}
          <div className="lg:col-span-7">
            {(() => {
              const currentAgent = agents[activeAgentTab];
              const Icon = currentAgent.icon;
              return (
                <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${currentAgent.color} opacity-10 blur-3xl rounded-full pointer-events-none`} />

                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${currentAgent.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider text-slate-300">
                        {currentAgent.badge}
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-1">{currentAgent.name}</h3>
                    </div>
                  </div>

                  <p className="text-base text-slate-200 leading-relaxed mb-6 font-medium">
                    {currentAgent.role}
                  </p>

                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
                    Autonomous Capabilities & Execution Steps:
                  </h4>
                  <div className="space-y-2.5 mb-6">
                    {currentAgent.executionDetails.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Client Profit Impact Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-teal-950/30 border border-emerald-500/30">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Direct Client Profit Impact</span>
                    </div>
                    <p className="text-sm font-semibold text-emerald-200">
                      {currentAgent.clientProfitImpact}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW CLIENTS MAKE PROFIT (The 4 Profit Multipliers) */}
      <section id="profit-model" className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Client Economics</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How Clients Make Massive Profit
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            OmniFlow AI does not just generate content — it is engineered mathematically to expand client profit margins and customer lifetime value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profit Pillar 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">1. 85% Agency Overhead Elimination</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Traditional agencies invoice $6,000–$15,000/month for a fragmented team of account managers, copywriters, and media buyers. OmniFlow AI delivers higher output velocity at a fraction of the cost, saving clients an average of <strong className="text-emerald-400">$84,000+ per year</strong> in direct overhead.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300 font-semibold">
              ✔ Instant gross margin expansion from Day 1
            </div>
          </div>

          {/* Profit Pillar 2 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">2. Zero-Cost Organic Traffic Compounding</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Instead of relying exclusively on paid clicks that disappear when ad spend stops, the AI SEO Agent continuously publishes high-intent articles and secures search rankings. This creates a permanent, compounding asset generating qualified organic buyers for years.
            </p>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-xs text-cyan-300 font-semibold">
              ✔ Lowers Customer Acquisition Cost (CAC) by up to 68%
            </div>
          </div>

          {/* Profit Pillar 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">3. Rapid Lead Conversion (Score 90+ Alerts)</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              78% of B2B sales go to the vendor who responds first. The Lead Scoring Agent evaluates inbound form submissions instantly. When an enterprise executive submits a request, it triggers immediate SMS/email notifications, increasing demo-to-close rates by 3.1x.
            </p>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-xs text-purple-300 font-semibold">
              ✔ Faster sales cycles and higher pipeline velocity
            </div>
          </div>

          {/* Profit Pillar 4 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">4. Dynamic Ad ROAS Optimization</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Human ad managers check campaigns once every few days. The Paid Ads Agent inspects ad sets multiple times daily, automatically cutting non-converting keywords and transferring daily budget to top-performing ads to prevent ad fatigue and maximize return on ad spend.
            </p>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300 font-semibold">
              ✔ Maximizes revenue return for every single ad dollar spent
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE CLIENT ROI & PROFIT CALCULATOR */}
      <section id="roi-calculator" className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-500/20">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Interactive Financial Model</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Client Profit & ROI Calculator
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Adjust the sliders below to calculate projected annual cost savings and revenue gains for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Sliders Control Panel */}
          <div className="lg:col-span-6 glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-300">Current Monthly Marketing Budget ($)</label>
                <span className="text-lg font-bold text-brand-400">${monthlySpend.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>$1,000/mo</span>
                <span>$25,000/mo</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-300">Average Customer Deal Value ($)</label>
                <span className="text-lg font-bold text-emerald-400">${avgDealValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="200"
                max="10000"
                step="200"
                value={avgDealValue}
                onChange={(e) => setAvgDealValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>$200</span>
                <span>$10,000</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-300">Current Monthly Inbound Leads</label>
                <span className="text-lg font-bold text-purple-400">{currentLeads} leads/mo</span>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={currentLeads}
                onChange={(e) => setCurrentLeads(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>5 leads</span>
                <span>300 leads</span>
              </div>
            </div>
          </div>

          {/* Dynamic Readout Card */}
          <div className="lg:col-span-6 glass-panel p-8 rounded-3xl border border-brand-500/40 relative overflow-hidden shadow-2xl glow-blue">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-gradient-to-r from-brand-500 to-accent-purple text-white text-xs font-bold uppercase tracking-wider">
              Projected 12-Month Impact
            </div>

            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
              Estimated Total Annual Value Created
            </p>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-gradient mb-6">
              +${estimatedTotalAnnualProfit.toLocaleString()}
            </h3>

            <div className="space-y-3.5 mb-8">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-white/5">
                <span className="text-sm text-slate-300">Agency & Freelance Cost Saved</span>
                <span className="text-sm font-bold text-emerald-400">+${estimatedAgencySavings.toLocaleString()}/yr</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-white/5">
                <span className="text-sm text-slate-300">New High-Intent Inbound Pipeline</span>
                <span className="text-sm font-bold text-purple-400">+{estimatedExtraLeads} extra leads/mo</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-white/5">
                <span className="text-sm text-slate-300">Projected Return on Investment (ROI)</span>
                <span className="text-sm font-bold text-cyan-400">{estimatedRoiPercentage}% ROI</span>
              </div>
            </div>

            <button
              onClick={() => handleQuickLogin('client')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 to-accent-purple hover:from-brand-600 hover:to-accent-purple text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>Unlock This Profit Model in Client Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: CLIENT SUCCESS STORIES & CASE STUDIES */}
      <section className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>Proven Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Real Clients. Autonomous Results.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Case Study 1: Apex Health SaaS */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase">
                B2B Healthcare SaaS
              </span>
              <span className="text-xs text-slate-400">90-Day Execution Cycle</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Apex Health SaaS</h3>
            <p className="text-sm text-slate-300 mb-6">
              &quot;We replaced our $8,500/mo marketing agency with OmniFlow AI. The SEO agent published 24 technical medical articles, and the lead scoring agent notified our reps within 60 seconds of demo requests.&quot;
            </p>
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
              <div>
                <p className="text-xl font-bold text-emerald-400">+340%</p>
                <p className="text-[11px] text-slate-400">Organic Clicks</p>
              </div>
              <div>
                <p className="text-xl font-bold text-brand-400">4.4x</p>
                <p className="text-[11px] text-slate-400">Google Ads ROAS</p>
              </div>
              <div>
                <p className="text-xl font-bold text-purple-400">+$42,000</p>
                <p className="text-[11px] text-slate-400">New MRR Added</p>
              </div>
            </div>
          </div>

          {/* Case Study 2: LuxeAura Cosmetics */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase">
                D2C E-Commerce
              </span>
              <span className="text-xs text-slate-400">60-Day Execution Cycle</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">LuxeAura Cosmetics</h3>
            <p className="text-sm text-slate-300 mb-6">
              &quot;The Social Growth and Meta Ads agents transformed our customer acquisition. Autonomous A/B testing of Instagram ad variations scaled our e-commerce store with zero human media buyers.&quot;
            </p>
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
              <div>
                <p className="text-xl font-bold text-emerald-400">5.2x</p>
                <p className="text-[11px] text-slate-400">Meta Ads ROAS</p>
              </div>
              <div>
                <p className="text-xl font-bold text-pink-400">-42%</p>
                <p className="text-[11px] text-slate-400">Customer CPA</p>
              </div>
              <div>
                <p className="text-xl font-bold text-cyan-400">+$68,500</p>
                <p className="text-[11px] text-slate-400">Net Profit Generated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-24 relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                  isOpen ? 'border-brand-500/50 bg-slate-900/80 shadow-lg' : 'border-white/5 bg-slate-900/40 hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-bold text-base sm:text-lg text-white">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 8: FINAL HIGH-CONVERTING CTA BANNER */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-10 sm:p-16 rounded-3xl border border-brand-500/40 text-center relative overflow-hidden shadow-2xl glow-purple bg-radial-glow">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-accent-purple flex items-center justify-center text-white mx-auto mb-6 shadow-lg glow-blue">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto">
            Ready to Put Digital Marketing on Autonomous Pilot?
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Test the live agency dashboard, explore client portals, and experience the power of 8 synchronized AI agents today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-accent-purple hover:from-brand-600 hover:to-accent-purple text-white font-bold text-base shadow-xl glow-blue flex items-center justify-center gap-2 transition-all"
            >
              <span>Enter Admin Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleQuickLogin('client')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-white font-semibold text-base transition-all"
            >
              <span>View Demo Client Workspace</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#05080E] py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-purple flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">OmniFlow AI</p>
              <p className="text-[11px] text-slate-500">Autonomous Digital Marketing SaaS Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 font-medium">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#ai-agents" className="hover:text-white transition-colors">8 AI Agents</a>
            <a href="#profit-model" className="hover:text-white transition-colors">Client Profit Model</a>
            <a href="#roi-calculator" className="hover:text-white transition-colors">ROI Calculator</a>
            <a href="/login" className="hover:text-white transition-colors">Account Login</a>
          </div>

          <p className="text-slate-500 text-center sm:text-right">
            © 2026 OmniFlow AI Inc. All rights reserved. Built for high-growth enterprises and agencies.
          </p>
        </div>
      </footer>
    </div>
  );
};
