import React, { useState } from 'react';
import { 
  BookOpen, Rocket, CheckCircle2, ShieldCheck, 
  HelpCircle, Sparkles, Key, FileText, ChevronRight,
  Search, Users, Package, Briefcase, Network, BarChart3,
  CheckSquare, ArrowRight, Play, Pause, Square, AlertTriangle,
  Download, Printer, Megaphone, Share2, Star, Cpu, Lock,
  Building2, UserCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const ClientUserGuide: React.FC = () => {
  const { user } = useAuthStore();
  const [guideType, setGuideType] = useState<'admin' | 'client' | 'process' | 'agents'>(
    user?.role === 'client' ? 'client' : 'admin'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAccordion, setActiveAccordion] = useState<string | null>('admin-1');

  // Interactive Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'profile-created': true,
    'knowledge-base-added': true,
    'integrations-verified': true,
    'strategy-approved': true,
    'marketing-activated': false,
    'daily-report-reviewed': false,
  });

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / Object.keys(checklist).length) * 100);

  const toggleAccordion = (id: string) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto text-white">
      {/* Top Banner */}
      <div className="relative rounded-2xl glass-panel p-6 sm:p-8 border border-brand-500/20 overflow-hidden bg-gradient-to-r from-brand-950/80 via-dark-card to-dark-bg">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Platform Documentation & Handbook</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            OmniFlow AI User Guide & Operational Manual
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Comprehensive step-by-step operating guidelines, full lifecycle workflow maps, administrator controls, and client portal handbook.
          </p>
        </div>
      </div>

      {/* Interactive Onboarding Progress Tracker */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 bg-gradient-to-b from-dark-card to-dark-bg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Platform Onboarding & Launch Checklist</span>
            </h3>
            <p className="text-xs text-gray-400">Track your workspace readiness before launching autonomous marketing</p>
          </div>
          <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            {progressPercent}% Completed ({completedCount}/{Object.keys(checklist).length})
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 to-accent-purple transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs">
          {[
            { id: 'profile-created', label: '1. Register Client Workspace & Profile' },
            { id: 'knowledge-base-added', label: '2. Add Products & Services Knowledge' },
            { id: 'integrations-verified', label: '3. Verify Integrations & Live Adapters' },
            { id: 'strategy-approved', label: '4. Review & Approve 30-Day Strategy' },
            { id: 'marketing-activated', label: '5. Click "START DIGITAL MARKETING"' },
            { id: 'daily-report-reviewed', label: '6. Review Daily Performance Report' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                checklist[item.id]
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center ${
                checklist[item.id] ? 'bg-emerald-500 text-white' : 'border border-gray-500'
              }`}>
                {checklist[item.id] && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <span className="font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2 text-xs">
        {[
          { id: 'process', label: 'Full Process Lifecycle', icon: Rocket },
          { id: 'admin', label: 'Admin Operations Guide', icon: ShieldCheck },
          { id: 'client', label: 'Client Portal Guide', icon: Users },
          { id: 'agents', label: 'AI Agents Architecture', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setGuideType(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                guideType === tab.id
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ----------------- TAB 1: FULL PROCESS LIFECYCLE ----------------- */}
      {guideType === 'process' && (
        <div className="space-y-6 text-xs text-gray-300 animate-in fade-in">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-brand-400" />
              <span>End-to-End Operational Lifecycle: From Onboarding to Daily Reports</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              OmniFlow AI executes a continuous, persistent, closed-loop marketing workflow. The diagram and steps below illustrate how client data flows into the knowledge base, activates the orchestrator, runs autonomous background tasks, and produces verified client-ready reporting.
            </p>
          </div>

          {/* Step-by-Step Flow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                step: 'Step 1',
                title: 'Client Workspace Onboarding',
                desc: 'Admin registers the client organization with company name, domain, industry vertical, target countries/cities, monthly marketing budget, and brand tone guidelines. Each client receives a segregated tenant workspace.',
                badge: 'Multi-Tenant Isolation'
              },
              {
                step: 'Step 2',
                title: 'Product & Service Knowledge Base Ingestion',
                desc: 'Admin adds products and services with exact specifications, features, benefits, target keywords, and FAQs. The AI strictly references this knowledge base as factual ground truth without inventing specifications.',
                badge: 'Fact Grounding'
              },
              {
                step: 'Step 3',
                title: 'Integration Layer Verification',
                desc: 'Admin connects third-party APIs (Google Search Console, GA4, Google Ads, Meta Ads, WordPress, HubSpot). Adapters support automated connection testing and live/mock simulation toggle.',
                badge: 'Modular Adapters'
              },
              {
                step: 'Step 4',
                title: 'Strategy & 30-Day Plan Generation',
                desc: 'The Marketing Orchestrator synthesizes a comprehensive 30-day omnichannel strategy with target buyer personas, channel-specific budget allocations, and 4 operational phases.',
                badge: 'Orchestrator AI'
              },
              {
                step: 'Step 5',
                title: 'START DIGITAL MARKETING Activation',
                desc: 'Admin clicks the prominent START button. System executes pre-flight checks, generates an idempotent Campaign Execution ID, queues persistent database tasks, and dispatches background AI agents.',
                badge: 'Idempotent Execution'
              },
              {
                step: 'Step 6',
                title: 'Multi-Agent Autonomous Execution',
                desc: 'Specialized agents execute day-by-day tasks: Market Research, SEO Audits, Keyword Discovery, Content Drafting, Social Scheduling, Ad ROAS Optimization, and Lead Scoring.',
                badge: '8 Specialized Agents'
              },
              {
                step: 'Step 7',
                title: 'Human Approval & Safety Gate',
                desc: 'Low-risk actions (research, SEO checks) are auto-approved. High-impact public actions (blog publishing, ad spend adjustments) require review and authorization in the Approval Center.',
                badge: 'Safety Controls'
              },
              {
                step: 'Step 8',
                title: 'Daily Reporting & Client Portal Sync',
                desc: 'Every morning at 00:00 UTC, the Reporting Agent synthesizes a comprehensive executive summary with SEO clicks, ROAS metrics, new qualified MQLs, and next-day agendas. The client logs in to view or download.',
                badge: 'Automated Reporting'
              }
            ].map((item, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    {item.step}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold">{item.badge}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-gray-300 text-[11px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: ADMIN OPERATIONS GUIDE ----------------- */}
      {guideType === 'admin' && (
        <div className="space-y-4 text-xs text-gray-300 animate-in fade-in">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              <span>Administrator & Operations Manual</span>
            </h2>
            <p className="text-xs text-gray-400">
              Detailed operational walkthroughs covering every administrative action in the OmniFlow platform.
            </p>
          </div>

          {[
            {
              id: 'admin-1',
              title: '1. How to Create and Manage Client Workspaces',
              icon: Building2,
              content: (
                <div className="space-y-3">
                  <p>To register a new client workspace in the platform:</p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-gray-300">
                    <li>Navigate to <strong>Clients Directory</strong> from the sidebar menu.</li>
                    <li>Click the <strong>Register New Client</strong> button in the top-right header.</li>
                    <li>Fill in the required business details:
                      <ul className="list-disc pl-4 mt-1 text-gray-400 space-y-1">
                        <li><strong>Company Name & Website:</strong> Exact business name and primary domain.</li>
                        <li><strong>Industry Vertical:</strong> Defines sector terminology (e.g. Healthcare SaaS, D2C Clean Beauty).</li>
                        <li><strong>Target Countries & Cities:</strong> Geographic markets for SEO and ad targeting.</li>
                        <li><strong>Monthly Budget ($):</strong> Total planned ad spend and execution budget.</li>
                        <li><strong>Target Audience & Brand Tone:</strong> Key demographic descriptions and voice guidelines.</li>
                      </ul>
                    </li>
                    <li>Click <strong>Create Client Workspace</strong>. The system provisions a dedicated tenant space with zero cross-client data exposure.</li>
                  </ol>
                </div>
              )
            },
            {
              id: 'admin-2',
              title: '2. How to Add Products and Services to the Knowledge Base',
              icon: Package,
              content: (
                <div className="space-y-3">
                  <p>The AI Specialized Agents strictly reference the client's registered products and services to craft factual campaigns without hallucinations:</p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-gray-300">
                    <li>Open the client workspace from <strong>Clients Directory</strong> or the top workspace selector.</li>
                    <li>Select the <strong>Products</strong> tab and click <strong>Add Product</strong>. Provide the exact SKU, category, description, price, features, and target keywords.</li>
                    <li>Select the <strong>Services</strong> tab and click <strong>Add Service</strong>. Provide service scope, pricing model, conversion goals, and FAQs.</li>
                    <li><strong>Important Rule:</strong> Never invent product certifications, guarantees, discounts, or specifications. The AI agents adhere strictly to this knowledge repository.</li>
                  </ol>
                </div>
              )
            },
            {
              id: 'admin-3',
              title: '3. How to Configure and Test Integration Adapters',
              icon: Network,
              content: (
                <div className="space-y-3">
                  <p>Connect client marketing and analytics channels via the modular integration layer:</p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-gray-300">
                    <li>Navigate to <strong>Integrations Hub</strong> in the sidebar.</li>
                    <li>Locate the target provider card (e.g. <em>Google Search Console, Google Ads, Meta Marketing, LinkedIn, WordPress, HubSpot, Brevo</em>).</li>
                    <li>Click <strong>Connect</strong> and enter API keys or OAuth credentials.</li>
                    <li>Click <strong>Test API</strong> to run an instant authentication health check. The adapter will verify permission scopes, token expiry, and return live status.</li>
                    <li>If live API keys are not yet supplied, the system automatically runs in <strong>Simulated Live Mode</strong> with realistic metrics.</li>
                  </ol>
                </div>
              )
            },
            {
              id: 'admin-4',
              title: '4. How to Generate, Customize, and Approve Strategies',
              icon: Sparkles,
              content: (
                <div className="space-y-3">
                  <p>Before launching marketing campaigns, generate the AI 30-Day Strategic Plan:</p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-gray-300">
                    <li>Navigate to <strong>Marketing Projects</strong> in the sidebar.</li>
                    <li>Click <strong>Generate AI Strategy</strong>. The Marketing Orchestrator Agent reads the client's products, audience, and budget to synthesize:
                      <ul className="list-disc pl-4 mt-1 text-gray-400 space-y-1">
                        <li><strong>Target ICP Personas:</strong> Buyer pain points, decision triggers, and core value hooks.</li>
                        <li><strong>Channel Allocations:</strong> Budget splits across Google Search, Meta Ads, SEO, and Email Nurture.</li>
                        <li><strong>30-Day Operational Phases:</strong> 4 strategic milestone weeks.</li>
                      </ul>
                    </li>
                    <li>Review the AI rationale and click <strong>Approve Strategy</strong> to lock the campaign blueprint.</li>
                  </ol>
                </div>
              )
            },
            {
              id: 'admin-5',
              title: '5. The "START DIGITAL MARKETING" Activation Workflow',
              icon: Rocket,
              content: (
                <div className="space-y-3">
                  <p>The prominent <strong>START DIGITAL MARKETING</strong> button triggers the autonomous execution engine:</p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-gray-300">
                    <li>Click the glowing <strong>START DIGITAL MARKETING</strong> button in the top banner or project page.</li>
                    <li>The system opens the pre-flight validation modal and checks:
                      <ul className="list-disc pl-4 mt-1 text-gray-400 space-y-1">
                        <li>✓ Company profile & website URL populated</li>
                        <li>✓ At least 1 product or service registered in Knowledge Base</li>
                        <li>✓ Marketing objectives and target audience defined</li>
                        <li>✓ Monthly budget configured ($ &gt; 0)</li>
                        <li>✓ Brand tone voice guidelines set</li>
                      </ul>
                    </li>
                    <li>Click <strong>START DIGITAL MARKETING</strong>. The engine generates a unique Execution ID (e.g. <code>EXEC-APEX-20261001-A9F821</code>), creates persistent database tasks, triggers background agents, and renders celebratory confetti.</li>
                    <li>The activation is 100% idempotent—repeated clicks will not spawn duplicate campaigns.</li>
                  </ol>
                </div>
              )
            },
            {
              id: 'admin-6',
              title: '6. How to Review and Authorize in the Approval Center',
              icon: CheckSquare,
              content: (
                <div className="space-y-3">
                  <p>Maintain safety control over high-impact marketing activities:</p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-gray-300">
                    <li>Navigate to <strong>Approval Center</strong> in the sidebar.</li>
                    <li>Review pending cards (e.g. <em>Public Blog Publishing, Social Media Distribution, Ad Budget Increases</em>).</li>
                    <li>Inspect the generated content preview, target keywords, and risk impact rating.</li>
                    <li>Click <strong>Authorize & Publish</strong> to immediately push live to WordPress/Meta/Google, or click <strong>Reject / Request Changes</strong> with reviewer notes for AI revision.</li>
                  </ol>
                </div>
              )
            },
            {
              id: 'admin-7',
              title: '7. How to Pause, Resume, and Stop Campaigns',
              icon: Pause,
              content: (
                <div className="space-y-3">
                  <p>Manage running marketing campaigns with instant controls:</p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-gray-300">
                    <li>Navigate to <strong>Marketing Projects</strong>.</li>
                    <li><strong>Pause:</strong> Temporarily halts future scheduled tasks while preserving active ad sets and rankings.</li>
                    <li><strong>Resume:</strong> Re-activates background task runners and resumes scheduled post publishing.</li>
                    <li><strong>Stop:</strong> Marks future pending tasks as Cancelled to prevent automated execution while safely preserving all historical logs and reports.</li>
                  </ol>
                </div>
              )
            },
            {
              id: 'admin-8',
              title: '8. How to Read and Export Daily Marketing Reports',
              icon: BarChart3,
              content: (
                <div className="space-y-3">
                  <p>Access synthesized multi-channel marketing intelligence:</p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-gray-300">
                    <li>Navigate to <strong>Reports & Analytics</strong>.</li>
                    <li>Select any date from the report archive sidebar to view the Executive Summary, SEO organic clicks, Paid Ad ROAS, and captured leads.</li>
                    <li>Click <strong>Print / PDF</strong> to generate a client-ready export document.</li>
                    <li>Click <strong>Synthesize Fresh Daily Report</strong> to trigger the Reporting Agent for an immediate on-demand report.</li>
                  </ol>
                </div>
              )
            }
          ].map((item) => {
            const Icon = item.icon;
            const isOpen = activeAccordion === item.id;
            return (
              <div key={item.id} className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-sm">{item.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-90 text-brand-400' : ''
                  }`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 bg-dark-bg/40">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ----------------- TAB 3: CLIENT PORTAL GUIDE ----------------- */}
      {guideType === 'client' && (
        <div className="space-y-4 text-xs text-gray-300 animate-in fade-in">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-400" />
              <span>Client Portal User Handbook</span>
            </h2>
            <p className="text-xs text-gray-400">
              How client organization stakeholders can monitor marketing progress, review leads, and access daily reports.
            </p>
          </div>

          {[
            {
              id: 'client-1',
              title: '1. How to Log In Securely to the Client Portal',
              icon: Lock,
              content: (
                <div className="space-y-2">
                  <p>Clients log in at the primary portal URL with their organization credentials:</p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li>Enter your registered business email and password.</li>
                    <li>Alternatively, on the demo environment, click the quick 1-click button for <strong>Apex Health</strong> or <strong>LuxeAura</strong>.</li>
                    <li>The system authenticates your JWT session and opens your isolated client portal with zero access to other organizations.</li>
                  </ul>
                </div>
              )
            },
            {
              id: 'client-2',
              title: '2. Understanding the Executive Dashboard & Marketing Status',
              icon: BarChart3,
              content: (
                <div className="space-y-2">
                  <p>The <strong>Overview</strong> page displays a real-time snapshot of your campaign health:</p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li><strong>Execution Status:</strong> Displays whether campaigns are Active, Paused, or Optimizing.</li>
                    <li><strong>Inbound Leads:</strong> Total new customer inquiries captured across all channels.</li>
                    <li><strong>Blended ROAS:</strong> Return on ad spend achieved across Google Search and Meta Ads.</li>
                    <li><strong>Traffic Lift Graph:</strong> Organic search growth velocity compared to paid visitors.</li>
                  </ul>
                </div>
              )
            },
            {
              id: 'client-3',
              title: '3. How to Read and Download Daily Performance Reports',
              icon: FileText,
              content: (
                <div className="space-y-2">
                  <p>Access synthesized daily reports generated every 24 hours:</p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li>Navigate to <strong>Marketing Reports</strong> from the sidebar.</li>
                    <li>Click on any report date from the archive column to read the executive summary and channel breakdown.</li>
                    <li>Click <strong>Print / Save PDF</strong> in the top header to save a formatted document for your executive team or board.</li>
                  </ul>
                </div>
              )
            },
            {
              id: 'client-4',
              title: '4. How to View and Qualify Captured Inbound Leads',
              icon: UserCheck,
              content: (
                <div className="space-y-2">
                  <p>Review customer leads captured by automated search and ad funnels:</p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li>Navigate to the <strong>Leads</strong> tab in your portal.</li>
                    <li>View contact name, email, company, and channel source (e.g. <em>Google Ads, LinkedIn</em>).</li>
                    <li><strong>AI Lead Score (0-100):</strong> Evaluates purchase intent and decision-maker fit. Scores of 90+ indicate immediate priority for sales outreach.</li>
                    <li>Inspect estimated contract value and automated qualification notes.</li>
                  </ul>
                </div>
              )
            },
            {
              id: 'client-5',
              title: '5. How to Review Published SEO Articles and Content',
              icon: Share2,
              content: (
                <div className="space-y-2">
                  <p>Explore all published digital assets under the <strong>Content Library</strong> tab:</p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li>Read published cornerstone SEO blog articles, meta descriptions, and target keyword rankings.</li>
                    <li>Review LinkedIn thought-leadership posts with likes, comments, and organic reach impressions.</li>
                    <li>Click <strong>View Live</strong> to visit the live published post on your domain or social account.</li>
                  </ul>
                </div>
              )
            },
            {
              id: 'client-6',
              title: '6. How to Submit Feedback or Request Campaign Changes',
              icon: HelpCircle,
              content: (
                <div className="space-y-2">
                  <p>To request adjustments to your marketing strategy or budget:</p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li>Contact your assigned Marketing Manager listed in your workspace profile.</li>
                    <li>If content items are awaiting review in the Approval Center, you can submit feedback directly in the reviewer notes field before authorizing publication.</li>
                  </ul>
                </div>
              )
            }
          ].map((item) => {
            const Icon = item.icon;
            const isOpen = activeAccordion === item.id;
            return (
              <div key={item.id} className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-sm">{item.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-90 text-accent-cyan' : ''
                  }`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 bg-dark-bg/40">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ----------------- TAB 4: AI AGENTS ARCHITECTURE ----------------- */}
      {guideType === 'agents' && (
        <div className="space-y-6 text-xs text-gray-300 animate-in fade-in">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent-purple" />
              <span>Autonomous AI Agents Architecture & Specialist Roles</span>
            </h2>
            <p className="text-xs text-gray-400">
              The Marketing Orchestrator delegates tasks to 8 specialized agents, each governed by domain-specific prompt engineering and safety parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Marketing Orchestrator Agent',
                role: 'Central Workflow Engine',
                desc: 'Receives client marketing goals, reads product knowledge base, validates pre-flight readiness, creates 30-day phase roadmap, and dispatches tasks to specialist agents.',
                model: 'Gemini 1.5 Pro / GPT-4o'
              },
              {
                name: 'Market Research Agent',
                role: 'Competitor & ICP Specialist',
                desc: 'Conducts market landscape research, analyzes competitor weaknesses, discovers underserved niche segments, and identifies high-converting messaging angles.',
                model: 'Gemini 1.5 Pro'
              },
              {
                name: 'SEO Agent',
                role: 'Technical & On-Page SEO',
                desc: 'Audits Core Web Vitals, analyzes internal link graphs, discovers high-intent commercial keywords, and monitors Search Console position movements.',
                model: 'Gemini 1.5 Pro'
              },
              {
                name: 'Content Creation Agent',
                role: 'High-Conversion Copywriting',
                desc: 'Drafts cornerstone long-form blog articles, LinkedIn thought-leadership posts, email newsletter sequences, and high-CTR ad copy based strictly on factual knowledge base.',
                model: 'Gemini 1.5 Pro / GPT-4o'
              },
              {
                name: 'Social Media Agent',
                role: 'Distribution & Scheduling',
                desc: 'Formats platform-tailored post variations for LinkedIn, Meta, and Instagram, organizes weekly publishing calendars, and monitors engagement loops.',
                model: 'Gemini 1.5 Pro'
              },
              {
                name: 'Advertising Agent',
                role: 'PPC & Retargeting Optimization',
                desc: 'Structures Google Search campaigns, creates negative keyword lists, deploys Meta video retargeting ad sets, and enforces daily spend safety caps.',
                model: 'Gemini 1.5 Pro'
              },
              {
                name: 'Lead Generation Agent',
                role: 'MQL Scoring & CRM Sync',
                desc: 'Captures form submissions, scores leads from 0 to 100 based on title and intent, tags lifecycle stages, and synchronizes qualified MQLs with HubSpot CRM.',
                model: 'Gemini 1.5 Pro'
              },
              {
                name: 'Reporting Agent',
                role: 'Daily Executive Digests',
                desc: 'Synthesizes daily multi-channel performance digests, summarizes completed tasks, highlights ranking improvements, and charts next-day action agendas.',
                model: 'Gemini 1.5 Pro'
              },
            ].map((agent, i) => (
              <div key={i} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {agent.role}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">{agent.model}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                <p className="text-[11px] text-gray-300 leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
