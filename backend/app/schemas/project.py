from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class MarketingProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    selected_services: List[str] = [
        "SEO Audit",
        "Keyword Research",
        "Competitor Analysis",
        "On-Page SEO",
        "Blog Content Creation",
        "Social Media Content",
        "Facebook Marketing",
        "Instagram Marketing",
        "LinkedIn Marketing",
        "Google Ads",
        "Meta Ads",
        "Email Marketing",
        "Lead Generation",
        "Lead Nurturing",
        "Performance Analytics",
        "Daily Reporting",
        "Monthly Marketing Strategy"
    ]
    auto_pilot: bool = True
    monthly_budget: float = 5000.0

class MarketingProjectCreate(MarketingProjectBase):
    pass

class MarketingStrategyResponse(BaseModel):
    id: str
    project_id: str
    version: int
    status: str
    title: str
    executive_summary: str
    target_personas: List[Dict[str, Any]]
    channel_strategies: Dict[str, Any]
    kpi_targets: Dict[str, Any]
    budget_allocation: Dict[str, Any]
    ai_rationale: Optional[str] = None
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class MarketingPlanResponse(BaseModel):
    id: str
    project_id: str
    title: str
    duration_days: int
    phases: List[Dict[str, Any]]
    weekly_breakdown: List[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True

class MarketingProjectResponse(MarketingProjectBase):
    id: str
    client_id: str
    status: str
    current_campaign_execution_id: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    strategies: List[MarketingStrategyResponse] = []
    plans: List[MarketingPlanResponse] = []
    tasks_count: Optional[int] = 0
    completed_tasks_count: Optional[int] = 0

    class Config:
        from_attributes = True

class StartMarketingValidationResult(BaseModel):
    is_valid: bool
    checks: Dict[str, bool]
    warnings: List[str] = []
    errors: List[str] = []
    ready_to_start: bool
