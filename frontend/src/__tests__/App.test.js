import { render, screen } from "@testing-library/react";
import App from "../App";

jest.mock("../common/toolbar", () => ({
  PipelineToolbar: () => <div>Toolbar</div>,
}));

jest.mock("../common/ui", () => ({
  PipelineUI: () => <div>UI</div>,
}));

jest.mock("../common/submit", () => ({
  SubmitButton: () => <button>Submit</button>,
}));

describe("App", () => {
  test("should render all components", () => {
    render(<App />);
    expect(screen.getByText("Toolbar")).toBeInTheDocument();
    expect(screen.getByText("UI")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });
});
s