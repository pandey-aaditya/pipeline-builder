import { BaseNode } from "./BaseNode";

export const SplitNode = ({ id, data }) => {
  const config = {
    title: "Split",
    width: 200,
    minHeight: 80,
    initialState: (id, data) => ({
      delimiter: data?.delimiter || ",",
    }),
    renderContent: ({ state, updateState, inputClass, labelClass }) => (
      <label className={labelClass}>
        Delimiter:
        <input
          type="text"
          value={state.delimiter}
          onChange={(e) => updateState("delimiter", e.target.value)}
          className={inputClass}
          placeholder=","
        />
      </label>
    ),
    handles: {
      target: [{ id: "input" }],
      source: [
        { id: "output1", top: "33%" },
        { id: "output2", top: "66%" },
      ],
    },
  };

  return <BaseNode id={id} data={data} config={config} />;
};
