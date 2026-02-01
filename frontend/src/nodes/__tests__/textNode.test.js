import { render, screen, fireEvent } from "@testing-library/react";
import { TextNode } from "../textNode";

describe("TextNode", () => {
  const mockData = { text: "test" };

  test("should render with initial text", () => {
    render(<TextNode id="test-1" data={mockData} />);
    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
  });

  test("should detect variables in text", () => {
    render(<TextNode id="test-1" data={{ text: "{{variable}}" }} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea.value).toBe("{{variable}}");
  });

  test("should update text on change", () => {
    render(<TextNode id="test-1" data={mockData} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "new text" } });
    expect(textarea.value).toBe("new text");
  });

  test("should detect multiple variables", () => {
    const { container } = render(
      <TextNode id="test-1" data={{ text: "{{var1}} and {{var2}}" }} />,
    );
    const handles = container.querySelectorAll('[data-handlepos="left"]');
    expect(handles.length).toBe(2);
  });
});
