import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Rocket, ListTodo, CheckSquare, UserCheck, 
  Cpu, DollarSign, TrendingUp, Sparkles, ArrowRight, 
  AlertTriangle, RefreshCw, BarChart2, ShieldCheck, Play
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { StartMarketingModal } from '../components/StartMarketingModal';
import { Client, MarketingTask } from '../types';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeClient } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [recentTasks, setRecentTasks] = useState<MarketingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, clientsRes] = await Promise.all([
        api.getAdminStats(),
        api.getClients()
      ]);
      setStats(statsRes);
      setClients(clientsRes);

      if (clientsRes.length > 0) {
        const firstClient = activeClient || clientsRes[0];
        const projects = await api.getProjects(firstClient.id);
        if (projects.length > 0) {
          const tasks = await api.getTasks(projects[0].id);
          setRecentTasks(tasks.slice(0, 6));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeClient]);

  const trafficData = [
    { day: 'Mon', organic: 2400, paid: 1800, social: 1200 },
    { day: 'Tue', organic: 3100, paid: 2200, social: 1500 },
    { day: 'Wed', organic: 4200, paid: 2800, social: 1900 },
    { day: 'Thu', organic: 4800, paid: 3400, social: 2200 },
    { day: 'Fri', organic: 5900, paid: 4100, social: 2800 },
    { day: 'Sat', organic: 6800, paid: 4600, social: 3200 },
    { day: 'Sun', organic: 7400, paid: 5200, social: 3800 },
  ];

  const channelSplit = [
    { name: 'Google Ads PPC', value: 42, color: '#0E8FE8' },
    { name: 'Meta Instagram', value: 28, color: '#8B5CF6' },
    { name: 'SEO Organic', value: 20, color: '#10B981' },
    { name: 'Email / CRM', value: 10, color: '#F59E0B' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Quick Action */}
      <div className="relative rounded-2xl glass-panel p-6 sm:p-8 border border-brand-500/20 overflow-hidden bg-gradient-to-r from-brand-950/70 via-dark-card to-brand-900/30">
        <div className="absolute right-0 top-0 w-96 h-full bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Autonomous Execution Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Operations & Marketing Engine
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Active workspace: <span className="text-brand-400 font-bold">{activeClient?.company_name || 'Apex Health SaaS'}</span>. Real-time background workers, daily SEO checks, and automated ad optimization are online.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsStartModalOpen(true)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-brand-600 via-brand-500 to-accent-purple text-white shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Rocket className="w-4 h-4" />
              <span>START DIGITAL MARKETING</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Total Clients</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats?.total_clients || clients.length}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">{stats?.active_clients || 2} Active Workspaces</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Total Leads</span>
            <UserCheck className="w-4 h-4 text-accent-cyan" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats?.total_leads || 46}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+18.4% WoW Growth</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Tasks Completed</span>
            <ListTodo className="w-4 h-4 text-accent-purple" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats?.completed_tasks || 12}</p>
          <span className="text-[10px] text-gray-400 font-semibold">{stats?.total_tasks || 18} Queued in Total</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">AI Usage</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{(stats?.total_ai_tokens || 24800).toLocaleString()}</p>
          <span className="text-[10px] text-brand-400 font-semibold">Tokens Consumed</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Monthly Spend</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">${(stats?.estimated_marketing_spend || 14500).toLocaleString()}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Under Budget Cap</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Channel Traffic Graph */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Multi-Channel Acquisition Velocity</h3>
              <p className="text-xs text-gray-400">Organic, Paid, and Social daily traffic impressions</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-brand-400">Last 7 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0E8FE8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0E8FE8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="organic" stroke="#10B981" fillOpacity={1} fill="url(#colorOrganic)" />
                <Area type="monotone" dataKey="paid" stroke="#0E8FE8" fillOpacity={1} fill="url(#colorPaid)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Budget Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Channel Budget Allocation</h3>
            <p className="text-xs text-gray-400">AI-optimized marketing budget share</p>
          </div>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelSplit} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4}>
                  {channelSplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/5">
            {channelSplit.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-gray-300 truncate">{c.name}</span>
                <span className="text-gray-500 font-bold ml-auto">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Client Workspaces & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Workspaces */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Client Workspaces</h3>
            <button onClick={() => navigate('/clients')} className="text-xs text-brand-400 hover:underline flex items-center gap-1">
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {clients.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/clients/${c.id}`)}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{c.company_name}</h4>
                  <p className="text-[11px] text-gray-400">{c.industry} | {c.business_website}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-300">${c.monthly_marketing_budget?.toLocaleString()}/mo</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    c.account_status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {c.account_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Task Execution Stream */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Recent AI Task Stream</h3>
            <button onClick={() => navigate('/tasks')} className="text-xs text-brand-400 hover:underline flex items-center gap-1">
              <span>Task queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentTasks.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">No tasks running. Click "Start Digital Marketing" to activate workflows.</p>
            ) : (
              recentTasks.map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5 max-w-[280px] sm:max-w-md">
                    <p className="font-semibold text-gray-200 truncate">{t.title}</p>
                    <p className="text-[10px] text-gray-400">Agent: <span className="text-brand-400">{t.agent_name}</span> | Day {t.day_number}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    t.status === 'Running' ? 'bg-brand-500/20 text-brand-400 animate-pulse' : 'bg-white/10 text-gray-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Start Marketing Modal */}
      {activeClient && (
        <StartMarketingModal
          client={activeClient}
          isOpen={isStartModalOpen}
          onClose={() => setIsStartModalOpen(false)}
          onSuccess={() => loadData()}
        />
      )}
    </div>
  );
};
