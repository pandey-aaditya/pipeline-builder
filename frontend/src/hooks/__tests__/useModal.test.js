import { renderHook, act } from "@testing-library/react";
import { useModal } from "../useModal";

describe("useModal", () => {
  test("should initialize with closed state", () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.modal.isOpen).toBe(false);
  });

  test("should open modal with correct data", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal("success", "Title", "Message", { key: "value" });
    });

    expect(result.current.modal.isOpen).toBe(true);
    expect(result.current.modal.type).toBe("success");
    expect(result.current.modal.title).toBe("Title");
    expect(result.current.modal.message).toBe("Message");
    expect(result.current.modal.details).toEqual({ key: "value" });
  });

  test("should close modal", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal("success", "Title", "Message");
      result.current.closeModal();
    });

    expect(result.current.modal.isOpen).toBe(false);
  });
});
