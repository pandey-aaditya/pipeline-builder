import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Sidebar } from "../Sidebar";
import { pipelineAPI } from "../../utils/api";

jest.mock("../../utils/api");

describe("Sidebar", () => {
  const mockPipelines = [
    { id: 1, name: "Pipeline 1", num_nodes: 3, num_edges: 2, is_dag: true },
    { id: 2, name: "Pipeline 2", num_nodes: 5, num_edges: 4, is_dag: false },
  ];

  beforeEach(() => {
    pipelineAPI.listPipelines.mockResolvedValue(mockPipelines);
  });

  test("should render pipelines list", async () => {
    render(<Sidebar onSelectPipeline={() => {}} onNewPipeline={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Pipeline 1")).toBeInTheDocument();
      expect(screen.getByText("Pipeline 2")).toBeInTheDocument();
    });
  });

  test("should call onSelectPipeline when pipeline clicked", async () => {
    const onSelect = jest.fn();
    pipelineAPI.getPipeline.mockResolvedValue(mockPipelines[0]);

    render(<Sidebar onSelectPipeline={onSelect} onNewPipeline={() => {}} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("Pipeline 1"));
    });

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalled();
    });
  });

  test("should call onNewPipeline when new button clicked", async () => {
    const onNew = jest.fn();
    render(<Sidebar onSelectPipeline={() => {}} onNewPipeline={onNew} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("+ New"));
    });

    expect(onNew).toHaveBeenCalled();
  });
});
