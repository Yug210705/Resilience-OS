from fastapi import APIRouter
from app.api.routes import master_data, graph, scenarios, impact, recovery, ai, integrations

api_router = APIRouter()
api_router.include_router(master_data.router, prefix="", tags=["Master Data"])
api_router.include_router(graph.router, prefix="/network", tags=["Network Graph"])
api_router.include_router(scenarios.router, prefix="/scenarios", tags=["Scenarios"])
api_router.include_router(ai.router, prefix="/scenarios", tags=["AI Integration"])
api_router.include_router(impact.router, prefix="/scenarios", tags=["Impact Engine"])
api_router.include_router(recovery.router, prefix="/scenarios", tags=["Recovery Engine"])
api_router.include_router(integrations.router, prefix="/integrations", tags=["Enterprise Integrations"])
