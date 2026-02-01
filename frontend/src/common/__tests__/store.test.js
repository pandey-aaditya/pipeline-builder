import { renderHook, act } from "@testing-library/react";
import { useStore } from "../store";

describe("Store", () => {
  test("should generate unique node IDs", () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      const id1 = result.current.getNodeID("input");
      const id2 = result.current.getNodeID("input");
      expect(id1).toBe("input-1");
      expect(id2).toBe("input-2");
    });
  });

  test("should add node", () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addNode({
        id: "test-1",
        type: "input",
        position: { x: 0, y: 0 },
      });
    });

    expect(result.current.nodes.length).toBeGreaterThan(0);
  });
});
