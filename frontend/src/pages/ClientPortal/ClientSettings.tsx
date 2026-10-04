import React, { useState, useEffect } from 'react';
import { 
  Settings, User, Bell, ShieldCheck, CheckCircle2, 
  Mail, Phone, Globe, Lock, Key, Sparkles, Building2, Save 
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

export const ClientSettings: React.FC = () => {
  const { user, activeClient, setActiveClient } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'brand' | 'security'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Client Profile Form
  const [profileForm, setProfileForm] = useState({
    company_name: activeClient?.company_name || '',
    contact_person: activeClient?.contact_person || '',
    email: activeClient?.email || '',
    phone: activeClient?.phone || '',
    business_website: activeClient?.business_website || '',
    business_location: activeClient?.business_location || '',
    monthly_marketing_budget: activeClient?.monthly_marketing_budget || 5000,
    brand_tone: activeClient?.brand_tone || '',
    brand_guidelines: activeClient?.brand_guidelines || ''
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    daily_report_email: true,
    high_intent_leads_alert: true,
    weekly_executive_summary: true,
    approval_required_alert: true,
    sms_alerts: false
  });

  // Security Form
  const [securityForm, setSecurityForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (activeClient) {
      setProfileForm({
        company_name: activeClient.company_name,
        contact_person: activeClient.contact_person,
        email: activeClient.email,
        phone: activeClient.phone || '',
        business_website: activeClient.business_website,
        business_location: activeClient.business_location || '',
        monthly_marketing_budget: activeClient.monthly_marketing_budget,
        brand_tone: activeClient.brand_tone,
        brand_guidelines: activeClient.brand_guidelines || ''
      });
    }
  }, [activeClient]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient) return;
    try {
      const updated = await api.updateClient(activeClient.id, profileForm);
      setActiveClient(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.new_password !== securityForm.confirm_password) {
      alert('New passwords do not match!');
      return;
    }
    setSavedSuccess(true);
    setSecurityForm({ current_password: '', new_password: '', confirm_password: '' });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Organization & Workspace Settings</h1>
        <p className="text-xs text-gray-400">
          Manage your contact credentials, daily report dispatches, brand knowledge parameters, and security preferences
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Workspace settings successfully saved and applied!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs overflow-x-auto">
        {[
          { id: 'profile', label: 'Company Profile & Budget', icon: Building2 },
          { id: 'brand', label: 'Brand Voice & Guidelines', icon: Sparkles },
          { id: 'notifications', label: 'Email & Alert Preferences', icon: Bell },
          { id: 'security', label: 'Security & Password', icon: Lock },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
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

      {/* Tab: Company Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6 text-xs bg-dark-card/90">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">Business Profile & Target Parameters</h3>
            <p className="text-xs text-gray-400">These details guide the AI Orchestrator across all campaigns</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Company / Brand Name</label>
              <input
                type="text"
                required
                value={profileForm.company_name}
                onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Primary Website Domain</label>
              <input
                type="url"
                required
                value={profileForm.business_website}
                onChange={(e) => setProfileForm({ ...profileForm, business_website: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Contact Person Name</label>
              <input
                type="text"
                required
                value={profileForm.contact_person}
                onChange={(e) => setProfileForm({ ...profileForm, contact_person: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Primary Contact Email</label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Contact Phone Number</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Monthly Marketing Budget ($)</label>
              <input
                type="number"
                min="500"
                required
                value={profileForm.monthly_marketing_budget}
                onChange={(e) => setProfileForm({ ...profileForm, monthly_marketing_budget: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors shadow-lg shadow-brand-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Brand Voice */}
      {activeTab === 'brand' && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6 text-xs bg-dark-card/90">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">Brand Tone & Knowledge Guidelines</h3>
            <p className="text-xs text-gray-400">Instruct the Content & Social AI agents on writing style, compliance rules, and value pillars</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Brand Tone & Voice Persona</label>
              <input
                type="text"
                value={profileForm.brand_tone}
                onChange={(e) => setProfileForm({ ...profileForm, brand_tone: e.target.value })}
                placeholder="e.g. Authoritative, Clinical, Innovative & Trustworthy"
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Regulatory & Compliance Guidelines</label>
              <textarea
                rows={4}
                value={profileForm.brand_guidelines}
                onChange={(e) => setProfileForm({ ...profileForm, brand_guidelines: e.target.value })}
                placeholder="e.g. Adhere strictly to HIPAA-compliant terminology. Emphasize SOC2 security. Avoid unsupported claims."
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors shadow-lg shadow-brand-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Update Brand Guidelines</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6 text-xs bg-dark-card/90">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">Automated Delivery & Notification Preferences</h3>
            <p className="text-xs text-gray-400">Configure how and when you receive executive marketing reports and lead alerts</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'daily_report_email', title: 'Daily Marketing Digest Email', desc: 'Receive automated daily multi-channel performance digest every morning at 00:00 UTC.' },
              { id: 'high_intent_leads_alert', title: 'High-Intent Inbound Lead Alerts (Score 90+)', desc: 'Instant email notification whenever an MQL with high purchase intent is scored.' },
              { id: 'weekly_executive_summary', title: 'Weekly Strategic Performance Overview', desc: 'Summary of budget pacing, ROAS trends, and organic keyword position movements.' },
              { id: 'approval_required_alert', title: 'Pending Approval Alerts', desc: 'Receive alert when AI generates public blog or social content requiring authorization.' },
            ].map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">{item.title}</span>
                  <span className="text-[11px] text-gray-400">{item.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={(notifications as any)[item.id]}
                  onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                  className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors shadow-lg shadow-brand-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Notification Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <form onSubmit={handleUpdatePassword} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6 text-xs bg-dark-card/90 max-w-xl">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">Client Portal Password & Security</h3>
            <p className="text-xs text-gray-400">Update your secure login credentials</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Current Password</label>
              <input
                type="password"
                required
                value={securityForm.current_password}
                onChange={(e) => setSecurityForm({ ...securityForm, current_password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">New Secure Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={securityForm.new_password}
                onChange={(e) => setSecurityForm({ ...securityForm, new_password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={securityForm.confirm_password}
                onChange={(e) => setSecurityForm({ ...securityForm, confirm_password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors shadow-lg shadow-brand-500/20"
            >
              <Key className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
