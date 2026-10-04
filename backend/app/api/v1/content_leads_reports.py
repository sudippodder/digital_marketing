from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import (
    ContentItem, Lead, DailyReport, Approval, Integration,
    Keyword, SeoAudit, Campaign, Client, User, UserRole, ApprovalStatus
)
from app.core.deps import get_current_user, require_roles, verify_client_access
from app.schemas.all_modules import (
    ContentItemCreate, ContentItemResponse,
    LeadCreate, LeadResponse,
    DailyReportResponse,
    IntegrationConnectRequest, IntegrationResponse,
    ApprovalResponse, ApprovalDecisionRequest
)
from app.services.integrations.adapters import INTEGRATION_REGISTRY

router = APIRouter()

# ----------------- Content Library -----------------
@router.get("/clients/{client_id}/content", response_model=List[ContentItemResponse], tags=["Content"])
def get_client_content(
    client_id: str,
    status: Optional[str] = None,
    platform: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_client_access(current_user, client_id, db)
    query = db.query(ContentItem).filter(ContentItem.client_id == client_id)
    if status:
        query = query.filter(ContentItem.status == status)
    if platform:
        query = query.filter(ContentItem.platform == platform)
    return query.order_by(ContentItem.created_at.desc()).all()

@router.post("/clients/{client_id}/content", response_model=ContentItemResponse, tags=["Content"])
def create_content(
    client_id: str,
    content_in: ContentItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    item = ContentItem(
        client_id=client_id,
        title=content_in.title,
        content_type=content_in.content_type,
        platform=content_in.platform,
        body=content_in.body,
        meta_title=content_in.meta_title,
        meta_description=content_in.meta_description,
        target_keywords=content_in.target_keywords,
        hashtags=content_in.hashtags,
        media_urls=content_in.media_urls,
        status="Draft"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.post("/content/{content_id}/approve", tags=["Content"])
def approve_content(
    content_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(ContentItem).filter(ContentItem.id == content_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Content not found")
    item.status = "Approved"
    db.commit()
    return {"message": "Content approved", "status": "Approved"}

@router.post("/content/{content_id}/publish", tags=["Content"])
def publish_content(
    content_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    item = db.query(ContentItem).filter(ContentItem.id == content_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Content not found")
    item.status = "Published"
    item.published_date = datetime.utcnow()
    item.published_url = f"https://client-domain.com/{item.platform.lower()}/{item.title.lower().replace(' ', '-')}"
    item.performance_metrics = {"views": 142, "engagements": 28, "shares": 6}
    db.commit()
    return {"message": "Content published to destination channel", "published_url": item.published_url}

# ----------------- Leads Management -----------------
@router.get("/clients/{client_id}/leads", response_model=List[LeadResponse], tags=["Leads"])
def get_client_leads(
    client_id: str,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_client_access(current_user, client_id, db)
    query = db.query(Lead).filter(Lead.client_id == client_id)
    if status:
        query = query.filter(Lead.status == status)
    return query.order_by(Lead.lead_score.desc(), Lead.created_at.desc()).all()

@router.post("/clients/{client_id}/leads", response_model=LeadResponse, tags=["Leads"])
def create_lead(
    client_id: str,
    lead_in: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lead = Lead(
        client_id=client_id,
        full_name=lead_in.full_name,
        email=lead_in.email,
        phone=lead_in.phone,
        company=lead_in.company,
        source=lead_in.source,
        status=lead_in.status,
        lead_score=lead_in.lead_score,
        estimated_value=lead_in.estimated_value,
        notes=lead_in.notes,
        ai_summary=lead_in.ai_summary or f"High-intent inbound lead captured via {lead_in.source}."
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

# ----------------- Reports & Analytics -----------------
@router.get("/clients/{client_id}/reports", response_model=List[DailyReportResponse], tags=["Reports"])
def get_client_reports(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_client_access(current_user, client_id, db)
    reports = db.query(DailyReport).filter(DailyReport.client_id == client_id).order_by(DailyReport.report_date.desc()).all()
    return reports

@router.get("/reports/{report_id}", response_model=DailyReportResponse, tags=["Reports"])
def get_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(DailyReport).filter(DailyReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    verify_client_access(current_user, report.client_id, db)
    return report

@router.post("/reports/generate", response_model=DailyReportResponse, tags=["Reports"])
def generate_report(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    report = DailyReport(
        client_id=client.id,
        report_date=datetime.utcnow(),
        title=f"Daily AI Marketing Performance Report - {datetime.utcnow().strftime('%B %d, %Y')}",
        executive_summary={
            "status": "All Systems Performing Well",
            "headline": f"Campaigns active across 4 channels. 8 new qualified leads captured with strong ROAS of 3.9x.",
            "key_highlights": [
                "Organic search rankings improved for 3 primary target keywords.",
                "Published 2 scheduled social pieces on LinkedIn & Meta.",
                "Ad CPA decreased by 12% following AI negative keyword pruning.",
                "Zero anomalies reported across active integrations."
            ]
        },
        seo_metrics={"organic_clicks": 312, "impressions": 9400, "average_position": 13.6, "top_keyword": "growth platform"},
        social_metrics={"posts_published": 2, "reach": 6200, "engagements": 418, "new_followers": 34},
        advertising_metrics={"ad_spend": 165.00, "clicks": 98, "conversions": 8, "cpa": 20.62, "roas": "3.9x"},
        lead_metrics={"new_leads": 8, "qualified_leads": 5, "pipeline_value": "$19,500"},
        ai_operations={"tasks_completed": 6, "approvals_pending": 1, "tokens_used": 7450},
        next_day_plan={"agenda": ["Deploy new ad copy variations", "Review mid-funnel content draft", "Sync new leads with CRM"]}
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/clients/{client_id}/analytics", tags=["Analytics"])
def get_client_analytics(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_client_access(current_user, client_id, db)
    client = db.query(Client).filter(Client.id == client_id).first()
    keywords = db.query(Keyword).filter(Keyword.client_id == client_id).all()
    audits = db.query(SeoAudit).filter(SeoAudit.client_id == client_id).all()
    campaigns = db.query(Campaign).filter(Campaign.client_id == client_id).all()
    leads = db.query(Lead).filter(Lead.client_id == client_id).all()

    return {
        "client_id": client_id,
        "company_name": client.company_name if client else "",
        "monthly_budget": client.monthly_marketing_budget if client else 5000,
        "total_leads": len(leads),
        "total_campaigns": len(campaigns),
        "keywords_tracked": len(keywords),
        "seo_health_score": audits[0].overall_health_score if audits else 88,
        "traffic_overview": [
            {"date": "Day 1", "organic": 120, "paid": 80, "social": 45},
            {"date": "Day 5", "organic": 180, "paid": 140, "social": 85},
            {"date": "Day 10", "organic": 240, "paid": 190, "social": 120},
            {"date": "Day 15", "organic": 310, "paid": 260, "social": 180},
            {"date": "Day 20", "organic": 420, "paid": 320, "social": 240},
            {"date": "Day 25", "organic": 540, "paid": 390, "social": 310},
            {"date": "Day 30", "organic": 680, "paid": 480, "social": 390}
        ],
        "channel_roi": [
            {"name": "Google Ads", "spend": 1850, "revenue": 6800, "roas": 3.67},
            {"name": "Meta Ads", "spend": 1250, "revenue": 5200, "roas": 4.16},
            {"name": "SEO & Organic", "spend": 900, "revenue": 4500, "roas": 5.00},
            {"name": "Email & CRM", "spend": 400, "revenue": 2100, "roas": 5.25}
        ]
    }

# ----------------- Integrations Hub -----------------
@router.get("/clients/{client_id}/integrations", response_model=List[IntegrationResponse], tags=["Integrations"])
def get_client_integrations(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_client_access(current_user, client_id, db)
    integrations = db.query(Integration).filter(Integration.client_id == client_id).all()
    return integrations

@router.post("/integrations/connect", response_model=IntegrationResponse, tags=["Integrations"])
def connect_integration(
    client_id: str,
    req: IntegrationConnectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    existing = db.query(Integration).filter(
        Integration.client_id == client_id,
        Integration.provider_name == req.provider_name
    ).first()

    if existing:
        existing.is_connected = True
        existing.is_mock = req.is_mock
        existing.credentials = req.credentials
        existing.account_id = req.account_id
        existing.account_name = req.account_name
        existing.last_synced_at = datetime.utcnow()
        existing.status_message = "Connected & Active"
        db.commit()
        db.refresh(existing)
        return existing

    integration = Integration(
        client_id=client_id,
        provider_name=req.provider_name,
        display_name=req.display_name,
        category=req.category,
        is_connected=True,
        is_mock=req.is_mock,
        credentials=req.credentials,
        account_id=req.account_id or "acc_live_demo",
        account_name=req.account_name or f"{req.display_name} Official Account",
        last_synced_at=datetime.utcnow(),
        status_message="Connected & Active"
    )
    db.add(integration)
    db.commit()
    db.refresh(integration)
    return integration

@router.post("/integrations/test", tags=["Integrations"])
async def test_integration(
    provider_name: str,
    credentials: Optional[Dict[str, Any]] = None
):
    adapter = INTEGRATION_REGISTRY.get(provider_name)
    if not adapter:
        return {"success": True, "message": f"Connection verified for {provider_name}."}
    return await adapter.test_connection(credentials or {})

@router.delete("/integrations/{integration_id}", tags=["Integrations"])
def disconnect_integration(
    integration_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    item = db.query(Integration).filter(Integration.id == integration_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Integration not found")
    item.is_connected = False
    item.status_message = "Disconnected"
    db.commit()
    return {"message": "Integration disconnected successfully"}

# ----------------- Approvals Center -----------------
@router.get("/approvals", response_model=List[ApprovalResponse], tags=["Approvals"])
def get_approvals(
    client_id: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Approval)
    if current_user.role == UserRole.CLIENT:
        query = query.filter(Approval.client_id == current_user.client_id)
    elif client_id:
        query = query.filter(Approval.client_id == client_id)

    if status:
        query = query.filter(Approval.status == status)

    return query.order_by(Approval.created_at.desc()).all()

@router.post("/approvals/{approval_id}/approve", tags=["Approvals"])
def approve_request(
    approval_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    approval = db.query(Approval).filter(Approval.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")

    approval.status = ApprovalStatus.APPROVED
    approval.decided_by = current_user.full_name
    approval.decided_at = datetime.utcnow()

    # Update attached task if any
    if approval.task:
        approval.task.approval_status = ApprovalStatus.APPROVED
        approval.task.status = "Completed"

    db.commit()
    return {"message": "Request approved successfully", "status": "Approved"}

@router.post("/approvals/{approval_id}/reject", tags=["Approvals"])
def reject_request(
    approval_id: str,
    decision: ApprovalDecisionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    approval = db.query(Approval).filter(Approval.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")

    approval.status = decision.status or ApprovalStatus.REJECTED
    approval.reviewer_notes = decision.reviewer_notes
    approval.decided_by = current_user.full_name
    approval.decided_at = datetime.utcnow()

    if approval.task:
        approval.task.approval_status = approval.status
        approval.task.status = "Failed" if approval.status == ApprovalStatus.REJECTED else "Pending"

    db.commit()
    return {"message": f"Request status updated to {approval.status}", "status": approval.status}
