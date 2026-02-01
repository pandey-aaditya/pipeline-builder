import pytest
from utils.validators import check_dag, validate_pipeline

def test_check_dag_valid():
    nodes = [{'id': '1'}, {'id': '2'}, {'id': '3'}]
    edges = [
        {'source': '1', 'target': '2'},
        {'source': '2', 'target': '3'}
    ]
    assert check_dag(nodes, edges) == True

def test_check_dag_with_cycle():
    nodes = [{'id': '1'}, {'id': '2'}, {'id': '3'}]
    edges = [
        {'source': '1', 'target': '2'},
        {'source': '2', 'target': '3'},
        {'source': '3', 'target': '1'}
    ]
    assert check_dag(nodes, edges) == False

def test_check_dag_empty():
    assert check_dag([], []) == True

def test_validate_pipeline_empty():
    warnings = validate_pipeline([], [])
    assert len(warnings) == 0

def test_validate_pipeline_disconnected():
    nodes = [{'id': '1'}, {'id': '2'}, {'id': '3'}]
    edges = [{'source': '1', 'target': '2'}]
    warnings = validate_pipeline(nodes, edges)
    assert '1 node(s) are not connected' in warnings

def test_validate_pipeline_large():
    nodes = [{'id': str(i)} for i in range(150)]
    edges = []
    warnings = validate_pipeline(nodes, edges)
    assert any('large number of nodes' in w for w in warnings)
