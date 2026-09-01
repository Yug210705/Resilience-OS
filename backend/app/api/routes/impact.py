from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.engines.impact_engine import calculate_impact

router = APIRouter()

@router.get("/{scenario_id}/impact")
def get_impact(scenario_id: str, db: Session = Depends(get_db)):
    return calculate_impact(scenario_id, db)
