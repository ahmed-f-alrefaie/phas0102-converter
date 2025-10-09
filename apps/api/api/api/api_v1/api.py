from fastapi import APIRouter
from .endpoints import jupyter
api_router = APIRouter()

api_router.include_router(jupyter.router, prefix="/jupyter", tags=["jupyter"], responses={404: {"description": "Not found"}})
