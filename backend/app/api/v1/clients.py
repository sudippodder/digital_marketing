from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import Client, User, UserRole, Organization, MarketingProject, Product, Service
from app.core.deps import get_current_user, require_roles, verify_client_access
from app.schemas.client import ClientCreate, ClientUpdate, ClientResponse

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("", response_model=List[ClientResponse])
def get_clients(
    status: Optional[str] = None,
    industry: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Client)
    
    # Tenant isolation
    if current_user.role == UserRole.CLIENT:
        query = query.filter(Client.id == current_user.client_id)
    elif current_user.organization_id:
        query = query.filter(Client.organization_id == current_user.organization_id)

    if status:
        query = query.filter(Client.account_status == status)
    if industry:
        query = query.filter(Client.industry.ilike(f"%{industry}%"))

    clients = query.order_by(Client.created_at.desc()).all()
    
    response = []
    for c in clients:
        c_dict = ClientResponse.model_validate(c)
        c_dict.products_count = len(c.products)
        c_dict.services_count = len(c.services)
        c_dict.active_campaigns_count = len([p for p in c.marketing_projects if p.status == "Active"])
        response.append(c_dict)
        
    return response

@router.post("", response_model=ClientResponse)
def create_client(
    client_in: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    org_id = current_user.organization_id
    if not org_id:
        org = db.query(Organization).first()
        org_id = org.id if org else None

    client = Client(
        organization_id=org_id,
        company_name=client_in.company_name,
        contact_person=client_in.contact_person,
        email=client_in.email,
        phone=client_in.phone,
        business_website=client_in.business_website,
        industry=client_in.industry,
        business_description=client_in.business_description,
        business_location=client_in.business_location,
        target_countries=client_in.target_countries,
        target_cities=client_in.target_cities,
        preferred_languages=client_in.preferred_languages,
        target_audience=client_in.target_audience,
        competitor_websites=client_in.competitor_websites,
        monthly_marketing_budget=client_in.monthly_marketing_budget,
        marketing_objectives=client_in.marketing_objectives,
        brand_tone=client_in.brand_tone,
        brand_guidelines=client_in.brand_guidelines,
        logo=client_in.logo,
        business_images=client_in.business_images,
        account_status=client_in.account_status,
        assigned_manager_id=client_in.assigned_manager_id or current_user.id
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    
    c_res = ClientResponse.model_validate(client)
    c_res.products_count = 0
    c_res.services_count = 0
    c_res.active_campaigns_count = 0
    return c_res

@router.get("/{client_id}", response_model=ClientResponse)
def get_client(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_client_access(current_user, client_id, db)
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    res = ClientResponse.model_validate(client)
    res.products_count = len(client.products)
    res.services_count = len(client.services)
    res.active_campaigns_count = len([p for p in client.marketing_projects if p.status == "Active"])
    return res

@router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: str,
    client_update: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    update_data = client_update.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(client, field, val)

    db.commit()
    db.refresh(client)

    res = ClientResponse.model_validate(client)
    res.products_count = len(client.products)
    res.services_count = len(client.services)
    res.active_campaigns_count = len([p for p in client.marketing_projects if p.status == "Active"])
    return res

@router.delete("/{client_id}")
def delete_client(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    db.delete(client)
    db.commit()
    return {"message": "Client deleted successfully"}
