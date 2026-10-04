import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, Globe, Mail, Phone, MapPin, DollarSign, 
  Rocket, Package, Briefcase, Plus, Sparkles, CheckCircle2, 
  Settings, ArrowRight, ShieldCheck, Play, Pause, Square, Trash2, Edit3
} from 'lucide-react';
import { api } from '../services/api';
import { StartMarketingModal } from '../components/StartMarketingModal';
import { Client, Product, Service, MarketingProject } from '../types';

export const ClientWorkspace: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'services' | 'strategy'>('overview');
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // New product / service inline dialog state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(99);

  const [showAddService, setShowAddService] = useState(false);
  const [newServName, setNewServName] = useState('');
  const [newServDesc, setNewServDesc] = useState('');

  const loadClientData = async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const [cRes, pRes, sRes, projRes] = await Promise.all([
        api.getClient(clientId),
        api.getProducts(clientId),
        api.getServices(clientId),
        api.getProjects(clientId)
      ]);
      setClient(cRes);
      setProducts(pRes);
      setServices(sRes);
      setProjects(projRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !newProdName) return;
    try {
      await api.createProduct(clientId, {
        name: newProdName,
        description: newProdDesc || 'Product description for AI marketing knowledge base.',
        price: Number(newProdPrice) || 99,
        features: ['High performance', 'Automated cloud integration'],
        benefits: ['Saves time', 'Increases ROI']
      });
      setShowAddProduct(false);
      setNewProdName('');
      setNewProdDesc('');
      loadClientData();
    } catch (err: any) {
      alert(`Error creating product: ${err.message}`);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !newServName) return;
    try {
      await api.createService(clientId, {
        name: newServName,
        description: newServDesc || 'Service description for AI marketing knowledge base.',
        benefits: ['Dedicated execution', 'Measurable business outcome']
      });
      setShowAddService(false);
      setNewServName('');
      setNewServDesc('');
      loadClientData();
    } catch (err: any) {
      alert(`Error creating service: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!window.confirm('Delete this product from knowledge base?')) return;
    try {
      await api.deleteProduct(prodId);
      loadClientData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteService = async (servId: string) => {
    if (!window.confirm('Delete this service from knowledge base?')) return;
    try {
      await api.deleteService(servId);
      loadClientData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading || !client) {
    return (
      <div className="p-8 text-center text-gray-400 text-xs">
        Loading client workspace...
      </div>
    );
  }

  const activeProject = projects.find((p) => p.status === 'Active') || projects[0];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Client Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-dark-card to-brand-950/40">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-purple p-0.5 shadow-xl">
            <div className="w-full h-full bg-dark-bg rounded-[14px] flex items-center justify-center font-extrabold text-xl text-white">
              {client.company_name.charAt(0)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{client.company_name}</h1>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                client.account_status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brand-500/20 text-brand-400'
              }`}>
                {client.account_status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <a href={client.business_website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-400 text-gray-300">
                <Globe className="w-3.5 h-3.5 text-gray-500" />
                <span>{client.business_website}</span>
              </a>
              <span>•</span>
              <span>{client.industry}</span>
              <span>•</span>
              <span className="text-gray-300 font-semibold">${client.monthly_marketing_budget?.toLocaleString()}/mo Budget</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsStartModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide bg-gradient-to-r from-brand-600 via-brand-500 to-accent-purple text-white shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Rocket className="w-4 h-4" />
            <span>START DIGITAL MARKETING</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'overview' ? 'bg-brand-500 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Overview & Parameters
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'products' ? 'bg-brand-500 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'services' ? 'bg-brand-500 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Services ({services.length})</span>
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white">Business Information & Context</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {client.business_description || 'No business description provided.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/5 text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Target Audience Profile</span>
                  <p className="text-gray-200">{client.target_audience || 'General industry consumers and decision makers.'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Brand Tone & Voice</span>
                  <p className="text-gray-200">{client.brand_tone}</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-white">Marketing Objectives</h3>
              <div className="flex flex-wrap gap-2">
                {client.marketing_objectives?.map((obj, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
                    ✓ {obj}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white">Campaign Execution Engine</h3>
              
              {activeProject ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-gray-500 block">Current Status</span>
                    <span className="font-bold text-emerald-400 text-sm">{activeProject.status}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-gray-500 block">Execution ID</span>
                    <span className="font-mono text-brand-400 font-bold">{activeProject.current_campaign_execution_id || 'EXEC-PENDING'}</span>
                  </div>
                  <button
                    onClick={() => navigate('/tasks')}
                    className="w-full py-2.5 rounded-xl bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 border border-brand-500/30 font-bold transition-colors"
                  >
                    View Task Queue & Logs
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-xs text-gray-400">No active marketing project started.</p>
                  <button
                    onClick={() => setIsStartModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
                  >
                    Start Marketing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Products */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Product Knowledge Base ({products.length})</h3>
            <button
              onClick={() => setShowAddProduct(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          {showAddProduct && (
            <form onSubmit={handleAddProduct} className="glass-panel p-4 rounded-xl border border-brand-500/30 space-y-3 text-xs">
              <h4 className="font-bold text-white">Add Product to Knowledge Base</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Product Name"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(parseFloat(e.target.value) || 0)}
                  className="px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
                />
                <input
                  type="text"
                  placeholder="Brief description"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddProduct(false)} className="px-3 py-1 rounded bg-white/5 text-gray-300">Cancel</button>
                <button type="submit" className="px-3 py-1 rounded bg-brand-500 text-white font-bold">Save Product</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="glass-panel p-5 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-white text-xs">{p.name}</h4>
                  <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-500 hover:text-rose-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <span className="font-bold text-emerald-400">${p.price}</span>
                  <span className="text-[10px] text-gray-500">{p.category || 'Product'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Services */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Service Knowledge Base ({services.length})</h3>
            <button
              onClick={() => setShowAddService(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </button>
          </div>

          {showAddService && (
            <form onSubmit={handleAddService} className="glass-panel p-4 rounded-xl border border-brand-500/30 space-y-3 text-xs">
              <h4 className="font-bold text-white">Add Service Offering</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Service Name"
                  value={newServName}
                  onChange={(e) => setNewServName(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
                />
                <input
                  type="text"
                  placeholder="Description & Scope"
                  value={newServDesc}
                  onChange={(e) => setNewServDesc(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddService(false)} className="px-3 py-1 rounded bg-white/5 text-gray-300">Cancel</button>
                <button type="submit" className="px-3 py-1 rounded bg-brand-500 text-white font-bold">Save Service</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.id} className="glass-panel p-5 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-white text-xs">{s.name}</h4>
                  <button onClick={() => handleDeleteService(s.id)} className="text-gray-500 hover:text-rose-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{s.description}</p>
                <div className="pt-2 border-t border-white/5 text-xs text-brand-400 font-semibold">
                  {s.pricing || 'Custom Pricing'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Modal */}
      <StartMarketingModal
        client={client}
        project={activeProject}
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        onSuccess={() => loadClientData()}
      />
    </div>
  );
};
