import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Plus, Search, Filter, ExternalLink, 
  ArrowUpRight, DollarSign, Package, Rocket, CheckCircle2 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { NewClientModal } from '../components/NewClientModal';
import { Client } from '../types';

export const ClientsDirectory: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveClient } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await api.getClients();
      setClients(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter((c) => {
    const matchesSearch = c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.account_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectClient = (client: Client) => {
    setActiveClient(client);
    navigate(`/clients/${client.id}`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Client Workspaces</h1>
          <p className="text-xs text-gray-400">Manage client organizations, business profiles, and marketing scopes</p>
        </div>
        <button
          onClick={() => setIsNewClientModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Client</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between glass-panel p-3 rounded-xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search company or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-dark-bg border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'Active', 'Ready to Launch', 'Paused'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterStatus === st ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((c) => (
          <div
            key={c.id}
            onClick={() => handleSelectClient(c)}
            className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/5 cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center font-bold text-brand-400 text-sm">
                    {c.company_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{c.company_name}</h3>
                    <span className="text-[11px] text-gray-400">{c.industry}</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  c.account_status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  c.account_status === 'Ready to Launch' ? 'bg-brand-500/20 text-brand-400' : 'bg-white/10 text-gray-400'
                }`}>
                  {c.account_status}
                </span>
              </div>

              <p className="text-xs text-gray-400 line-clamp-2">
                {c.business_description || 'Enterprise business profile and automated marketing pipeline.'}
              </p>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-dark-bg/60 border border-white/5 text-center text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 block">Products</span>
                  <span className="font-bold text-white">{c.products_count || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Services</span>
                  <span className="font-bold text-white">{c.services_count || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Campaigns</span>
                  <span className="font-bold text-brand-400">{c.active_campaigns_count || 0}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="font-bold text-white">
                ${c.monthly_marketing_budget?.toLocaleString()}<span className="text-[10px] font-normal text-gray-400">/mo</span>
              </span>
              <div className="flex items-center gap-1 text-brand-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Manage Workspace</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onCreated={() => loadClients()}
      />
    </div>
  );
};
