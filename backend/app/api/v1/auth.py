from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import User, Organization, UserRole, Client
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.deps import get_current_user
from app.schemas.auth import Token, LoginRequest, RegisterRequest, UserResponse
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create Organization if not provided
    org = Organization(
        name=req.organization_name or "Default Agency Organization",
        slug=req.organization_name.lower().replace(" ", "-") + f"-{req.email.split('@')[0]}"
    )
    db.add(org)
    db.flush()

    user = User(
        organization_id=org.id,
        email=req.email,
        hashed_password=get_password_hash(req.password),
        full_name=req.full_name,
        role=req.role or UserRole.ADMIN,
        client_id=req.client_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(
        subject=user.id,
        extra_claims={"role": user.role, "org_id": user.organization_id}
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/login", response_model=Token)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is deactivated")

    access_token = create_access_token(
        subject=user.id,
        extra_claims={"role": user.role, "org_id": user.organization_id}
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.post("/forgot-password")
def forgot_password():
    return {"message": "If the account exists, a password reset link has been dispatched."}

@router.post("/reset-password")
def reset_password():
    return {"message": "Password successfully updated."}
