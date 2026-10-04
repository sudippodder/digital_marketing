import uuid
import logging
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import (
    MarketingProject, Client, MarketingStrategy, MarketingPlan,
    MarketingTask, TaskStatus, User, UserRole, Notification, AuditLog
)
from app.core.deps import get_current_user, require_roles, verify_client_access
from app.schemas.project import (
    MarketingProjectCreate, MarketingProjectResponse,
    MarketingStrategyResponse, MarketingPlanResponse,
    StartMarketingValidationResult
)
from app.services.orchestrator import orchestrator
from app.services.task_runner import task_runner

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Marketing Projects & Activation"])

@router.get("/clients/{client_id}/marketing-projects", response_model=List[MarketingProjectResponse])
def get_client_projects(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_client_access(current_user, client_id, db)
    projects = db.query(MarketingProject).filter(MarketingProject.client_id == client_id).all()
    
    result = []
    for p in projects:
        p_res = MarketingProjectResponse.model_validate(p)
        p_res.tasks_count = len(p.tasks)
        p_res.completed_tasks_count = len([t for t in p.tasks if t.status == TaskStatus.COMPLETED])
        result.append(p_res)
    return result

@router.post("/clients/{client_id}/marketing-projects", response_model=MarketingProjectResponse)
def create_project(
    client_id: str,
    proj_in: MarketingProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    project = MarketingProject(
        client_id=client_id,
        title=proj_in.title,
        description=proj_in.description,
        status="Draft",
        selected_services=proj_in.selected_services,
        auto_pilot=proj_in.auto_pilot,
        monthly_budget=proj_in.monthly_budget
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    p_res = MarketingProjectResponse.model_validate(project)
    p_res.tasks_count = 0
    p_res.completed_tasks_count = 0
    return p_res

@router.get("/marketing-projects/{project_id}/validate", response_model=StartMarketingValidationResult)
def validate_marketing_activation(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(MarketingProject).filter(MarketingProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Marketing Project not found")

    client = db.query(Client).filter(Client.id == project.client_id).first()
    res = orchestrator.validate_client_readiness(client)
    return StartMarketingValidationResult(**res)

@router.post("/marketing-projects/{project_id}/start")
async def start_digital_marketing(
    project_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    """
    Core idempotent activation endpoint for the prominent START DIGITAL MARKETING button.
    """
    project = db.query(MarketingProject).filter(MarketingProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Marketing Project not found")

    client = db.query(Client).filter(Client.id == project.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Validate readiness
    val_res = orchestrator.validate_client_readiness(client)
    if not val_res["is_valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Client profile is incomplete", "errors": val_res["errors"]}
        )

    # Idempotent campaign execution ID
    campaign_exec_id = f"EXEC-{client.company_name.upper().replace(' ', '')[:4]}-{datetime.utcnow().strftime('%Y%m%d%H%M')}-{uuid.uuid4().hex[:6]}"
    
    project.status = "Active"
    project.current_campaign_execution_id = campaign_exec_id
    project.start_date = datetime.utcnow()
    client.account_status = "Active"

    # Generate Strategy if none exists
    if not project.strategies:
        strategy = orchestrator.generate_strategy(client, project)
        db.add(strategy)

    # Generate 30-day plan if none exists
    if not project.plans:
        plan = orchestrator.generate_30_day_plan(project)
        db.add(plan)

    # Generate persistent marketing tasks if none exist
    if not project.tasks:
        initial_tasks = orchestrator.create_initial_task_queue(client, project)
        for t in initial_tasks:
            db.add(t)

    # Notification & Audit
    notification = Notification(
        user_id=current_user.id,
        title="🚀 Digital Marketing Activated!",
        message=f"OmniFlow AI marketing workflow started for {client.company_name} (Execution ID: {campaign_exec_id}).",
        type="success"
    )
    db.add(notification)

    audit = AuditLog(
        user_id=current_user.id,
        organization_id=client.organization_id,
        client_id=client.id,
        action="START_DIGITAL_MARKETING",
        resource_type="MarketingProject",
        resource_id=project.id,
        details={"execution_id": campaign_exec_id, "monthly_budget": project.monthly_budget}
    )
    db.add(audit)

    db.commit()

    # Trigger background tasks execution
    background_tasks.add_task(task_runner.process_project_tasks, project.id, 4)

    return {
        "success": True,
        "message": f"Marketing successfully started for {client.company_name}!",
        "execution_id": campaign_exec_id,
        "status": "Active",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.post("/marketing-projects/{project_id}/pause")
def pause_marketing(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER, UserRole.CLIENT]))
):
    project = db.query(MarketingProject).filter(MarketingProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Marketing Project not found")

    project.status = "Paused"
    db.commit()
    return {"message": "Marketing campaigns paused successfully", "status": "Paused"}

@router.post("/marketing-projects/{project_id}/resume")
def resume_marketing(
    project_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    project = db.query(MarketingProject).filter(MarketingProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Marketing Project not found")

    project.status = "Active"
    db.commit()
    background_tasks.add_task(task_runner.process_project_tasks, project.id, 2)
    return {"message": "Marketing campaigns resumed successfully", "status": "Active"}

@router.post("/marketing-projects/{project_id}/stop")
def stop_marketing(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
):
    project = db.query(MarketingProject).filter(MarketingProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Marketing Project not found")

    project.status = "Stopped"
    # Mark pending tasks as Cancelled to prevent execution
    for task in project.tasks:
        if task.status in [TaskStatus.PENDING, TaskStatus.QUEUED]:
            task.status = TaskStatus.CANCELLED

    db.commit()
    return {"message": "Marketing stopped. Future tasks cancelled while preserving historical records.", "status": "Stopped"}

@router.post("/marketing-projects/{project_id}/generate-strategy", response_model=MarketingStrategyResponse)
def generate_strategy_endpoint(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    project = db.query(MarketingProject).filter(MarketingProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Marketing Project not found")

    client = db.query(Client).filter(Client.id == project.client_id).first()
    strategy = orchestrator.generate_strategy(client, project)
    db.add(strategy)
    db.commit()
    db.refresh(strategy)
    return strategy

@router.get("/marketing-projects/{project_id}/strategy", response_model=Optional[MarketingStrategyResponse])
def get_strategy(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    strategy = db.query(MarketingStrategy).filter(MarketingStrategy.project_id == project_id).order_by(MarketingStrategy.created_at.desc()).first()
    return strategy
