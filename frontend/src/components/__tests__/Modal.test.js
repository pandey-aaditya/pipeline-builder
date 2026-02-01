import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "../Modal";

describe("Modal", () => {
  test("should not render when closed", () => {
    render(<Modal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("should render when open", () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        type="success"
        title="Test"
        message="Test message"
      />,
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  test("should call onClose when close button clicked", () => {
    const onClose = jest.fn();
    render(
      <Modal
        isOpen={true}
        onClose={onClose}
        type="success"
        title="Test"
        message="Test"
      />,
    );
    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  test("should render details", () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        type="success"
        title="Test"
        message="Test"
        details={{ key: "value" }}
      />,
    );
    expect(screen.getByText("key")).toBeInTheDocument();
    expect(screen.getByText("value")).toBeInTheDocument();
  });
});
