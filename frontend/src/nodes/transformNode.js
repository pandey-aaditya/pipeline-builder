import { BaseNode } from "./BaseNode";

export const TransformNode = ({ id, data }) => {
  const config = {
    title: "Transform",
    width: 200,
    minHeight: 80,
    initialState: (id, data) => ({
      operation: data?.operation || "uppercase",
    }),
    renderContent: ({ state, updateState, selectClass, labelClass }) => (
      <label className={labelClass}>
        Operation:
        <select
          value={state.operation}
          onChange={(e) => updateState("operation", e.target.value)}
          className={selectClass}
        >
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="trim">Trim</option>
          <option value="reverse">Reverse</option>
        </select>
      </label>
    ),
    handles: {
      target: [{ id: "input" }],
      source: [{ id: "output" }],
    },
  };

  return <BaseNode id={id} data={data} config={config} />;
};
