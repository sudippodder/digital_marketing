export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'marketing_manager' | 'client';
  organization_id?: string;
  client_id?: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface Client {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  business_website: string;
  industry: string;
  business_description?: string;
  business_location?: string;
  target_countries: string[];
  target_cities: string[];
  preferred_languages: string[];
  target_audience?: string;
  competitor_websites: string[];
  monthly_marketing_budget: number;
  marketing_objectives: string[];
  brand_tone: string;
  brand_guidelines?: string;
  logo?: string;
  business_images: string[];
  account_status: string;
  assigned_manager_id?: string;
  created_at: string;
  updated_at: string;
  products_count?: number;
  services_count?: number;
  active_campaigns_count?: number;
}

export interface Product {
  id: string;
  client_id: string;
  name: string;
  sku?: string;
  category?: string;
  description: string;
  features: string[];
  benefits: string[];
  price: number;
  discount: number;
  product_url?: string;
  product_images: string[];
  target_keywords: string[];
  target_audience?: string;
  unique_selling_propositions: string[];
  competitor_products: string[];
  availability: string;
  product_status: string;
  created_at: string;
}

export interface Service {
  id: string;
  client_id: string;
  name: string;
  description: string;
  pricing?: string;
  benefits: string[];
  target_audience?: string;
  geographic_availability: string[];
  landing_page?: string;
  conversion_goal?: string;
  keywords: string[];
  faqs: Array<{ question: string; answer: string }>;
  created_at: string;
}

export interface MarketingStrategy {
  id: string;
  project_id: string;
  version: number;
  status: string;
  title: string;
  executive_summary: string;
  target_personas: any[];
  channel_strategies: Record<string, any>;
  kpi_targets: Record<string, any>;
  budget_allocation: Record<string, number>;
  ai_rationale?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface MarketingPlan {
  id: string;
  project_id: string;
  title: string;
  duration_days: number;
  phases: any[];
  weekly_breakdown: any[];
  created_at: string;
}

export interface MarketingTask {
  id: string;
  project_id: string;
  client_id: string;
  title: string;
  agent_name: string;
  task_type: string;
  priority: string;
  day_number: number;
  status: string;
  input_parameters: Record<string, any>;
  output_data: Record<string, any>;
  logs: Array<{ timestamp: string; level: string; message: string }>;
  retry_count: number;
  max_retries: number;
  error_message?: string;
  requires_approval: boolean;
  approval_status: string;
  scheduled_for?: string;
  started_at?: string;
  completed_at?: string;
  execution_cost: number;
  token_usage: number;
  created_at: string;
}

export interface MarketingProject {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  status: string;
  selected_services: string[];
  auto_pilot: boolean;
  monthly_budget: number;
  current_campaign_execution_id?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  strategies?: MarketingStrategy[];
  plans?: MarketingPlan[];
  tasks_count?: number;
  completed_tasks_count?: number;
}

export interface ContentItem {
  id: string;
  client_id: string;
  title: string;
  content_type: string;
  platform: string;
  body: string;
  meta_title?: string;
  meta_description?: string;
  target_keywords: string[];
  hashtags: string[];
  media_urls: string[];
  status: string;
  scheduled_date?: string;
  published_date?: string;
  published_url?: string;
  performance_metrics?: Record<string, any>;
  created_at: string;
}

export interface Lead {
  id: string;
  client_id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status: string;
  lead_score: number;
  estimated_value: number;
  notes?: string;
  ai_summary?: string;
  next_follow_up?: string;
  created_at: string;
}

export interface Keyword {
  id: string;
  client_id: string;
  keyword: string;
  current_position: number;
  previous_position: number;
  search_volume: number;
  difficulty: number;
  intent: string;
  target_url?: string;
  last_checked: string;
}

export interface DailyReport {
  id: string;
  client_id: string;
  report_date: string;
  title: string;
  executive_summary: any;
  seo_metrics: any;
  social_metrics: any;
  advertising_metrics: any;
  lead_metrics: any;
  ai_operations: any;
  next_day_plan: any;
  download_url?: string;
  created_at: string;
}

export interface Integration {
  id: string;
  client_id: string;
  provider_name: string;
  display_name: string;
  category: string;
  is_connected: boolean;
  is_mock: boolean;
  account_id?: string;
  account_name?: string;
  last_synced_at?: string;
  status_message: string;
  created_at: string;
}

export interface Approval {
  id: string;
  client_id: string;
  task_id?: string;
  approval_type: string;
  title: string;
  description: string;
  payload_preview: any;
  risk_level: string;
  status: string;
  reviewer_notes?: string;
  decided_by?: string;
  decided_at?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface ValidationResult {
  is_valid: boolean;
  ready_to_start: boolean;
  checks: Record<string, boolean>;
  errors: string[];
  warnings: string[];
}
