import React, { useState, useEffect } from 'react';
import { 
  Network, CheckCircle2, XCircle, RefreshCw, Key, 
  ExternalLink, ShieldCheck, Zap, AlertTriangle, Loader2 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Integration } from '../types';

export const IntegrationsHub: React.FC = () => {
  const { activeClient } = useAuthStore();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ provider: string; message: string; success: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  const availableAdapters = [
    { provider: 'google_search_console', name: 'Google Search Console', category: 'SEO & Analytics', desc: 'Real-time keyword rankings, click-through rates, and indexed search impressions.' },
    { provider: 'google_analytics', name: 'Google Analytics 4 (GA4)', category: 'SEO & Analytics', desc: 'Traffic sessions, audience demographics, user engagement, and goal conversion tracking.' },
    { provider: 'google_ads', name: 'Google Ads (Search & PMax)', category: 'Advertising', desc: 'PPC search campaigns, CPC bids, quality score, and direct conversion tracking.' },
    { provider: 'meta_marketing', name: 'Meta Ads (Facebook & IG)', category: 'Social & Ads', desc: 'Instagram Reels & Facebook ad deployment, custom audience lookalikes, and ROAS optimization.' },
    { provider: 'linkedin_marketing', name: 'LinkedIn Marketing Solutions', category: 'Social & Ads', desc: 'B2B sponsored content, InMail sponsored messages, and decision-maker lead forms.' },
    { provider: 'wordpress', name: 'WordPress REST API', category: 'Website & CMS', desc: 'Autonomous publishing of SEO blog articles, meta tags, and schema rich snippets.' },
    { provider: 'hubspot', name: 'HubSpot CRM & Marketing', category: 'CRM & Leads', desc: 'Instant synchronization of qualified inbound MQL leads and lifecycle stages.' },
    { provider: 'brevo', name: 'Brevo (Sendinblue Email)', category: 'Email Marketing', desc: 'Automated 4-step lead nurture email sequences and monthly subscriber newsletters.' },
    { provider: 'razorpay', name: 'Razorpay Subscription Billing', category: 'Billing & Payments', desc: 'Recurring subscription plans and automated client invoice settlements.' },
  ];

  const loadIntegrations = async () => {
    if (!activeClient) return;
    setLoading(true);
    try {
      const res = await api.getIntegrations(activeClient.id);
      setIntegrations(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, [activeClient]);

  const handleTestConnection = async (provider: string) => {
    setTestingProvider(provider);
    setTestResult(null);
    try {
      const res = await api.testIntegration(provider);
      setTestResult({
        provider,
        message: res.message || 'Connection verified and active.',
        success: true
      });
    } catch (err: any) {
      setTestResult({
        provider,
        message: err.message,
        success: false
      });
    } finally {
      setTestingProvider(null);
    }
  };

  const handleConnect = async (provider: any) => {
    if (!activeClient) return;
    try {
      await api.connectIntegration(activeClient.id, {
        provider_name: provider.provider,
        display_name: provider.name,
        category: provider.category,
        is_mock: false,
        account_name: `${activeClient.company_name} Official Profile`
      });
      loadIntegrations();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      await api.disconnectIntegration(integrationId);
      loadIntegrations();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">API Integration Adapter Layer</h1>
          <p className="text-xs text-gray-400">
            Connect search engines, advertising platforms, social networks, and CRM endpoints for <span className="text-brand-400 font-bold">{activeClient?.company_name}</span>
          </p>
        </div>
        <button
          onClick={loadIntegrations}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-200 font-semibold border border-white/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Integrations</span>
        </button>
      </div>

      {/* Test Result Alert Banner */}
      {testResult && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
          testResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
            <span className="font-semibold">{testResult.message}</span>
          </div>
          <button onClick={() => setTestResult(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Adapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableAdapters.map((adapter) => {
          const connectedItem = integrations.find((i) => i.provider_name === adapter.provider && i.is_connected);
          const isTesting = testingProvider === adapter.provider;

          return (
            <div
              key={adapter.provider}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                      {adapter.category}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-tight">{adapter.name}</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    connectedItem
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {connectedItem ? 'Connected' : 'Not Connected'}
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {adapter.desc}
                </p>

                {connectedItem && (
                  <div className="p-2.5 rounded-xl bg-dark-bg/80 border border-white/5 text-[11px] text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Account:</span>
                      <span className="text-gray-200 font-medium truncate max-w-[140px]">{connectedItem.account_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adapter Mode:</span>
                      <span className="text-brand-400 font-semibold">{connectedItem.is_mock ? 'Simulated Live' : 'Direct API Key'}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs gap-2">
                <button
                  disabled={isTesting}
                  onClick={() => handleTestConnection(adapter.provider)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold transition-colors"
                >
                  {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
                  <span>Test API</span>
                </button>

                {connectedItem ? (
                  <button
                    onClick={() => handleDisconnect(connectedItem.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(adapter)}
                    className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
