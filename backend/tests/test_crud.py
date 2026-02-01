import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_save_pipeline():
    payload = {
        'name': 'Test Pipeline',
        'nodes': [{'id': '1'}, {'id': '2'}],
        'edges': [{'source': '1', 'target': '2'}]
    }
    response = client.post('/pipelines/save', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'success'
    assert data['pipeline_id'] is not None

def test_list_pipelines():
    response = client.get('/pipelines/list')
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_pipeline():
    # First save a pipeline
    save_response = client.post('/pipelines/save', json={
        'name': 'Get Test',
        'nodes': [{'id': '1'}],
        'edges': []
    })
    pipeline_id = save_response.json()['pipeline_id']
    
    # Then get it
    response = client.get(f'/pipelines/{pipeline_id}')
    assert response.status_code == 200
    data = response.json()
    assert data['name'] == 'Get Test'
    assert len(data['nodes']) == 1

def test_delete_pipeline():
    # First save a pipeline
    save_response = client.post('/pipelines/save', json={
        'name': 'Delete Test',
        'nodes': [{'id': '1'}],
        'edges': []
    })
    pipeline_id = save_response.json()['pipeline_id']
    
    # Then delete it
    response = client.delete(f'/pipelines/{pipeline_id}')
    assert response.status_code == 200
    
    # Verify it's gone
    get_response = client.get(f'/pipelines/{pipeline_id}')
    assert get_response.status_code == 404

def test_update_pipeline():
    # First save a pipeline
    save_response = client.post('/pipelines/save', json={
        'name': 'Original Name',
        'nodes': [{'id': '1'}],
        'edges': []
    })
    pipeline_id = save_response.json()['pipeline_id']
    
    # Then update it
    update_response = client.put(f'/pipelines/{pipeline_id}', json={
        'name': 'Updated Name',
        'nodes': [{'id': '1'}, {'id': '2'}],
        'edges': [{'source': '1', 'target': '2'}]
    })
    assert update_response.status_code == 200
    data = update_response.json()
    assert data['status'] == 'success'
    assert data['num_nodes'] == 2
    
    # Verify the update
    get_response = client.get(f'/pipelines/{pipeline_id}')
    updated_data = get_response.json()
    assert updated_data['name'] == 'Updated Name'
    assert len(updated_data['nodes']) == 2
