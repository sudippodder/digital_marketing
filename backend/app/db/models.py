import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, ForeignKey, JSON, Enum
)
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class UserRole(str):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    MARKETING_MANAGER = "marketing_manager"
    CLIENT = "client"

class ClientStatus(str):
    ONBOARDING = "Onboarding"
    PROFILE_INCOMPLETE = "Profile Incomplete"
    READY_TO_LAUNCH = "Ready to Launch"
    ACTIVE = "Active"
    PAUSED = "Paused"
    COMPLETED = "Completed"
    SUSPENDED = "Suspended"

class TaskStatus(str):
    PENDING = "Pending"
    QUEUED = "Queued"
    RUNNING = "Running"
    AWAITING_APPROVAL = "Awaiting Approval"
    COMPLETED = "Completed"
    FAILED = "Failed"
    CANCELLED = "Cancelled"
    RETRYING = "Retrying"

class ApprovalStatus(str):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    CHANGES_REQUESTED = "Changes Requested"

# ----------------- Organizations & Multi-tenancy -----------------
class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    plan = Column(String(50), default="Enterprise")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="organization")
    clients = relationship("Client", back_populates="organization")
    subscriptions = relationship("Subscription", back_populates="organization")

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=True, index=True)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=True, index=True)
    
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.CLIENT)
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="users")
    client = relationship("Client", back_populates="users", foreign_keys=[client_id])
    audit_logs = relationship("AuditLog", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

# ----------------- Client Management -----------------
class Client(Base):
    __tablename__ = "clients"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    assigned_manager_id = Column(String(36), ForeignKey("users.id"), nullable=True)

    company_name = Column(String(255), nullable=False, index=True)
    contact_person = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    business_website = Column(String(500), nullable=False)
    industry = Column(String(100), nullable=False)
    business_description = Column(Text, nullable=True)
    business_location = Column(String(255), nullable=True)
    
    target_countries = Column(JSON, default=list)  # list of strings
    target_cities = Column(JSON, default=list)
    preferred_languages = Column(JSON, default=list)
    target_audience = Column(Text, nullable=True)
    competitor_websites = Column(JSON, default=list)
    monthly_marketing_budget = Column(Float, default=5000.0)
    marketing_objectives = Column(JSON, default=list)
    brand_tone = Column(String(100), default="Professional & Innovative")
    brand_guidelines = Column(Text, nullable=True)
    logo = Column(String(500), nullable=True)
    business_images = Column(JSON, default=list)
    
    account_status = Column(String(50), default=ClientStatus.READY_TO_LAUNCH)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="clients")
    users = relationship("User", back_populates="client", foreign_keys="User.client_id")
    assigned_manager = relationship("User", foreign_keys=[assigned_manager_id])
    products = relationship("Product", back_populates="client", cascade="all, delete-orphan")
    services = relationship("Service", back_populates="client", cascade="all, delete-orphan")
    marketing_projects = relationship("MarketingProject", back_populates="client", cascade="all, delete-orphan")
    leads = relationship("Lead", back_populates="client", cascade="all, delete-orphan")
    content_items = relationship("ContentItem", back_populates="client", cascade="all, delete-orphan")
    keywords = relationship("Keyword", back_populates="client", cascade="all, delete-orphan")
    seo_audits = relationship("SeoAudit", back_populates="client", cascade="all, delete-orphan")
    daily_reports = relationship("DailyReport", back_populates="client", cascade="all, delete-orphan")
    integrations = relationship("Integration", back_populates="client", cascade="all, delete-orphan")

# ----------------- Products & Services -----------------
class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    
    name = Column(String(255), nullable=False)
    sku = Column(String(100), nullable=True)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    features = Column(JSON, default=list)
    benefits = Column(JSON, default=list)
    price = Column(Float, nullable=False)
    discount = Column(Float, default=0.0)
    product_url = Column(String(500), nullable=True)
    product_images = Column(JSON, default=list)
    target_keywords = Column(JSON, default=list)
    target_audience = Column(Text, nullable=True)
    unique_selling_propositions = Column(JSON, default=list)
    competitor_products = Column(JSON, default=list)
    availability = Column(String(50), default="In Stock")
    product_status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="products")

class Service(Base):
    __tablename__ = "services"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    pricing = Column(String(255), nullable=True)
    benefits = Column(JSON, default=list)
    target_audience = Column(Text, nullable=True)
    geographic_availability = Column(JSON, default=list)
    landing_page = Column(String(500), nullable=True)
    conversion_goal = Column(String(255), nullable=True)
    keywords = Column(JSON, default=list)
    faqs = Column(JSON, default=list)  # list of {question: str, answer: str}
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="services")

# ----------------- Marketing Projects & Execution -----------------
class MarketingProject(Base):
    __tablename__ = "marketing_projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="Active")  # Draft, Active, Paused, Completed, Stopped
    selected_services = Column(JSON, default=list)  # list of service names selected
    auto_pilot = Column(Boolean, default=True)
    monthly_budget = Column(Float, default=5000.0)
    current_campaign_execution_id = Column(String(100), nullable=True)
    
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="marketing_projects")
    strategies = relationship("MarketingStrategy", back_populates="project", cascade="all, delete-orphan")
    plans = relationship("MarketingPlan", back_populates="project", cascade="all, delete-orphan")
    tasks = relationship("MarketingTask", back_populates="project", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="project", cascade="all, delete-orphan")

class MarketingStrategy(Base):
    __tablename__ = "marketing_strategies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("marketing_projects.id"), nullable=False, index=True)
    
    version = Column(Integer, default=1)
    status = Column(String(50), default="Approved")  # Draft, Awaiting Approval, Approved, Rejected
    title = Column(String(255), nullable=False)
    executive_summary = Column(Text, nullable=False)
    target_personas = Column(JSON, default=list)
    channel_strategies = Column(JSON, default=dict)  # SEO, Social, Ads, Email, Content
    kpi_targets = Column(JSON, default=dict)
    budget_allocation = Column(JSON, default=dict)
    ai_rationale = Column(Text, nullable=True)
    approved_by = Column(String(255), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("MarketingProject", back_populates="strategies")

class MarketingPlan(Base):
    __tablename__ = "marketing_plans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("marketing_projects.id"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    duration_days = Column(Integer, default=30)
    phases = Column(JSON, default=list)  # Phase 1: Foundation, Phase 2: Content & Traffic, etc.
    weekly_breakdown = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("MarketingProject", back_populates="plans")

class MarketingTask(Base):
    __tablename__ = "marketing_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("marketing_projects.id"), nullable=False, index=True)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    agent_name = Column(String(100), nullable=False)  # Orchestrator, SEO, Content, Social, Ads, LeadGen, Analytics, Reporting
    task_type = Column(String(100), nullable=False)
    priority = Column(String(50), default="Medium")  # Low, Medium, High, Urgent
    day_number = Column(Integer, default=1)
    status = Column(String(50), default=TaskStatus.PENDING)
    
    input_parameters = Column(JSON, default=dict)
    output_data = Column(JSON, default=dict)
    logs = Column(JSON, default=list)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    error_message = Column(Text, nullable=True)
    requires_approval = Column(Boolean, default=False)
    approval_status = Column(String(50), default=ApprovalStatus.APPROVED)
    
    scheduled_for = Column(DateTime, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    execution_cost = Column(Float, default=0.0)
    token_usage = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("MarketingProject", back_populates="tasks")
    agent_runs = relationship("AgentRun", back_populates="task", cascade="all, delete-orphan")
    approvals = relationship("Approval", back_populates="task", cascade="all, delete-orphan")

class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    task_id = Column(String(36), ForeignKey("marketing_tasks.id"), nullable=False, index=True)
    agent_name = Column(String(100), nullable=False)
    model_used = Column(String(100), default="gemini-1.5-pro")
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    status = Column(String(50), default="Success")
    raw_prompt = Column(Text, nullable=True)
    raw_response = Column(Text, nullable=True)
    duration_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    task = relationship("MarketingTask", back_populates="agent_runs")

class Approval(Base):
    __tablename__ = "approvals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    task_id = Column(String(36), ForeignKey("marketing_tasks.id"), nullable=True, index=True)
    
    approval_type = Column(String(100), nullable=False)  # Content Publish, Ad Budget Increase, Campaign Launch, Offer Change
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    payload_preview = Column(JSON, default=dict)
    risk_level = Column(String(50), default="Medium")  # Low, Medium, High
    status = Column(String(50), default=ApprovalStatus.PENDING)
    reviewer_notes = Column(Text, nullable=True)
    decided_by = Column(String(255), nullable=True)
    decided_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    task = relationship("MarketingTask", back_populates="approvals")

# ----------------- Campaigns & Performance -----------------
class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("marketing_projects.id"), nullable=False, index=True)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    
    name = Column(String(255), nullable=False)
    platform = Column(String(100), nullable=False)  # Google Ads, Meta Ads, LinkedIn, Email, Organic SEO
    campaign_type = Column(String(100), default="Conversions")
    status = Column(String(50), default="Active")  # Active, Paused, Completed, Draft
    budget = Column(Float, default=1000.0)
    spent = Column(Float, default=0.0)
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    cpa = Column(Float, default=0.0)
    roas = Column(Float, default=0.0)
    target_keywords = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("MarketingProject", back_populates="campaigns")

# ----------------- Content Library & Calendar -----------------
class ContentItem(Base):
    __tablename__ = "content_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=False)  # Blog Post, Social Caption, Ad Copy, Email Newsletter, Landing Page
    platform = Column(String(100), default="Blog")  # Blog, Facebook, Instagram, LinkedIn, Google Ads, Email
    body = Column(Text, nullable=False)
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(String(500), nullable=True)
    target_keywords = Column(JSON, default=list)
    hashtags = Column(JSON, default=list)
    media_urls = Column(JSON, default=list)
    status = Column(String(50), default="Draft")  # Draft, In Review, Approved, Scheduled, Published
    scheduled_date = Column(DateTime, nullable=True)
    published_date = Column(DateTime, nullable=True)
    published_url = Column(String(500), nullable=True)
    performance_metrics = Column(JSON, default=dict)  # likes, shares, views, clicks
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="content_items")

# ----------------- SEO & Keywords -----------------
class Keyword(Base):
    __tablename__ = "keywords"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    
    keyword = Column(String(255), nullable=False, index=True)
    current_position = Column(Integer, default=50)
    previous_position = Column(Integer, default=55)
    search_volume = Column(Integer, default=1200)
    difficulty = Column(Integer, default=45)
    intent = Column(String(50), default="Commercial")  # Informational, Commercial, Transactional, Navigational
    target_url = Column(String(500), nullable=True)
    last_checked = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="keywords")

class SeoAudit(Base):
    __tablename__ = "seo_audits"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    
    overall_health_score = Column(Integer, default=85)
    crawl_depth = Column(Integer, default=120)
    passed_checks = Column(Integer, default=45)
    warnings = Column(Integer, default=12)
    critical_errors = Column(Integer, default=3)
    speed_score_mobile = Column(Integer, default=78)
    speed_score_desktop = Column(Integer, default=94)
    issues_breakdown = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="seo_audits")

# ----------------- Leads Pipeline -----------------
class Lead(Base):
    __tablename__ = "leads"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    company = Column(String(255), nullable=True)
    source = Column(String(100), default="Google Ads")  # Google Ads, Meta Ads, Organic Search, LinkedIn, Landing Page
    status = Column(String(50), default="New")  # New, Contacted, Qualified, Proposal Sent, Won, Lost
    lead_score = Column(Integer, default=75)  # 0 to 100
    estimated_value = Column(Float, default=2500.0)
    notes = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    next_follow_up = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="leads")

# ----------------- Daily Reports & Analytics -----------------
class DailyReport(Base):
    __tablename__ = "daily_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    
    report_date = Column(DateTime, default=datetime.utcnow, index=True)
    title = Column(String(255), nullable=False)
    executive_summary = Column(JSON, default=dict)
    seo_metrics = Column(JSON, default=dict)
    social_metrics = Column(JSON, default=dict)
    advertising_metrics = Column(JSON, default=dict)
    lead_metrics = Column(JSON, default=dict)
    ai_operations = Column(JSON, default=dict)
    next_day_plan = Column(JSON, default=dict)
    download_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="daily_reports")

# ----------------- Integrations -----------------
class Integration(Base):
    __tablename__ = "integrations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_id = Column(String(36), ForeignKey("clients.id"), nullable=False, index=True)
    
    provider_name = Column(String(100), nullable=False)  # google_search_console, google_analytics, meta, linkedin, google_ads, wordpress, hubspot, brevo, razorpay
    display_name = Column(String(100), nullable=False)
    category = Column(String(100), default="Marketing")  # SEO, Social, Ads, Website, CRM, Billing
    is_connected = Column(Boolean, default=False)
    is_mock = Column(Boolean, default=True)  # Clearly labels whether live credentials or simulated adapter is used
    credentials = Column(JSON, default=dict)  # Encrypted or stored auth keys / tokens
    account_id = Column(String(255), nullable=True)
    account_name = Column(String(255), nullable=True)
    last_synced_at = Column(DateTime, nullable=True)
    status_message = Column(String(500), default="Configured and active")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="integrations")

# ----------------- Notifications & Audit Logs -----------------
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info")  # info, success, warning, error, approval
    is_read = Column(Boolean, default=False)
    link = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    organization_id = Column(String(36), nullable=True)
    client_id = Column(String(36), nullable=True)
    
    action = Column(String(100), nullable=False)  # e.g. START_CAMPAIGN, APPROVE_CONTENT, ADD_PRODUCT
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="audit_logs")

# ----------------- Subscriptions & Usage -----------------
class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    
    plan_name = Column(String(100), default="Growth Pro")
    status = Column(String(50), default="Active")
    monthly_price = Column(Float, default=499.0)
    max_clients = Column(Integer, default=25)
    max_ai_tokens = Column(Integer, default=5000000)
    current_period_start = Column(DateTime, default=datetime.utcnow)
    current_period_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="subscriptions")
