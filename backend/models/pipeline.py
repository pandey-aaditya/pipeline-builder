from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class Pipeline(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class PipelineResponse(BaseModel):
    status: str
    message: str
    num_nodes: int
    num_edges: int
    is_dag: bool
    warnings: List[str] = []
    pipeline_id: Optional[int] = None

class PipelineSave(BaseModel):
    name: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class PipelineListItem(BaseModel):
    id: int
    name: str
    num_nodes: int
    num_edges: int
    is_dag: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PipelineDetail(BaseModel):
    id: int
    name: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    num_nodes: int
    num_edges: int
    is_dag: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
