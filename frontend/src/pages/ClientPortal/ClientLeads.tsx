import React, { useState, useEffect } from 'react';
import { UserCheck, Star, Search, Mail, Phone, Building } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Lead } from '../../types';

export const ClientLeads: React.FC = () => {
  const { activeClient } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (activeClient) {
      api.getLeads(activeClient.id).then(setLeads).catch(console.error);
    }
  }, [activeClient]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Captured Leads & Inbound Opportunities</h1>
        <p className="text-xs text-gray-400">
          Inbound MQLs captured from live Google and Meta ad campaigns for <span className="text-brand-400 font-bold">{activeClient?.company_name}</span>
        </p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-dark-card/90 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
            <tr>
              <th className="py-3 px-4">Contact Person</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Acquisition Channel</th>
              <th className="py-3 px-4">AI Lead Score</th>
              <th className="py-3 px-4">Est. Contract Value</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">No leads captured yet.</td>
              </tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <div>{l.full_name}</div>
                    <div className="text-[11px] text-gray-400 font-normal">{l.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-300">{l.company || 'Private Practice'}</td>
                  <td className="py-3.5 px-4 text-brand-400">{l.source}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Star className="w-3 h-3 fill-current" />
                      {l.lead_score}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">${l.estimated_value?.toLocaleString()}</td>
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
  );
};
