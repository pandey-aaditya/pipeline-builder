import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmModal } from "../ConfirmModal";

describe("ConfirmModal", () => {
  test("should not render when closed", () => {
    render(
      <ConfirmModal isOpen={false} onClose={() => {}} onConfirm={() => {}} />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("should render when open", () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Delete Pipeline"
        message="Are you sure?"
        type="danger"
      />,
    );
    expect(screen.getByText("Delete Pipeline")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  test("should call onClose when cancel clicked", () => {
    const onClose = jest.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={() => {}}
        title="Delete"
        message="Confirm?"
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  test("should call onConfirm when delete clicked", () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={onConfirm}
        title="Delete"
        message="Confirm?"
      />,
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalled();
  });

  test("should render with danger type styling", () => {
    const { container } = render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Delete"
        message="Confirm?"
        type="danger"
      />,
    );
    const header = container.querySelector('[class*="header"]');
    expect(header).toHaveClass(expect.stringContaining("danger"));
  });
});
