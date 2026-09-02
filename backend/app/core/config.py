import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Resilience OS"
    API_V1_STR: str = "/api/v1"
    
    # AI Integration Boundary
    AI_PROVIDER_ENABLED: bool = False
    
    # SAP Integration Boundary
    SAP_ENABLED: bool = False
    SAP_BASE_URL: str = ""
    SAP_CLIENT_ID: str = ""
    SAP_CLIENT_SECRET: str = ""
    SAP_AUTH_URL: str = ""
    
    # We will load this from .env or environment
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+psycopg2://resilience_user:resilience_pass@localhost:5432/resilience_db"
    )

    class Config:
        env_file = ".env"

settings = Settings()
