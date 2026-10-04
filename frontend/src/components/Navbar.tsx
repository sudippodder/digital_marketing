import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Bell, Building2, ChevronDown, LogOut, CheckCircle2, 
  AlertCircle, ExternalLink, ShieldAlert, User as UserIcon 
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';
import { Client, NotificationItem } from '../types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeClient, setActiveClient, logout } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showClientsDropdown, setShowClientsDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isClientUser = user?.role === 'client';

  useEffect(() => {
    // Load notifications
    api.getNotifications().then((res) => {
      setNotifications(res);
      setUnreadCount(res.filter((n) => !n.is_read).length);
    }).catch(() => {});

    // If admin or manager, load all clients for workspace selector
    if (!isClientUser) {
      api.getClients().then((res) => {
        setClients(res);
        if (!activeClient && res.length > 0) {
          setActiveClient(res[0]);
        }
      }).catch(() => {});
    }
  }, [user]);

  const handleClientSelect = (client: Client) => {
    setActiveClient(client);
    setShowClientsDropdown(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Left: Brand / Logo */}
      <div className="flex items-center gap-6">
        <div 
          onClick={() => navigate(isClientUser ? '/portal' : '/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-purple p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-dark-bg/90 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400 animate-pulse-slow" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              Omni<span className="text-gradient">Flow</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                AI SaaS
              </span>
            </span>
            <p className="text-[11px] text-gray-400 font-medium hidden sm:block">Automated Digital Marketing Platform</p>
          </div>
        </div>

        {/* Workspace Selector for Admins */}
        {!isClientUser && clients.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowClientsDropdown(!showClientsDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-brand-400" />
              <span className="max-w-[140px] sm:max-w-[200px] truncate">
                {activeClient ? activeClient.company_name : 'Select Workspace'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showClientsDropdown && (
              <div className="absolute left-0 mt-2 w-64 glass-panel rounded-xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-white/5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Active Client Workspaces
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {clients.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleClientSelect(c)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-brand-500/10 transition-colors ${
                        activeClient?.id === c.id ? 'text-brand-400 font-bold bg-brand-500/5' : 'text-gray-300'
                      }`}
                    >
                      <span className="truncate">{c.company_name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                        {c.account_status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live System Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>AI Agents Live</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-xl shadow-2xl border border-white/10 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white uppercase tracking-wider">System Notifications</span>
                <button
                  onClick={() => {
                    api.markAllNotificationsRead();
                    setUnreadCount(0);
                  }}
                  className="text-[11px] text-brand-400 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto mt-2 space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition-colors">
                      <div className="flex items-center justify-between font-semibold text-gray-200">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-gray-500">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-400 text-[11px] mt-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs border border-brand-500/30">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-gray-200">{user?.full_name}</p>
              <p className="text-[10px] text-brand-400 capitalize font-medium">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
