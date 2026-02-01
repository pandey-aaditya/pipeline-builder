import { BaseNode } from "./BaseNode";

export const ValidatorNode = ({ id, data }) => {
  const config = {
    title: "Validator",
    width: 200,
    minHeight: 80,
    initialState: (id, data) => ({
      validationType: data?.validationType || "email",
    }),
    renderContent: ({ state, updateState, selectClass, labelClass }) => (
      <label className={labelClass}>
        Type:
        <select
          value={state.validationType}
          onChange={(e) => updateState("validationType", e.target.value)}
          className={selectClass}
        >
          <option value="email">Email</option>
          <option value="url">URL</option>
          <option value="phone">Phone</option>
          <option value="number">Number</option>
        </select>
      </label>
    ),
    handles: {
      target: [{ id: "input" }],
      source: [
        { id: "valid", top: "40%" },
        { id: "invalid", top: "60%" },
      ],
    },
  };

  return <BaseNode id={id} data={data} config={config} />;
};
