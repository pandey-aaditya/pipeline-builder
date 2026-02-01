const API_BASE_URL = "http://localhost:8000";

export const pipelineAPI = {
  async parsePipeline(nodes, edges) {
    const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nodes, edges }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to parse pipeline");
    }

    return data;
  },

  async savePipeline(name, nodes, edges) {
    const response = await fetch(`${API_BASE_URL}/pipelines/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, nodes, edges }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to save pipeline");
    }

    return data;
  },

  async listPipelines() {
    const response = await fetch(`${API_BASE_URL}/pipelines/list`);

    if (!response.ok) {
      throw new Error("Failed to fetch pipelines");
    }

    return response.json();
  },

  async getPipeline(id) {
    const response = await fetch(`${API_BASE_URL}/pipelines/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch pipeline");
    }

    return response.json();
  },

  async deletePipeline(id) {
    const response = await fetch(`${API_BASE_URL}/pipelines/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete pipeline");
    }

    return response.json();
  },

  async updatePipeline(id, name, nodes, edges) {
    const response = await fetch(`${API_BASE_URL}/pipelines/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, nodes, edges }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to update pipeline");
    }

    return data;
  },

  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.json();
  },
};
