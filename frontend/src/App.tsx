import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { useAuthStore } from './store/useAuthStore';
import { api } from './services/api';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { ClientsDirectory } from './pages/ClientsDirectory';
import { ClientWorkspace } from './pages/ClientWorkspace';
import { MarketingProjects } from './pages/MarketingProjects';
import { TaskQueue } from './pages/TaskQueue';
import { ApprovalCenter } from './pages/ApprovalCenter';
import { ContentStudio } from './pages/ContentStudio';
import { LeadsPipeline } from './pages/LeadsPipeline';
import { IntegrationsHub } from './pages/IntegrationsHub';
import { ReportsCenter } from './pages/ReportsCenter';
import { SystemSettings } from './pages/SystemSettings';

// Client Portal Pages
import { ClientOverview } from './pages/ClientPortal/ClientOverview';
import { ClientReports } from './pages/ClientPortal/ClientReports';
import { ClientSEO } from './pages/ClientPortal/ClientSEO';
import { ClientSocial } from './pages/ClientPortal/ClientSocial';
import { ClientAds } from './pages/ClientPortal/ClientAds';
import { ClientLeads } from './pages/ClientPortal/ClientLeads';
import { ClientContent } from './pages/ClientPortal/ClientContent';
import { ClientSettings } from './pages/ClientPortal/ClientSettings';
import { ClientUserGuide } from './pages/ClientPortal/ClientUserGuide';

// Protected App Layout
const AppLayout: React.FC = () => {
  const { user, token, activeClient, setActiveClient } = useAuthStore();

  useEffect(() => {
    // If no active client set yet, fetch and set first one for admin
    if (token && user?.role !== 'client' && !activeClient) {
      api.getClients().then((clients) => {
        if (clients.length > 0) setActiveClient(clients[0]);
      }).catch(() => {});
    }
  }, [token, user]);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const { user, token } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Marketing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard & Portal */}
        <Route element={<AppLayout />}>
          {/* Admin Routes */}
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/clients" element={<ClientsDirectory />} />
          <Route path="/clients/:clientId" element={<ClientWorkspace />} />
          <Route path="/products-services" element={<ClientsDirectory />} />
          <Route path="/campaigns" element={<MarketingProjects />} />
          <Route path="/tasks" element={<TaskQueue />} />
          <Route path="/approvals" element={<ApprovalCenter />} />
          <Route path="/content" element={<ContentStudio />} />
          <Route path="/leads" element={<LeadsPipeline />} />
          <Route path="/integrations" element={<IntegrationsHub />} />
          <Route path="/reports" element={<ReportsCenter />} />
          <Route path="/settings" element={<SystemSettings />} />

          {/* Client Portal Routes */}
          <Route path="/portal" element={<ClientOverview />} />
          <Route path="/portal/reports" element={<ClientReports />} />
          <Route path="/portal/seo" element={<ClientSEO />} />
          <Route path="/portal/social" element={<ClientSocial />} />
          <Route path="/portal/ads" element={<ClientAds />} />
          <Route path="/portal/leads" element={<ClientLeads />} />
          <Route path="/portal/content" element={<ClientContent />} />
          <Route path="/portal/settings" element={<ClientSettings />} />
          <Route path="/portal/guide" element={<ClientUserGuide />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={
            token && user
              ? user.role === 'client'
                ? <Navigate to="/portal" replace />
                : <Navigate to="/dashboard" replace />
              : <Navigate to="/" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

