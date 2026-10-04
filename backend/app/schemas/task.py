from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class AgentRunResponse(BaseModel):
    id: str
    task_id: str
    agent_name: str
    model_used: str
    prompt_tokens: int
    completion_tokens: int
    status: str
    duration_ms: int
    created_at: datetime

    class Config:
        from_attributes = True

class MarketingTaskResponse(BaseModel):
    id: str
    project_id: str
    client_id: str
    title: str
    agent_name: str
    task_type: str
    priority: str
    day_number: int
    status: str
    input_parameters: Dict[str, Any]
    output_data: Dict[str, Any]
    logs: List[Dict[str, Any]]
    retry_count: int
    max_retries: int
    error_message: Optional[str] = None
    requires_approval: bool
    approval_status: str
    scheduled_for: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    execution_cost: float
    token_usage: int
    created_at: datetime
    agent_runs: List[AgentRunResponse] = []

    class Config:
        from_attributes = True

class TaskRetryRequest(BaseModel):
    override_params: Optional[Dict[str, Any]] = None
