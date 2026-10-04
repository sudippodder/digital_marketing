from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import Notification, AuditLog, User, Client, MarketingProject, MarketingTask, Lead, Approval, TaskStatus, UserRole
from app.core.deps import get_current_user, require_roles

router = APIRouter()

# ----------------- Notifications -----------------
@router.get("/notifications", tags=["Notifications"])
def get_user_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).limit(25).all()

@router.post("/notifications/{notification_id}/read", tags=["Notifications"])
def mark_notification_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    n = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if n:
        n.is_read = True
        db.commit()
    return {"message": "Notification marked as read"}

@router.post("/notifications/read-all", tags=["Notifications"])
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(Notification).filter(Notification.user_id == current_user.id).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}

# ----------------- Admin Stats & Audit Logs -----------------
@router.get("/admin/stats", tags=["Admin"])
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    total_clients = db.query(Client).count()
    active_clients = db.query(Client).filter(Client.account_status == "Active").count()
    paused_campaigns = db.query(MarketingProject).filter(MarketingProject.status == "Paused").count()
    total_tasks = db.query(MarketingTask).count()
    completed_tasks = db.query(MarketingTask).filter(MarketingTask.status == TaskStatus.COMPLETED).count()
    failed_tasks = db.query(MarketingTask).filter(MarketingTask.status == TaskStatus.FAILED).count()
    pending_approvals = db.query(Approval).filter(Approval.status == "Pending").count()
    total_leads = db.query(Lead).count()

    total_ai_tokens = sum([t.token_usage for t in db.query(MarketingTask).all()])
    total_spend = sum([c.monthly_marketing_budget for c in db.query(Client).all()])

    return {
        "total_clients": total_clients,
        "active_clients": active_clients,
        "paused_campaigns": paused_campaigns,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "failed_tasks": failed_tasks,
        "pending_approvals": pending_approvals,
        "total_leads": total_leads,
        "total_ai_tokens": total_ai_tokens,
        "estimated_marketing_spend": total_spend
    }

@router.get("/admin/audit-logs", tags=["Admin"])
def get_audit_logs(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    return db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()

@router.get("/admin/users", tags=["Admin"])
def get_system_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [{"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role, "client_id": u.client_id, "is_active": u.is_active} for u in users]
