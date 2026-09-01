from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

DATABASE_URL = os.environ.get("SAP_HANA_URL", os.environ.get("DATABASE_URL", "sqlite:///./recovery_plans.db"))

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

# Enterprise SAP HANA Cloud connection pooling settings
engine_args = {
    "pool_size": 20,
    "max_overflow": 10,
    "pool_timeout": 30,
    "pool_recycle": 1800, # Recycle connections every 30 mins to prevent firewalls dropping them
} if "hana" in DATABASE_URL.lower() else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
