import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Building2, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setActiveClient } = useAuthStore();
  const [email, setEmail] = useState('admin@omniflow.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    try {
      const res = await api.login({ email: loginEmail, password: loginPass });
      setToken(res.access_token);
      setUser(res.user);

      // If client role, load their client workspace
      if (res.user.role === 'client' && res.user.client_id) {
        const client = await api.getClient(res.user.client_id);
        setActiveClient(client);
        navigate('/portal');
      } else {
        // Admin or manager
        const clients = await api.getClients();
        if (clients.length > 0) {
          setActiveClient(clients[0]);
        }
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillAndLogin = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    handleLogin(undefined, e, p);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background neon ambient spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-purple/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-purple p-0.5 shadow-xl shadow-brand-500/30">
            <div className="w-full h-full bg-dark-bg rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Omni<span className="text-gradient">Flow</span> AI
          </span>
        </div>
        <h2 className="text-center text-sm font-semibold text-gray-400">
          Automated Digital Marketing SaaS Platform
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="glass-panel py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-white/10">
          <form className="space-y-4" onSubmit={(e) => handleLogin(e)}>
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-bg/80 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-bg/80 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide bg-gradient-to-r from-brand-600 via-brand-500 to-accent-purple text-white shadow-lg shadow-brand-500/25 hover:opacity-95 transition-all"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Fast 1-Click Demo Profiles */}
          <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
              ⚡ Quick 1-Click Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillAndLogin('admin@omniflow.ai', 'password123')}
                className="p-2 rounded-xl bg-white/5 hover:bg-brand-500/10 border border-white/5 hover:border-brand-500/30 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-bold text-brand-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Super Admin</span>
                </div>
                <p className="text-gray-400 text-[10px]">Full platform access</p>
              </button>

              <button
                type="button"
                onClick={() => fillAndLogin('manager@omniflow.ai', 'password123')}
                className="p-2 rounded-xl bg-white/5 hover:bg-brand-500/10 border border-white/5 hover:border-brand-500/30 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-bold text-accent-purple">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Manager</span>
                </div>
                <p className="text-gray-400 text-[10px]">Campaign operations</p>
              </button>

              <button
                type="button"
                onClick={() => fillAndLogin('client@apexhealth.io', 'password123')}
                className="p-2 rounded-xl bg-white/5 hover:bg-brand-500/10 border border-white/5 hover:border-brand-500/30 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-bold text-accent-cyan">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Apex Health</span>
                </div>
                <p className="text-gray-400 text-[10px]">Client portal view</p>
              </button>

              <button
                type="button"
                onClick={() => fillAndLogin('client@luxeaura.com', 'password123')}
                className="p-2 rounded-xl bg-white/5 hover:bg-brand-500/10 border border-white/5 hover:border-brand-500/30 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-bold text-accent-emerald">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>LuxeAura</span>
                </div>
                <p className="text-gray-400 text-[10px]">D2C Brand portal</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
