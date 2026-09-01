from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.db import models
from app.schemas.scenario import ScenarioCreate, DisruptionCreate
from datetime import datetime

router = APIRouter()

@router.post("")
def create_scenario(scenario: ScenarioCreate, db: Session = Depends(get_db)):
    if db.query(models.Scenario).filter_by(scenario_id=scenario.scenario_id).first():
        raise HTTPException(status_code=409, detail="Scenario already exists")
    db_scen = models.Scenario(scenario_id=scenario.scenario_id, name=scenario.name)
    db.add(db_scen)
    db.commit()
    return db_scen

@router.get("")
def list_scenarios(db: Session = Depends(get_db)):
    return db.query(models.Scenario).all()

@router.get("/{scenario_id}")
def get_scenario(scenario_id: str, db: Session = Depends(get_db)):
    scen = db.query(models.Scenario).filter_by(scenario_id=scenario_id).first()
    if not scen: raise HTTPException(status_code=404, detail="Scenario not found")
    return scen

@router.post("/{scenario_id}/disruptions")
def create_disruption(scenario_id: str, disruption: DisruptionCreate, db: Session = Depends(get_db)):
    scen = db.query(models.Scenario).filter_by(scenario_id=scenario_id).first()
    if not scen: raise HTTPException(status_code=404, detail="Scenario not found")
    
    # Validate target exists
    target = None
    if disruption.target_entity_type == "Supplier":
        target = db.query(models.Supplier).filter_by(supplier_id=disruption.target_entity_id).first()
    elif disruption.target_entity_type == "Plant":
        target = db.query(models.Plant).filter_by(plant_id=disruption.target_entity_id).first()
    
    # We can skip strict target validation for mock simplicity, but prompt asked to validate
    if not target and disruption.target_entity_type in ["Supplier", "Plant"]:
        raise HTTPException(status_code=400, detail="Target entity not found")
        
    db_disruption = models.Disruption(
        disruption_id=disruption.disruption_id,
        scenario_id=scenario_id,
        type=disruption.type,
        severity=disruption.severity,
        target_entity_id=disruption.target_entity_id,
        target_entity_type=disruption.target_entity_type,
        description=disruption.description,
        start_time=disruption.start_time,
        estimated_duration_days=disruption.estimated_duration_days
    )
    db.add(db_disruption)
    db.commit()
    return db_disruption

@router.get("/{scenario_id}/disruptions")
def get_disruptions(scenario_id: str, db: Session = Depends(get_db)):
    return db.query(models.Disruption).filter_by(scenario_id=scenario_id).all()
