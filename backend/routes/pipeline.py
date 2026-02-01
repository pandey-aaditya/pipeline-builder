from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from models.pipeline import Pipeline, PipelineResponse, PipelineSave, PipelineListItem, PipelineDetail
from models.pipeline_db import PipelineDB
from utils.validators import check_dag, validate_pipeline
from config.database import get_db
import json
from typing import List

router = APIRouter(prefix="/pipelines", tags=["pipelines"])

@router.post('/parse', response_model=PipelineResponse)
def parse_pipeline(pipeline: Pipeline):
    """
    Parse and validate a pipeline.
    Returns node count, edge count, DAG status, and warnings.
    """
    try:
        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)
        
        # Validation
        if num_nodes == 0:
            raise HTTPException(status_code=400, detail="Pipeline must contain at least one node")
        
        warnings = validate_pipeline(pipeline.nodes, pipeline.edges)
        is_dag = check_dag(pipeline.nodes, pipeline.edges)
        
        if not is_dag:
            return PipelineResponse(
                status="warning",
                message="Pipeline contains cycles and is not a valid DAG",
                num_nodes=num_nodes,
                num_edges=num_edges,
                is_dag=is_dag,
                warnings=warnings
            )
        
        return PipelineResponse(
            status="success",
            message="Pipeline parsed successfully",
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag,
            warnings=warnings
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post('/save', response_model=PipelineResponse)
async def save_pipeline(pipeline: PipelineSave, db: AsyncSession = Depends(get_db)):
    """
    Save a pipeline to database.
    """
    try:
        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)
        
        if num_nodes == 0:
            raise HTTPException(status_code=400, detail="Pipeline must contain at least one node")
        
        is_dag = check_dag(pipeline.nodes, pipeline.edges)
        
        db_pipeline = PipelineDB(
            name=pipeline.name,
            nodes=json.dumps(pipeline.nodes),
            edges=json.dumps(pipeline.edges),
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag
        )
        
        db.add(db_pipeline)
        await db.commit()
        await db.refresh(db_pipeline)
        
        return PipelineResponse(
            status="success",
            message=f"Pipeline '{pipeline.name}' saved successfully",
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag,
            warnings=[],
            pipeline_id=db_pipeline.id
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save pipeline: {str(e)}")

@router.get('/list', response_model=List[PipelineListItem])
async def list_pipelines(db: AsyncSession = Depends(get_db)):
    """
    Get list of all pipelines.
    """
    try:
        result = await db.execute(select(PipelineDB).order_by(PipelineDB.created_at.desc()))
        pipelines = result.scalars().all()
        return pipelines
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch pipelines: {str(e)}")

@router.get('/{pipeline_id}', response_model=PipelineDetail)
async def get_pipeline(pipeline_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get a specific pipeline by ID.
    """
    try:
        result = await db.execute(select(PipelineDB).where(PipelineDB.id == pipeline_id))
        pipeline = result.scalar_one_or_none()
        
        if not pipeline:
            raise HTTPException(status_code=404, detail="Pipeline not found")
        
        return PipelineDetail(
            id=pipeline.id,
            name=pipeline.name,
            nodes=json.loads(pipeline.nodes),
            edges=json.loads(pipeline.edges),
            num_nodes=pipeline.num_nodes,
            num_edges=pipeline.num_edges,
            is_dag=pipeline.is_dag,
            created_at=pipeline.created_at,
            updated_at=pipeline.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch pipeline: {str(e)}")

@router.delete('/{pipeline_id}')
async def delete_pipeline(pipeline_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a pipeline by ID.
    """
    try:
        result = await db.execute(select(PipelineDB).where(PipelineDB.id == pipeline_id))
        pipeline = result.scalar_one_or_none()
        
        if not pipeline:
            raise HTTPException(status_code=404, detail="Pipeline not found")
        
        await db.delete(pipeline)
        await db.commit()
        
        return {"message": f"Pipeline '{pipeline.name}' deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete pipeline: {str(e)}")

@router.delete('/clear/all')
async def clear_all_pipelines(db: AsyncSession = Depends(get_db)):
    """
    Delete all pipelines from database.
    """
    try:
        await db.execute(delete(PipelineDB))
        await db.commit()
        return {"message": "All pipelines cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear pipelines: {str(e)}")

@router.put('/{pipeline_id}', response_model=PipelineResponse)
async def update_pipeline(pipeline_id: int, pipeline: PipelineSave, db: AsyncSession = Depends(get_db)):
    """
    Update an existing pipeline.
    """
    try:
        result = await db.execute(select(PipelineDB).where(PipelineDB.id == pipeline_id))
        db_pipeline = result.scalar_one_or_none()
        
        if not db_pipeline:
            raise HTTPException(status_code=404, detail="Pipeline not found")
        
        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)
        
        if num_nodes == 0:
            raise HTTPException(status_code=400, detail="Pipeline must contain at least one node")
        
        is_dag = check_dag(pipeline.nodes, pipeline.edges)
        
        db_pipeline.name = pipeline.name
        db_pipeline.nodes = json.dumps(pipeline.nodes)
        db_pipeline.edges = json.dumps(pipeline.edges)
        db_pipeline.num_nodes = num_nodes
        db_pipeline.num_edges = num_edges
        db_pipeline.is_dag = is_dag
        
        await db.commit()
        await db.refresh(db_pipeline)
        
        return PipelineResponse(
            status="success",
            message=f"Pipeline '{pipeline.name}' updated successfully",
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag,
            warnings=[],
            pipeline_id=db_pipeline.id
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update pipeline: {str(e)}")
