import asyncio
import logging
from datetime import datetime
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.db.models import MarketingTask, TaskStatus, Client, MarketingProject
from app.services.orchestrator import orchestrator

logger = logging.getLogger(__name__)

class TaskRunner:
    @staticmethod
    async def process_project_tasks(project_id: str, limit: int = 3):
        """
        Process queued tasks for a marketing project.
        """
        db = SessionLocal()
        try:
            project = db.query(MarketingProject).filter(MarketingProject.id == project_id).first()
            if not project or project.status != "Active":
                return

            client = db.query(Client).filter(Client.id == project.client_id).first()
            if not client:
                return

            queued_tasks = (
                db.query(MarketingTask)
                .filter(
                    MarketingTask.project_id == project_id,
                    MarketingTask.status.in_([TaskStatus.QUEUED, TaskStatus.PENDING])
                )
                .order_by(MarketingTask.day_number.asc(), MarketingTask.created_at.asc())
                .limit(limit)
                .all()
            )

            for task in queued_tasks:
                logger.info(f"Executing task {task.id}: {task.title} for client {client.company_name}")
                await orchestrator.execute_task(task, client, db)
                # Small yield for async smoothness
                await asyncio.sleep(0.1)

        except Exception as e:
            logger.exception(f"Error in process_project_tasks for project {project_id}: {e}")
        finally:
            db.close()

    @staticmethod
    async def run_single_task(task_id: str):
        db = SessionLocal()
        try:
            task = db.query(MarketingTask).filter(MarketingTask.id == task_id).first()
            if not task:
                return {"error": "Task not found"}

            client = db.query(Client).filter(Client.id == task.client_id).first()
            if not client:
                return {"error": "Client not found"}

            return await orchestrator.execute_task(task, client, db)
        finally:
            db.close()

task_runner = TaskRunner()
