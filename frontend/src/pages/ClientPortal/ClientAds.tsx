import React from 'react';
import { Megaphone, DollarSign, TrendingUp, Target, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const ClientAds: React.FC = () => {
  const { activeClient } = useAuthStore();

  const campaigns = [
    { name: 'Google Search - High Intent EHR Keywords', platform: 'Google Ads', spend: 2850, impressions: 42000, clicks: 1240, conversions: 38, cpa: 75.0, roas: '4.2x', status: 'Active' },
    { name: 'Meta Retargeting - Video Case Studies', platform: 'Meta Ads', spend: 1450, impressions: 38000, clicks: 890, conversions: 24, cpa: 60.4, roas: '4.6x', status: 'Active' }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Paid Advertising & ROAS Dashboard</h1>
        <p className="text-xs text-gray-400">
          Real-time performance across Google Ads and Meta Marketing for <span className="text-brand-400 font-bold">{activeClient?.company_name}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400">Monthly Ad Spend</span>
          <p className="text-2xl font-extrabold text-white">$4,300</p>
          <span className="text-[10px] text-gray-400 font-semibold">Under $8,500/mo cap</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400">Blended ROAS</span>
          <p className="text-2xl font-extrabold text-emerald-400">4.33x</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Above 3.5x Target</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400">Total Conversions</span>
          <p className="text-2xl font-extrabold text-accent-cyan">62</p>
          <span className="text-[10px] text-gray-400 font-semibold">Qualified Demo Bookings</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400">Average CPA</span>
          <p className="text-2xl font-extrabold text-brand-400">$69.35</p>
          <span className="text-[10px] text-emerald-400 font-semibold">-18% vs benchmark</span>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-dark-card/90 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
            <tr>
              <th className="py-3 px-4">Campaign Name</th>
              <th className="py-3 px-4">Platform</th>
              <th className="py-3 px-4">Spend</th>
              <th className="py-3 px-4">Clicks</th>
              <th className="py-3 px-4">Conversions</th>
              <th className="py-3 px-4">CPA</th>
              <th className="py-3 px-4">ROAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {campaigns.map((c, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                <td className="py-3.5 px-4 text-brand-400">{c.platform}</td>
                <td className="py-3.5 px-4 font-mono text-white">${c.spend.toLocaleString()}</td>
                <td className="py-3.5 px-4 font-mono">{c.clicks.toLocaleString()}</td>
                <td className="py-3.5 px-4 font-bold text-white">{c.conversions}</td>
                <td className="py-3.5 px-4 font-mono">${c.cpa.toFixed(2)}</td>
                <td className="py-3.5 px-4 font-extrabold text-emerald-400">{c.roas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
