import { BaseNode } from "./BaseNode";

export const LLMNode = ({ id, data }) => {
  const config = {
    title: "LLM",
    width: 200,
    minHeight: 80,
    description: "This is a LLM.",
    handles: {
      target: [
        { id: "system", top: "33%" },
        { id: "prompt", top: "66%" },
      ],
      source: [{ id: "response" }],
    },
  };

  return <BaseNode id={id} data={data} config={config} />;
};
