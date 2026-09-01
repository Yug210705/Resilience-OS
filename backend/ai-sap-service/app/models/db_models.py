from sqlalchemy import Column, String, Float, JSON, DateTime
from datetime import datetime
from app.database import Base
import uuid

class RecoveryPlanRecord(Base):
    __tablename__ = 'recovery_plans'
    
    id = Column(String, primary_key=True, default=lambda: f"RP-{str(uuid.uuid4())[:8].upper()}")
    disruption_id = Column(String, nullable=False, index=True)
    strategy = Column(String, nullable=False) # e.g., "Activate SUP-004"
    supplier_id = Column(String, nullable=False)
    
    # Metrics
    total_cost = Column(Float, nullable=False)
    max_delay_days = Column(Float, nullable=False)
    blended_risk = Column(Float, nullable=False)
    total_sla_exposure = Column(Float, nullable=False)
    final_score = Column(Float, nullable=False)
    orders_recovered_pct = Column(Float, nullable=True) # Derivable or stored
    
    # State machine: PENDING_AUDIT -> PENDING_APPROVAL -> APPROVED -> ACTIVE -> COMPLETED
    status = Column(String, default="PENDING_AUDIT", nullable=False)
    
    # Store complete recovery plan payload context for details
    details = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class ScenarioRecord(Base):
    __tablename__ = 'scenarios'
    
    id = Column(String, primary_key=True, default=lambda: f"SCN-{str(uuid.uuid4())[:8].upper()}")
    name = Column(String, nullable=False)
    disruption_id = Column(String, nullable=False, index=True)
    strategy = Column(String, nullable=False)
    supplier_id = Column(String, nullable=False)
    
    total_cost = Column(Float, nullable=False)
    max_delay_days = Column(Float, nullable=False)
    blended_risk = Column(Float, nullable=False)
    total_sla_exposure = Column(Float, nullable=False)
    final_score = Column(Float, nullable=False)
    
    status = Column(String, default="READY", nullable=False)
    
    details = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
