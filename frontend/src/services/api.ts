const API_BASE = 'http://localhost:8000/api/v1';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = { ...getHeaders(), ...(options.headers || {}) };
  
  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    // If not on login page, can clear token
    if (!window.location.pathname.includes('/login')) {
      // localStorage.removeItem('token');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(typeof errorData.detail === 'string' ? errorData.detail : (errorData.detail?.message || 'API request failed'));
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request<any>('/auth/me'),

  // Clients
  getClients: () => request<any[]>('/clients'),
  getClient: (id: string) => request<any>(`/clients/${id}`),
  createClient: (data: any) => request<any>('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: string, data: any) => request<any>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClient: (id: string) => request<any>(`/clients/${id}`, { method: 'DELETE' }),

  // Products & Services
  getProducts: (clientId: string) => request<any[]>(`/clients/${clientId}/products`),
  createProduct: (clientId: string, data: any) => request<any>(`/clients/${clientId}/products`, { method: 'POST', body: JSON.stringify(data) }),
  deleteProduct: (productId: string) => request<any>(`/products/${productId}`, { method: 'DELETE' }),
  
  getServices: (clientId: string) => request<any[]>(`/clients/${clientId}/services`),
  createService: (clientId: string, data: any) => request<any>(`/clients/${clientId}/services`, { method: 'POST', body: JSON.stringify(data) }),
  deleteService: (serviceId: string) => request<any>(`/services/${serviceId}`, { method: 'DELETE' }),

  // Marketing Projects & Activation
  getProjects: (clientId: string) => request<any[]>(`/clients/${clientId}/marketing-projects`),
  createProject: (clientId: string, data: any) => request<any>(`/clients/${clientId}/marketing-projects`, { method: 'POST', body: JSON.stringify(data) }),
  validateMarketingActivation: (projectId: string) => request<any>(`/marketing-projects/${projectId}/validate`),
  startMarketing: (projectId: string) => request<any>(`/marketing-projects/${projectId}/start`, { method: 'POST' }),
  pauseMarketing: (projectId: string) => request<any>(`/marketing-projects/${projectId}/pause`, { method: 'POST' }),
  resumeMarketing: (projectId: string) => request<any>(`/marketing-projects/${projectId}/resume`, { method: 'POST' }),
  stopMarketing: (projectId: string) => request<any>(`/marketing-projects/${projectId}/stop`, { method: 'POST' }),
  generateStrategy: (projectId: string) => request<any>(`/marketing-projects/${projectId}/generate-strategy`, { method: 'POST' }),
  getStrategy: (projectId: string) => request<any>(`/marketing-projects/${projectId}/strategy`),

  // Tasks
  getTasks: (projectId: string) => request<any[]>(`/marketing-projects/${projectId}/tasks`),
  retryTask: (taskId: string, params?: any) => request<any>(`/tasks/${taskId}/retry`, { method: 'POST', body: JSON.stringify({ override_params: params }) }),
  cancelTask: (taskId: string) => request<any>(`/tasks/${taskId}/cancel`, { method: 'POST' }),
  executeTaskNow: (taskId: string) => request<any>(`/tasks/${taskId}/execute-now`, { method: 'POST' }),

  // Content
  getContent: (clientId: string) => request<any[]>(`/clients/${clientId}/content`),
  createContent: (clientId: string, data: any) => request<any>(`/clients/${clientId}/content`, { method: 'POST', body: JSON.stringify(data) }),
  approveContent: (contentId: string) => request<any>(`/content/${contentId}/approve`, { method: 'POST' }),
  publishContent: (contentId: string) => request<any>(`/content/${contentId}/publish`, { method: 'POST' }),

  // Leads
  getLeads: (clientId: string) => request<any[]>(`/clients/${clientId}/leads`),
  createLead: (clientId: string, data: any) => request<any>(`/clients/${clientId}/leads`, { method: 'POST', body: JSON.stringify(data) }),

  // Reports & Analytics
  getReports: (clientId: string) => request<any[]>(`/clients/${clientId}/reports`),
  getReport: (reportId: string) => request<any>(`/reports/${reportId}`),
  generateReport: (clientId: string) => request<any>(`/reports/generate?client_id=${clientId}`, { method: 'POST' }),
  getAnalytics: (clientId: string) => request<any>(`/clients/${clientId}/analytics`),

  // Integrations
  getIntegrations: (clientId: string) => request<any[]>(`/clients/${clientId}/integrations`),
  connectIntegration: (clientId: string, data: any) => request<any>(`/integrations/connect?client_id=${clientId}`, { method: 'POST', body: JSON.stringify(data) }),
  testIntegration: (provider: string) => request<any>(`/integrations/test?provider_name=${provider}`, { method: 'POST' }),
  disconnectIntegration: (integrationId: string) => request<any>(`/integrations/${integrationId}`, { method: 'DELETE' }),

  // Approvals
  getApprovals: (clientId?: string) => request<any[]>(`/approvals${clientId ? `?client_id=${clientId}` : ''}`),
  approveRequest: (approvalId: string) => request<any>(`/approvals/${approvalId}/approve`, { method: 'POST' }),
  rejectRequest: (approvalId: string, notes?: string) => request<any>(`/approvals/${approvalId}/reject`, { method: 'POST', body: JSON.stringify({ status: 'Rejected', reviewer_notes: notes }) }),

  // Notifications
  getNotifications: () => request<any[]>('/notifications'),
  markNotificationRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () => request<any>('/notifications/read-all', { method: 'POST' }),

  // Admin
  getAdminStats: () => request<any>('/admin/stats'),
  getAuditLogs: () => request<any[]>('/admin/audit-logs'),
  getUsers: () => request<any[]>('/admin/users'),
};
