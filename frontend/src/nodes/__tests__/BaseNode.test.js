import { render, screen } from "@testing-library/react";
import { BaseNode } from "../BaseNode";

describe("BaseNode", () => {
  const mockConfig = {
    title: "Test Node",
    initialState: () => ({ value: "test" }),
    renderContent: ({ state }) => <div>{state.value}</div>,
    handles: {
      target: [{ id: "input" }],
      source: [{ id: "output" }],
    },
  };

  test("should render with title", () => {
    render(<BaseNode id="test-1" data={{}} config={mockConfig} />);
    expect(screen.getByText("Test Node")).toBeInTheDocument();
  });

  test("should render content", () => {
    render(<BaseNode id="test-1" data={{}} config={mockConfig} />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  test("should render handles", () => {
    const { container } = render(
      <BaseNode id="test-1" data={{}} config={mockConfig} />,
    );
    const handles = container.querySelectorAll("[data-handleid]");
    expect(handles.length).toBe(2);
  });
});
