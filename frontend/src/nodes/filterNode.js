import { BaseNode } from "./BaseNode";

export const FilterNode = ({ id, data }) => {
  const config = {
    title: "Filter",
    width: 200,
    minHeight: 80,
    initialState: (id, data) => ({
      condition: data?.condition || "contains",
      value: data?.value || "",
    }),
    renderContent: ({
      state,
      updateState,
      inputClass,
      selectClass,
      labelClass,
    }) => (
      <>
        <label className={labelClass}>
          Condition:
          <select
            value={state.condition}
            onChange={(e) => updateState("condition", e.target.value)}
            className={selectClass}
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="startsWith">Starts With</option>
            <option value="endsWith">Ends With</option>
          </select>
        </label>
        <label className={labelClass}>
          Value:
          <input
            type="text"
            value={state.value}
            onChange={(e) => updateState("value", e.target.value)}
            className={inputClass}
          />
        </label>
      </>
    ),
    handles: {
      target: [{ id: "input" }],
      source: [{ id: "output" }],
    },
  };

  return <BaseNode id={id} data={data} config={config} />;
};
