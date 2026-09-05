from fastapi import APIRouter

from app.api.v1 import careers_page, company, health

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(company.router)
api_router.include_router(careers_page.router)
