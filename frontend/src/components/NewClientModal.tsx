import React, { useState } from 'react';
import { Building2, Globe, Mail, DollarSign, Target, Plus, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { Client } from '../types';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (client: Client) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    business_website: '',
    industry: 'Healthcare SaaS',
    business_description: '',
    business_location: 'United States',
    target_countries: ['United States'],
    target_audience: '',
    monthly_marketing_budget: 5000,
    marketing_objectives: ['Acquire High-Intent Leads', 'Scale Organic SEO Traffic', 'Achieve 4x ROAS'],
    brand_tone: 'Professional & Authoritative',
    brand_guidelines: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await api.createClient(formData);
      onCreated(created);
      onClose();
    } catch (err: any) {
      alert(`Failed to create client: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-dark-card shrink-0">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Register New Client Workspace</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xs px-2.5 py-1 rounded bg-white/5">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Company / Brand Name *</label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="e.g. Acme Cloud Corp"
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Business Website URL *</label>
              <input
                type="url"
                required
                value={formData.business_website}
                onChange={(e) => setFormData({ ...formData, business_website: e.target.value })}
                placeholder="https://acmecloud.com"
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Primary Contact Person *</label>
              <input
                type="text"
                required
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="e.g. Sarah Connor"
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Contact Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@acmecloud.com"
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Industry Vertical *</label>
              <input
                type="text"
                required
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. B2B SaaS, E-Commerce, Healthcare"
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Monthly Marketing Budget ($) *</label>
              <input
                type="number"
                min="500"
                required
                value={formData.monthly_marketing_budget}
                onChange={(e) => setFormData({ ...formData, monthly_marketing_budget: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-semibold">Target Audience Profile *</label>
            <textarea
              rows={2}
              required
              value={formData.target_audience}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
              placeholder="e.g. VPs of Engineering and CTOs at mid-market companies seeking infrastructure monitoring tools."
              className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-semibold">Brand Tone & Voice Guidelines</label>
            <input
              type="text"
              value={formData.brand_tone}
              onChange={(e) => setFormData({ ...formData, brand_tone: e.target.value })}
              placeholder="e.g. Authoritative, Innovative, Technical & Concise"
              className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Create Client Workspace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
