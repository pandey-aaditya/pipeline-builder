import { BaseNode } from "./BaseNode";

export const InputNode = ({ id, data }) => {
  const config = {
    title: "Input",
    width: 200,
    minHeight: 80,
    initialState: (id, data) => ({
      name: data?.inputName || id.replace("customInput-", "input_"),
      type: data?.inputType || "Text",
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
          Name:
          <input
            type="text"
            value={state.name}
            onChange={(e) => updateState("name", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Type:
          <select
            value={state.type}
            onChange={(e) => updateState("type", e.target.value)}
            className={selectClass}
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </>
    ),
    handles: {
      source: [{ id: "value" }],
    },
  };

  return <BaseNode id={id} data={data} config={config} />;
};
