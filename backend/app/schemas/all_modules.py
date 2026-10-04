from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

# ----------------- Content Schemas -----------------
class ContentItemBase(BaseModel):
    title: str
    content_type: str  # Blog Post, Social Caption, Ad Copy, Email Newsletter
    platform: str
    body: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    target_keywords: List[str] = []
    hashtags: List[str] = []
    media_urls: List[str] = []
    status: str = "Draft"
    scheduled_date: Optional[datetime] = None
    published_date: Optional[datetime] = None
    published_url: Optional[str] = None

class ContentItemCreate(ContentItemBase):
    pass

class ContentItemResponse(ContentItemBase):
    id: str
    client_id: str
    performance_metrics: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Lead Schemas -----------------
class LeadBase(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    source: str = "Google Ads"
    status: str = "New"
    lead_score: int = 70
    estimated_value: float = 1500.0
    notes: Optional[str] = None
    ai_summary: Optional[str] = None
    next_follow_up: Optional[datetime] = None

class LeadCreate(LeadBase):
    pass

class LeadResponse(LeadBase):
    id: str
    client_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Report Schemas -----------------
class DailyReportResponse(BaseModel):
    id: str
    client_id: str
    report_date: datetime
    title: str
    executive_summary: Dict[str, Any]
    seo_metrics: Dict[str, Any]
    social_metrics: Dict[str, Any]
    advertising_metrics: Dict[str, Any]
    lead_metrics: Dict[str, Any]
    ai_operations: Dict[str, Any]
    next_day_plan: Dict[str, Any]
    download_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Integration Schemas -----------------
class IntegrationConnectRequest(BaseModel):
    provider_name: str
    display_name: str
    category: str = "Marketing"
    credentials: Dict[str, Any] = {}
    account_id: Optional[str] = None
    account_name: Optional[str] = None
    is_mock: bool = False

class IntegrationResponse(BaseModel):
    id: str
    client_id: str
    provider_name: str
    display_name: str
    category: str
    is_connected: bool
    is_mock: bool
    account_id: Optional[str] = None
    account_name: Optional[str] = None
    last_synced_at: Optional[datetime] = None
    status_message: str
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Approval Schemas -----------------
class ApprovalResponse(BaseModel):
    id: str
    client_id: str
    task_id: Optional[str] = None
    approval_type: str
    title: str
    description: str
    payload_preview: Dict[str, Any]
    risk_level: str
    status: str
    reviewer_notes: Optional[str] = None
    decided_by: Optional[str] = None
    decided_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ApprovalDecisionRequest(BaseModel):
    status: str  # Approved, Rejected, Changes Requested
    reviewer_notes: Optional[str] = None
