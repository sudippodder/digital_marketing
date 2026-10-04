import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Package, Rocket, ListTodo, 
  CheckSquare, FileText, UserCheck, Network, BarChart3, 
  Settings, BookOpen, ShieldCheck, Megaphone, Share2, Compass
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const isClientUser = user?.role === 'client';

  const adminNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Products & Services', path: '/products-services', icon: Package },
    { name: 'Marketing Projects', path: '/campaigns', icon: Rocket },
    { name: 'Task Queue', path: '/tasks', icon: ListTodo },
    { name: 'Approval Center', path: '/approvals', icon: CheckSquare },
    { name: 'Content Studio', path: '/content', icon: FileText },
    { name: 'Leads Pipeline', path: '/leads', icon: UserCheck },
    { name: 'Integrations Hub', path: '/integrations', icon: Network },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { name: 'System Settings', path: '/settings', icon: Settings },
  ];

  const clientNavItems = [
    { name: 'Overview', path: '/portal', icon: Compass },
    { name: 'Marketing Reports', path: '/portal/reports', icon: BarChart3 },
    { name: 'SEO Analytics', path: '/portal/seo', icon: Rocket },
    { name: 'Social Media', path: '/portal/social', icon: Share2 },
    { name: 'Advertising', path: '/portal/ads', icon: Megaphone },
    { name: 'Leads', path: '/portal/leads', icon: UserCheck },
    { name: 'Content Library', path: '/portal/content', icon: FileText },
    { name: 'Workspace Settings', path: '/portal/settings', icon: Settings },
    { name: 'User Guide & Help', path: '/portal/guide', icon: BookOpen },
  ];

  const items = isClientUser ? clientNavItems : adminNavItems;

  return (
    <aside className="w-64 min-h-[calc(100vh-61px)] glass-panel border-r border-white/5 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">
            {isClientUser ? 'Client Portal' : 'Admin Control Suite'}
          </p>
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard' || item.path === '/portal'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 text-brand-400 border border-brand-500/30 shadow-lg shadow-brand-500/10'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 rounded-xl bg-gradient-to-br from-brand-950/50 to-dark-card border border-brand-500/20 text-xs">
        <div className="flex items-center gap-2 text-brand-400 font-bold mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Multi-Tenant Engine</span>
        </div>
        <p className="text-[11px] text-gray-400">
          Strict tenant isolation & background agent queues active.
        </p>
      </div>
    </aside>
  );
};
