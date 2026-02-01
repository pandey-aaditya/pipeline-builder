import pytest
from pydantic import ValidationError
from models.pipeline import Pipeline, PipelineResponse

def test_pipeline_model_valid():
    data = {
        'nodes': [{'id': '1'}],
        'edges': [{'source': '1', 'target': '2'}]
    }
    pipeline = Pipeline(**data)
    assert len(pipeline.nodes) == 1
    assert len(pipeline.edges) == 1

def test_pipeline_model_invalid():
    with pytest.raises(ValidationError):
        Pipeline(nodes='invalid', edges=[])

def test_pipeline_response_model():
    response = PipelineResponse(
        status='success',
        message='Test',
        num_nodes=5,
        num_edges=4,
        is_dag=True,
        warnings=[]
    )
    assert response.status == 'success'
    assert response.num_nodes == 5
    assert response.is_dag == True
