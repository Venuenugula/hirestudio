from fastapi import APIRouter

from app.api.v1 import auth, careers_page, company, health, jobs, public

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(company.router)
api_router.include_router(careers_page.router)
api_router.include_router(jobs.router)
api_router.include_router(public.router)
