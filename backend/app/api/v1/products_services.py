from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import Product, Service, Client, User, UserRole
from app.core.deps import get_current_user, require_roles, verify_client_access
from app.schemas.product_service import (
    ProductCreate, ProductUpdate, ProductResponse,
    ServiceCreate, ServiceUpdate, ServiceResponse
)

router = APIRouter(tags=["Products & Services"])

# ----------------- Products -----------------
@router.get("/clients/{client_id}/products", response_model=List[ProductResponse])
def get_client_products(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_client_access(current_user, client_id, db)
    products = db.query(Product).filter(Product.client_id == client_id).all()
    return products

@router.post("/clients/{client_id}/products", response_model=ProductResponse)
def create_product(
    client_id: str,
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    product = Product(
        client_id=client_id,
        name=product_in.name,
        sku=product_in.sku,
        category=product_in.category,
        description=product_in.description,
        features=product_in.features,
        benefits=product_in.benefits,
        price=product_in.price,
        discount=product_in.discount,
        product_url=product_in.product_url,
        product_images=product_in.product_images,
        target_keywords=product_in.target_keywords,
        target_audience=product_in.target_audience,
        unique_selling_propositions=product_in.unique_selling_propositions,
        competitor_products=product_in.competitor_products,
        availability=product_in.availability,
        product_status=product_in.product_status
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_in.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(product, k, v)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}")
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product removed successfully"}

# ----------------- Services -----------------
@router.get("/clients/{client_id}/services", response_model=List[ServiceResponse])
def get_client_services(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_client_access(current_user, client_id, db)
    services = db.query(Service).filter(Service.client_id == client_id).all()
    return services

@router.post("/clients/{client_id}/services", response_model=ServiceResponse)
def create_service(
    client_id: str,
    service_in: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    service = Service(
        client_id=client_id,
        name=service_in.name,
        description=service_in.description,
        pricing=service_in.pricing,
        benefits=service_in.benefits,
        target_audience=service_in.target_audience,
        geographic_availability=service_in.geographic_availability,
        landing_page=service_in.landing_page,
        conversion_goal=service_in.conversion_goal,
        keywords=service_in.keywords,
        faqs=service_in.faqs
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service

@router.put("/services/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: str,
    service_in: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    update_data = service_in.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(service, k, v)

    db.commit()
    db.refresh(service)
    return service

@router.delete("/services/{service_id}")
def delete_service(
    service_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    db.delete(service)
    db.commit()
    return {"message": "Service removed successfully"}
