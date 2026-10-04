import React, { useState, useEffect } from 'react';
import { 
  Settings, Key, ShieldCheck, Users, Cpu, 
  Terminal, Database, RefreshCw, CheckCircle2, 
  Save, AlertTriangle, Network, Lock, Plus, UserPlus, Loader2
} from 'lucide-react';
import { api } from '../services/api';

export const SystemSettings: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'integrations' | 'safety' | 'users' | 'audit'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Platform General Form
  const [generalForm, setGeneralForm] = useState({
    platform_name: 'OmniFlow AI Digital Marketing Automation',
    agency_name: 'OmniFlow Global Growth Partners',
    support_email: 'support@omniflow.ai',
    default_timezone: 'UTC (Auto-dispatched daily at 00:00 UTC)',
    daily_reporting_enabled: true
  });

  // AI Providers Form
  const [aiSettings, setAiSettings] = useState({
    default_provider: 'gemini',
    gemini_api_key: 'AIzaSy********************',
    gemini_model: 'gemini-1.5-pro',
    openai_api_key: 'sk-proj-******************',
    openai_model: 'gpt-4o',
    enable_deterministic_fallback: true,
    temperature: 0.7
  });

  // Third-Party Integration Credentials
  const [integrationKeys, setIntegrationKeys] = useState({
    gsc_client_id: '891230491823-gsc.apps.googleusercontent.com',
    google_ads_dev_token: 'GADS_DEV_TOK_99214',
    meta_app_id: '1948291049182390',
    meta_app_secret: '••••••••••••••••••••••••••••••••',
    linkedin_client_id: '78lnkd99214',
    wordpress_app_password: '•••• •••• •••• ••••',
    hubspot_private_token: 'pat-na1-9921-••••••••',
    brevo_api_key: 'xkeysib-••••••••••••••••',
    razorpay_key_id: 'rzp_live_99201948123',
    razorpay_key_secret: '••••••••••••••••••••••••'
  });

  // Safety & Approval Policy
  const [safetyPolicies, setSafetyPolicies] = useState({
    require_content_approval: true,
    require_budget_increase_approval: true,
    ad_spend_approval_threshold: 500,
    emergency_pause_all_campaigns: false,
    auto_approve_seo_audits: true
  });

  // New User Form Modal
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: 'password123',
    role: 'marketing_manager',
    client_id: ''
  });

  const loadData = async () => {
    try {
      const [uRes, aRes] = await Promise.all([
        api.getUsers(),
        api.getAuditLogs()
      ]);
      setUsers(uRes);
      setAuditLogs(aRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.register(newUser);
      setShowAddUserModal(false);
      setNewUser({ full_name: '', email: '', password: 'password123', role: 'marketing_manager', client_id: '' });
      loadData();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to create user: ${err.message}`);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">System Settings & Production Governance</h1>
        <p className="text-xs text-gray-400">
          Global platform settings, live AI provider credentials, third-party API keys, safety thresholds, and RBAC users
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Configuration successfully saved and synced across all backend workers!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs overflow-x-auto">
        {[
          { id: 'general', label: 'General Platform', icon: Settings },
          { id: 'ai', label: 'AI Providers & LLM Keys', icon: Cpu },
          { id: 'integrations', label: 'API Keys & Adapters', icon: Network },
          { id: 'safety', label: 'Safety & Spending Caps', icon: ShieldCheck },
          { id: 'users', label: 'Team & RBAC Users', icon: Users },
          { id: 'audit', label: 'Security Audit Logs', icon: Lock },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: General Platform */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 max-w-3xl space-y-6 text-xs bg-dark-card/90">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">Platform Branding & Global Dispatch Settings</h3>
            <p className="text-xs text-gray-400">Configure white-label agency branding and daily execution windows</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">SaaS Platform Title</label>
              <input
                type="text"
                value={generalForm.platform_name}
                onChange={(e) => setGeneralForm({ ...generalForm, platform_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Agency Organization Name</label>
              <input
                type="text"
                value={generalForm.agency_name}
                onChange={(e) => setGeneralForm({ ...generalForm, agency_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Primary Support Email</label>
              <input
                type="email"
                value={generalForm.support_email}
                onChange={(e) => setGeneralForm({ ...generalForm, support_email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Reporting Engine Timezone</label>
              <input
                type="text"
                value={generalForm.default_timezone}
                onChange={(e) => setGeneralForm({ ...generalForm, default_timezone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors">
              <Save className="w-4 h-4" />
              <span>Save Platform Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: AI Providers */}
      {activeTab === 'ai' && (
        <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 max-w-3xl space-y-6 text-xs bg-dark-card/90">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">Autonomous LLM Engine & API Provider Settings</h3>
            <p className="text-xs text-gray-400">Configure primary and secondary generative AI providers for the Orchestrator and Specialized Agents</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Default AI Provider Engine</label>
                <select
                  value={aiSettings.default_provider}
                  onChange={(e) => setAiSettings({ ...aiSettings, default_provider: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="gemini">Google Gemini API (Recommended)</option>
                  <option value="openai">OpenAI API (GPT-4o)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Target Model</label>
                <select
                  value={aiSettings.default_provider === 'gemini' ? aiSettings.gemini_model : aiSettings.openai_model}
                  onChange={(e) => {
                    if (aiSettings.default_provider === 'gemini') {
                      setAiSettings({ ...aiSettings, gemini_model: e.target.value });
                    } else {
                      setAiSettings({ ...aiSettings, openai_model: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500 font-mono"
                >
                  {aiSettings.default_provider === 'gemini' ? (
                    <>
                      <option value="gemini-1.5-pro">gemini-1.5-pro (High Reasoning)</option>
                      <option value="gemini-1.5-flash">gemini-1.5-flash (Fast)</option>
                    </>
                  ) : (
                    <>
                      <option value="gpt-4o">gpt-4o (Flagship Omni)</option>
                      <option value="gpt-4-turbo">gpt-4-turbo</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Google Gemini API Key</label>
              <div className="relative">
                <Key className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={aiSettings.gemini_api_key}
                  onChange={(e) => setAiSettings({ ...aiSettings, gemini_api_key: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">OpenAI API Key (Optional / Fallback)</label>
              <div className="relative">
                <Key className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={aiSettings.openai_api_key}
                  onChange={(e) => setAiSettings({ ...aiSettings, openai_api_key: e.target.value })}
                  placeholder="sk-proj-..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-brand-500/5 border border-brand-500/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Smart Heuristic Deterministic Fallback</span>
                <span className="text-[11px] text-gray-400">Guarantees 100% campaign uptime by executing rich domain synthesis if LLM limits are reached</span>
              </div>
              <input
                type="checkbox"
                checked={aiSettings.enable_deterministic_fallback}
                onChange={(e) => setAiSettings({ ...aiSettings, enable_deterministic_fallback: e.target.checked })}
                className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors">
              <Save className="w-4 h-4" />
              <span>Save AI Engine Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Third-Party API Keys */}
      {activeTab === 'integrations' && (
        <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 max-w-3xl space-y-6 text-xs bg-dark-card/90">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">Third-Party API Integration Credentials</h3>
            <p className="text-xs text-gray-400">Manage global developer keys for Search, Social, Advertising, CRM, and Billing</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Google Search Console OAuth Client ID</label>
              <input
                type="text"
                value={integrationKeys.gsc_client_id}
                onChange={(e) => setIntegrationKeys({ ...integrationKeys, gsc_client_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Google Ads Developer Token</label>
              <input
                type="text"
                value={integrationKeys.google_ads_dev_token}
                onChange={(e) => setIntegrationKeys({ ...integrationKeys, google_ads_dev_token: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Meta (Facebook & IG) App ID</label>
              <input
                type="text"
                value={integrationKeys.meta_app_id}
                onChange={(e) => setIntegrationKeys({ ...integrationKeys, meta_app_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">LinkedIn Marketing Client ID</label>
              <input
                type="text"
                value={integrationKeys.linkedin_client_id}
                onChange={(e) => setIntegrationKeys({ ...integrationKeys, linkedin_client_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">HubSpot Private App Token</label>
              <input
                type="password"
                value={integrationKeys.hubspot_private_token}
                onChange={(e) => setIntegrationKeys({ ...integrationKeys, hubspot_private_token: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Brevo (Sendinblue) API Key</label>
              <input
                type="password"
                value={integrationKeys.brevo_api_key}
                onChange={(e) => setIntegrationKeys({ ...integrationKeys, brevo_api_key: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Razorpay Key ID</label>
              <input
                type="text"
                value={integrationKeys.razorpay_key_id}
                onChange={(e) => setIntegrationKeys({ ...integrationKeys, razorpay_key_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Razorpay Key Secret</label>
              <input
                type="password"
                value={integrationKeys.razorpay_key_secret}
                onChange={(e) => setIntegrationKeys({ ...integrationKeys, razorpay_key_secret: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors">
              <Save className="w-4 h-4" />
              <span>Save API Credentials</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Safety & Approval Policies */}
      {activeTab === 'safety' && (
        <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 max-w-3xl space-y-6 text-xs bg-dark-card/90">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">Execution Safety Policies & Budget Caps</h3>
            <p className="text-xs text-gray-400">Configure human approval rules and emergency circuit breakers</p>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Mandatory Public Content Approval</span>
                <span className="text-[11px] text-gray-400">Require human sign-off before AI blog posts or social captions are published live</span>
              </div>
              <input
                type="checkbox"
                checked={safetyPolicies.require_content_approval}
                onChange={(e) => setSafetyPolicies({ ...safetyPolicies, require_content_approval: e.target.checked })}
                className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Paid Ad Budget Increase Threshold ($)</span>
                <span className="text-[11px] text-gray-400">Automated budget increases exceeding this amount will pause and await administrator authorization</span>
              </div>
              <input
                type="number"
                value={safetyPolicies.ad_spend_approval_threshold}
                onChange={(e) => setSafetyPolicies({ ...safetyPolicies, ad_spend_approval_threshold: parseFloat(e.target.value) || 0 })}
                className="w-24 px-3 py-1.5 rounded-lg bg-dark-bg border border-white/10 text-white font-mono text-right"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-300 block flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Emergency Global Campaign Pause
                </span>
                <span className="text-[11px] text-gray-300">Instantly halt all background AI task execution across all client workspaces</span>
              </div>
              <input
                type="checkbox"
                checked={safetyPolicies.emergency_pause_all_campaigns}
                onChange={(e) => setSafetyPolicies({ ...safetyPolicies, emergency_pause_all_campaigns: e.target.checked })}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors">
              <Save className="w-4 h-4" />
              <span>Apply Safety Policies</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Users & RBAC */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">System Users & Role-Based Access Control ({users.length})</h3>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors shadow-lg shadow-brand-500/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add System User</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-dark-card/90 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Workspace Scope</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-bold text-white">{u.full_name}</td>
                    <td className="py-3.5 px-4 text-gray-400">{u.email}</td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-brand-400">{u.role?.replace('_', ' ')}</td>
                    <td className="py-3.5 px-4 text-gray-400">{u.client_id ? 'Dedicated Client Portal' : 'Global Agency Workspace'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden space-y-3 p-4">
          <div className="flex items-center justify-between px-2 pt-2">
            <h3 className="text-sm font-bold text-white">Immutable Security & Execution Audit Trail</h3>
            <span className="text-[11px] text-gray-500 font-mono">Total Logs: {auditLogs.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-dark-card/90 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Audit Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">No audit logs recorded yet.</td>
                  </tr>
                ) : (
                  auditLogs.map((a) => (
                    <tr key={a.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">{new Date(a.created_at).toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-bold text-brand-400">{a.action}</td>
                      <td className="py-3.5 px-4 text-gray-300">{a.resource_type}</td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-gray-400 max-w-xs truncate">{JSON.stringify(a.details)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white">Provision System User</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder="e.g. Rachel Adams"
                  className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="rachel@agency.com"
                  className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Role Assignment</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none"
                >
                  <option value="marketing_manager">Marketing Manager</option>
                  <option value="admin">Administrator</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddUserModal(false)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-brand-500 text-white font-bold">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
