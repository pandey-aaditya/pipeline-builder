import { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import styles from "../styles/TextNode.module.less";

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [variables, setVariables] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 200, height: 100 });

  useEffect(() => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const matches = [...currText.matchAll(regex)];
    const uniqueVars = [...new Set(matches.map((m) => m[1]))];
    setVariables(uniqueVars);

    const lines = currText.split("\n").length;
    const textLength = currText.length;
    const newWidth = Math.max(200, Math.min(400, 200 + textLength * 2));
    const newHeight = Math.max(100, 80 + lines * 20);
    setDimensions({ width: newWidth, height: newHeight });
  }, [currText]);

  return (
    <div
      className={styles.textNode}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {variables.map((varName, idx) => (
        <Handle
          key={`var-${varName}`}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          className={styles.handle}
          style={{ top: `${((idx + 1) * 100) / (variables.length + 1)}%` }}
        />
      ))}

      <div className={styles.header}>Text</div>

      <div>
        <label className={styles.label}>
          Text:
          <textarea
            value={currText}
            onChange={(e) => setCurrText(e.target.value)}
            className={styles.textarea}
            placeholder="Enter text with {{variables}}"
          />
        </label>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className={styles.handle}
      />
    </div>
  );
};
