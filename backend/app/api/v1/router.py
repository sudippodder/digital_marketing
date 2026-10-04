from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.clients import router as clients_router
from app.api.v1.products_services import router as products_services_router
from app.api.v1.marketing_projects import router as projects_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.content_leads_reports import router as modules_router
from app.api.v1.admin_notifications import router as admin_notifications_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(clients_router)
api_router.include_router(products_services_router)
api_router.include_router(projects_router)
api_router.include_router(tasks_router)
api_router.include_router(modules_router)
api_router.include_router(admin_notifications_router)
