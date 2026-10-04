import React from 'react';
import { Share2, Heart, MessageCircle, Repeat, Sparkles, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const ClientSocial: React.FC = () => {
  const { activeClient } = useAuthStore();

  const posts = [
    {
      platform: 'LinkedIn',
      date: 'Yesterday at 09:30 AM',
      body: `🚀 In modern healthcare IT, documentation shouldn't slow down clinical care. Here is how leading medical directors across the country are cutting 45% of EHR charting time with ambient AI clinical assistants...\n\n#HealthcareInnovation #ClinicalEfficiency #${activeClient?.company_name?.replace(' ', '') || 'ApexHealth'}`,
      metrics: { impressions: 4200, likes: 184, comments: 28, shares: 32 }
    },
    {
      platform: 'Meta / Instagram',
      date: '3 days ago',
      body: `Transform the way your clinic handles clinical workflows 💡✨\n\nSwipe to see how our EHR migration engineers ensure zero patient data loss during cloud onboarding.\n\n👉 Link in bio to book discovery walkthrough!`,
      metrics: { impressions: 6800, likes: 340, comments: 45, shares: 18 }
    }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Social Media & Thought Leadership</h1>
        <p className="text-xs text-gray-400">
          Autonomous multi-platform post generation, scheduled distribution, and community engagement metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400">Total Social Reach</span>
          <p className="text-2xl font-extrabold text-accent-purple">11,000+</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+34% vs last week</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400">Average Engagement</span>
          <p className="text-2xl font-extrabold text-white">4.8%</p>
          <span className="text-[10px] text-brand-400 font-semibold">2.3x Industry Benchmark</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400">Posts Published</span>
          <p className="text-2xl font-extrabold text-emerald-400">6</p>
          <span className="text-[10px] text-gray-400 font-semibold">3 Scheduled This Week</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-bold text-brand-400 uppercase text-[10px] tracking-wider">{p.platform}</span>
              <span className="text-gray-500 text-[11px]">{p.date}</span>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{p.body}</p>
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-gray-400 font-semibold text-[11px]">
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> {p.metrics.likes}</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-accent-cyan" /> {p.metrics.comments}</span>
              <span className="flex items-center gap-1"><Repeat className="w-3.5 h-3.5 text-emerald-400" /> {p.metrics.shares}</span>
              <span className="text-gray-200">👁️ {p.metrics.impressions.toLocaleString()} reach</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
