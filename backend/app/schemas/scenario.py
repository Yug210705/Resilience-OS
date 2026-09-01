from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from backend.domain.enums import EntityStatus, DisruptionType, DisruptionSeverity

class ScenarioCreate(BaseModel):
    scenario_id: str
    name: str

class DisruptionCreate(BaseModel):
    disruption_id: str
    type: DisruptionType
    severity: DisruptionSeverity
    target_entity_id: str
    target_entity_type: str
    description: str
    start_time: datetime
    estimated_duration_days: Optional[int] = None
