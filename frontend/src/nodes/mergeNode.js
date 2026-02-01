import { BaseNode } from "./BaseNode";

export const MergeNode = ({ id, data }) => {
  const config = {
    title: "Merge",
    width: 200,
    minHeight: 80,
    initialState: (id, data) => ({
      separator: data?.separator || ", ",
    }),
    renderContent: ({ state, updateState, inputClass, labelClass }) => (
      <label className={labelClass}>
        Separator:
        <input
          type="text"
          value={state.separator}
          onChange={(e) => updateState("separator", e.target.value)}
          className={inputClass}
          placeholder=", "
        />
      </label>
    ),
    handles: {
      target: [
        { id: "input1", top: "33%" },
        { id: "input2", top: "66%" },
      ],
      source: [{ id: "output" }],
    },
  };

  return <BaseNode id={id} data={data} config={config} />;
};
