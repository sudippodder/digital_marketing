import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Plus, Search, Filter, Mail, Phone, 
  Building, DollarSign, Star, ArrowRight, ShieldCheck, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Lead } from '../types';

export const LeadsPipeline: React.FC = () => {
  const { activeClient } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Google Search Ads',
    status: 'New',
    lead_score: 85,
    estimated_value: 3500,
    notes: ''
  });

  const loadLeads = async () => {
    if (!activeClient) return;
    try {
      const res = await api.getLeads(activeClient.id);
      setLeads(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [activeClient]);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient || !newLead.full_name || !newLead.email) return;
    try {
      await api.createLead(activeClient.id, newLead);
      setShowAddModal(false);
      setNewLead({
        full_name: '',
        email: '',
        phone: '',
        company: '',
        source: 'Google Search Ads',
        status: 'New',
        lead_score: 85,
        estimated_value: 3500,
        notes: ''
      });
      loadLeads();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch = l.full_name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.estimated_value || 0), 0);
  const avgScore = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + (l.lead_score || 0), 0) / leads.length) : 0;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Leads & Inbound Pipeline CRM</h1>
          <p className="text-xs text-gray-400">
            Autonomous MQL capture, AI lead qualification scoring, and CRM synchronization
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Inbound Lead</span>
        </button>
      </div>

      {/* Pipeline Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400">Total Leads Captured</span>
          <p className="text-2xl font-extrabold text-white">{leads.length}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Across 4 Active Channels</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400">Average AI Lead Score</span>
          <p className="text-2xl font-extrabold text-accent-cyan">{avgScore}/100</p>
          <span className="text-[10px] text-brand-400 font-semibold">High Purchase Intent</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400">Total Pipeline Value</span>
          <p className="text-2xl font-extrabold text-emerald-400">${totalPipelineValue.toLocaleString()}</p>
          <span className="text-[10px] text-gray-400 font-semibold">Projected Deal Value</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between glass-panel p-3 rounded-xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search leads by name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-dark-bg border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          {['all', 'New', 'Qualified', 'Proposal Sent', 'Won'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors ${
                statusFilter === st ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-dark-card/90 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Channel Source</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4">Est. Value</th>
                <th className="py-3 px-4">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No leads captured yet. Leads will appear automatically as campaigns run.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{l.full_name}</div>
                      <div className="text-[11px] text-gray-400 font-normal">{l.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-300">
                      {l.company || 'Private Practice'}
                    </td>
                    <td className="py-3.5 px-4 text-brand-400 font-medium">
                      {l.source}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px] ${
                        l.lead_score >= 90 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        l.lead_score >= 70 ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        <Star className="w-3 h-3 fill-current" />
                        {l.lead_score}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ${l.estimated_value?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-gray-300">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white">Register Inbound Lead</h3>
            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newLead.full_name}
                  onChange={(e) => setNewLead({ ...newLead, full_name: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-white focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Estimated Value ($)"
                  value={newLead.estimated_value}
                  onChange={(e) => setNewLead({ ...newLead, estimated_value: parseFloat(e.target.value) || 0 })}
                  className="px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-brand-500 text-white font-bold">
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
