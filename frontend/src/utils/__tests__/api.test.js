import { pipelineAPI } from "../api";

global.fetch = jest.fn();

describe("pipelineAPI", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("should call parsePipeline endpoint", async () => {
    const mockResponse = {
      status: "success",
      num_nodes: 2,
      num_edges: 1,
      is_dag: true,
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const nodes = [{ id: "1" }, { id: "2" }];
    const edges = [{ source: "1", target: "2" }];

    const result = await pipelineAPI.parsePipeline(nodes, edges);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/pipelines/parse",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  test("should call savePipeline endpoint", async () => {
    const mockResponse = {
      status: "success",
      pipeline_id: 1,
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await pipelineAPI.savePipeline("Test", [], []);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/pipelines/save",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  test("should call listPipelines endpoint", async () => {
    const mockResponse = [{ id: 1, name: "Test" }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await pipelineAPI.listPipelines();

    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/pipelines/list");
    expect(result).toEqual(mockResponse);
  });

  test("should call updatePipeline endpoint", async () => {
    const mockResponse = {
      status: "success",
      pipeline_id: 1,
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await pipelineAPI.updatePipeline(1, "Updated", [], []);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/pipelines/1",
      expect.objectContaining({
        method: "PUT",
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  test("should throw error on failed request", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: "Error" }),
    });

    await expect(pipelineAPI.parsePipeline([], [])).rejects.toThrow();
  });
});
