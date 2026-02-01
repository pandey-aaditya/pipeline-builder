import { BaseNode } from "./BaseNode";

export const OutputNode = ({ id, data }) => {
  const config = {
    title: "Output",
    width: 200,
    minHeight: 80,
    initialState: (id, data) => ({
      name: data?.outputName || id.replace("customOutput-", "output_"),
      type: data?.outputType || "Text",
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
            <option value="Image">Image</option>
          </select>
        </label>
      </>
    ),
    handles: {
      target: [{ id: "value" }],
    },
  };

  return <BaseNode id={id} data={data} config={config} />;
};
