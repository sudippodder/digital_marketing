from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import MarketingTask, TaskStatus, User, UserRole
from app.core.deps import get_current_user, require_roles
from app.schemas.task import MarketingTaskResponse, TaskRetryRequest
from app.services.task_runner import task_runner

router = APIRouter(tags=["Tasks"])

@router.get("/marketing-projects/{project_id}/tasks", response_model=List[MarketingTaskResponse])
def get_project_tasks(
    project_id: str,
    status: Optional[str] = None,
    agent_name: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(MarketingTask).filter(MarketingTask.project_id == project_id)
    if status:
        query = query.filter(MarketingTask.status == status)
    if agent_name:
        query = query.filter(MarketingTask.agent_name == agent_name)

    tasks = query.order_by(MarketingTask.day_number.asc(), MarketingTask.created_at.asc()).all()
    return tasks

@router.get("/tasks/{task_id}", response_model=MarketingTaskResponse)
def get_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(MarketingTask).filter(MarketingTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/tasks/{task_id}/retry", response_model=MarketingTaskResponse)
async def retry_task(
    task_id: str,
    retry_req: Optional[TaskRetryRequest] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    task = db.query(MarketingTask).filter(MarketingTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = TaskStatus.QUEUED
    task.error_message = None
    if retry_req and retry_req.override_params:
        task.input_parameters.update(retry_req.override_params)
    db.commit()

    # Execute immediately
    await task_runner.run_single_task(task_id)
    db.refresh(task)
    return task

@router.post("/tasks/{task_id}/cancel")
def cancel_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    task = db.query(MarketingTask).filter(MarketingTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = TaskStatus.CANCELLED
    db.commit()
    return {"message": "Task marked as cancelled"}

@router.post("/tasks/{task_id}/execute-now")
async def execute_task_now(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING_MANAGER]))
):
    task = db.query(MarketingTask).filter(MarketingTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    res = await task_runner.run_single_task(task_id)
    db.refresh(task)
    return {"message": "Task executed", "task": MarketingTaskResponse.model_validate(task), "agent_result": res}
