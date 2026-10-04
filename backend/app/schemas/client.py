from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr

class ClientBase(BaseModel):
    company_name: str
    contact_person: str
    email: EmailStr
    phone: Optional[str] = None
    business_website: str
    industry: str
    business_description: Optional[str] = None
    business_location: Optional[str] = None
    target_countries: List[str] = []
    target_cities: List[str] = []
    preferred_languages: List[str] = ["English"]
    target_audience: Optional[str] = None
    competitor_websites: List[str] = []
    monthly_marketing_budget: float = 5000.0
    marketing_objectives: List[str] = []
    brand_tone: str = "Professional & Authoritative"
    brand_guidelines: Optional[str] = None
    logo: Optional[str] = None
    business_images: List[str] = []
    account_status: str = "Ready to Launch"
    assigned_manager_id: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    company_name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    business_website: Optional[str] = None
    industry: Optional[str] = None
    business_description: Optional[str] = None
    business_location: Optional[str] = None
    target_countries: Optional[List[str]] = None
    target_cities: Optional[List[str]] = None
    preferred_languages: Optional[List[str]] = None
    target_audience: Optional[str] = None
    competitor_websites: Optional[List[str]] = None
    monthly_marketing_budget: Optional[float] = None
    marketing_objectives: Optional[List[str]] = None
    brand_tone: Optional[str] = None
    brand_guidelines: Optional[str] = None
    logo: Optional[str] = None
    business_images: Optional[List[str]] = None
    account_status: Optional[str] = None
    assigned_manager_id: Optional[str] = None

class ClientResponse(ClientBase):
    id: str
    organization_id: str
    created_at: datetime
    updated_at: datetime
    
    # Counts
    products_count: Optional[int] = 0
    services_count: Optional[int] = 0
    active_campaigns_count: Optional[int] = 0

    class Config:
        from_attributes = True
