import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, BarChart3, TrendingUp, UserCheck, ShieldCheck, 
  Sparkles, CheckCircle2, ArrowRight, ExternalLink, Megaphone, Share2 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { DailyReport, MarketingProject, Lead } from '../../types';

export const ClientOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeClient } = useAuthStore();
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeClient) {
      Promise.all([
        api.getReports(activeClient.id),
        api.getLeads(activeClient.id),
        api.getProjects(activeClient.id),
        api.getAnalytics(activeClient.id)
      ]).then(([repRes, leadRes, projRes, anaRes]) => {
        setReports(repRes);
        setLeads(leadRes);
        setProjects(projRes);
        setAnalytics(anaRes);
        setLoading(false);
      }).catch(console.error);
    }
  }, [activeClient]);

  const latestReport = reports[0];
  const activeProj = projects[0];

  const growthData = analytics?.traffic_overview || [
    { date: 'Day 1', organic: 140, paid: 90 },
    { date: 'Day 5', organic: 220, paid: 160 },
    { date: 'Day 10', organic: 340, paid: 240 },
    { date: 'Day 15', organic: 480, paid: 350 },
    { date: 'Day 20', organic: 620, paid: 480 },
    { date: 'Day 25', organic: 790, paid: 610 },
    { date: 'Day 30', organic: 980, paid: 740 },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-2xl glass-panel p-6 sm:p-8 border border-brand-500/20 overflow-hidden bg-gradient-to-r from-brand-950/60 via-dark-card to-dark-bg">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Growth Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {activeClient?.company_name || 'Partner Workspace'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            Your 30-day AI digital marketing engine is actively monitoring search rankings, deploying ad creatives, and scoring inbound customer leads.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Campaign Status</span>
          <p className="text-xl font-extrabold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{activeProj?.status || 'Active'}</span>
          </p>
          <span className="text-[10px] text-gray-400 block font-mono">
            {activeProj?.current_campaign_execution_id || 'EXEC-APEX-ACTIVE'}
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Inbound Leads</span>
          <p className="text-xl font-extrabold text-white">+{leads.length}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">High Intent Pipeline</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Target ROAS</span>
          <p className="text-xl font-extrabold text-brand-400">4.1x</p>
          <span className="text-[10px] text-gray-400 font-semibold">Across Google & Meta</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">SEO Health Score</span>
          <p className="text-xl font-extrabold text-accent-emerald">94/100</p>
          <span className="text-[10px] text-gray-400 font-semibold">0 Critical Site Errors</span>
        </div>
      </div>

      {/* Growth Velocity Graph & Latest Executive Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Cumulative Traffic & Search Impression Lift</h3>
              <p className="text-xs text-gray-400">Organic Search vs Targeted Paid Visitors</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorClientOrg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClientPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0E8FE8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0E8FE8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="organic" stroke="#10B981" fillOpacity={1} fill="url(#colorClientOrg)" />
                <Area type="monotone" dataKey="paid" stroke="#0E8FE8" fillOpacity={1} fill="url(#colorClientPaid)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Report Digest */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-400 block mb-1">Latest AI Daily Digest</span>
            <h3 className="text-sm font-bold text-white">{latestReport?.title || 'Daily AI Marketing Report'}</h3>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              {latestReport?.executive_summary?.headline || 'Marketing operations active across Search, Paid, and Social channels.'}
            </p>

            {latestReport?.executive_summary?.key_highlights && (
              <ul className="space-y-1 mt-3 text-[11px] text-gray-400">
                {latestReport.executive_summary.key_highlights.slice(0, 3).map((h: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="truncate">{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => navigate('/portal/reports')}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-brand-400 text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Full Report Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
