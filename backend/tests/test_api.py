import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_parse_pipeline_success():
    payload = {
        'nodes': [
            {'id': '1'},
            {'id': '2'}
        ],
        'edges': [
            {'source': '1', 'target': '2'}
        ]
    }
    response = client.post('/pipelines/parse', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'success'
    assert data['num_nodes'] == 2
    assert data['num_edges'] == 1
    assert data['is_dag'] == True

def test_parse_pipeline_with_cycle():
    payload = {
        'nodes': [
            {'id': '1'},
            {'id': '2'},
            {'id': '3'}
        ],
        'edges': [
            {'source': '1', 'target': '2'},
            {'source': '2', 'target': '3'},
            {'source': '3', 'target': '1'}
        ]
    }
    response = client.post('/pipelines/parse', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'warning'
    assert data['is_dag'] == False

def test_parse_pipeline_empty():
    payload = {'nodes': [], 'edges': []}
    response = client.post('/pipelines/parse', json=payload)
    assert response.status_code == 400
    assert 'at least one node' in response.json()['detail']

def test_parse_pipeline_invalid_data():
    response = client.post('/pipelines/parse', json={})
    assert response.status_code == 422
