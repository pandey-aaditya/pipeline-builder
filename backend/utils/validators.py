def check_dag(nodes, edges):
    """
    Check if the pipeline forms a Directed Acyclic Graph (DAG).
    Uses DFS with recursion stack to detect cycles.
    """
    if not nodes:
        return True
    
    adj_list = {node['id']: [] for node in nodes}
    
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source in adj_list:
            adj_list[source].append(target)
    
    visited = set()
    rec_stack = set()
    
    def has_cycle(node):
        visited.add(node)
        rec_stack.add(node)
        
        for neighbor in adj_list.get(node, []):
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        
        rec_stack.remove(node)
        return False
    
    for node in adj_list:
        if node not in visited:
            if has_cycle(node):
                return False
    
    return True

def validate_pipeline(nodes, edges):
    """
    Validate pipeline and return warnings.
    """
    warnings = []
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    if num_nodes > 100:
        warnings.append("Pipeline has more than 100 nodes, which may impact performance")
    
    if num_edges > 200:
        warnings.append("Pipeline has more than 200 edges, which may impact performance")
    
    # Check for disconnected nodes
    connected_nodes = set()
    for edge in edges:
        connected_nodes.add(edge.get('source'))
        connected_nodes.add(edge.get('target'))
    
    disconnected = num_nodes - len(connected_nodes)
    if disconnected > 0:
        warnings.append(f"{disconnected} node(s) are not connected to the pipeline")
    
    return warnings
