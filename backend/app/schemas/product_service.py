from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

# ----------------- Product Schemas -----------------
class ProductBase(BaseModel):
    name: str
    sku: Optional[str] = None
    category: Optional[str] = "Digital"
    description: str
    features: List[str] = []
    benefits: List[str] = []
    price: float
    discount: float = 0.0
    product_url: Optional[str] = None
    product_images: List[str] = []
    target_keywords: List[str] = []
    target_audience: Optional[str] = None
    unique_selling_propositions: List[str] = []
    competitor_products: List[str] = []
    availability: str = "In Stock"
    product_status: str = "Active"

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    price: Optional[float] = None
    discount: Optional[float] = None
    product_url: Optional[str] = None
    product_images: Optional[List[str]] = None
    target_keywords: Optional[List[str]] = None
    target_audience: Optional[str] = None
    unique_selling_propositions: Optional[List[str]] = None
    competitor_products: Optional[List[str]] = None
    availability: Optional[str] = None
    product_status: Optional[str] = None

class ProductResponse(ProductBase):
    id: str
    client_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Service Schemas -----------------
class ServiceBase(BaseModel):
    name: str
    description: str
    pricing: Optional[str] = None
    benefits: List[str] = []
    target_audience: Optional[str] = None
    geographic_availability: List[str] = []
    landing_page: Optional[str] = None
    conversion_goal: Optional[str] = "Book a Consultation"
    keywords: List[str] = []
    faqs: List[Dict[str, str]] = []

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    pricing: Optional[str] = None
    benefits: Optional[List[str]] = None
    target_audience: Optional[str] = None
    geographic_availability: Optional[List[str]] = None
    landing_page: Optional[str] = None
    conversion_goal: Optional[str] = None
    keywords: Optional[List[str]] = None
    faqs: Optional[List[Dict[str, str]]] = None

class ServiceResponse(ServiceBase):
    id: str
    client_id: str
    created_at: datetime

    class Config:
        from_attributes = True
