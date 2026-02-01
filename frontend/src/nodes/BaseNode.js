import { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import styles from "../styles/BaseNode.module.less";

export const BaseNode = ({ id, data, config }) => {
  const [state, setState] = useState(config.initialState?.(id, data) || {});

  useEffect(() => {
    if (config.onStateChange) {
      config.onStateChange(id, state);
    }
  }, [state, id, config]);

  const updateState = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const nodeStyle = {
    width: config.width || 200,
    height: config.height || "auto",
    minHeight: config.minHeight || 80,
  };

  return (
    <div className={styles.baseNode} style={nodeStyle}>
      {config.handles?.target?.map((handle, idx) => (
        <Handle
          key={`target-${idx}`}
          type="target"
          position={Position.Left}
          id={`${id}-${handle.id}`}
          className={styles.handle}
          style={{
            top:
              handle.top ||
              `${((idx + 1) * 100) / (config.handles.target.length + 1)}%`,
          }}
        />
      ))}

      <div className={styles.header}>{config.title}</div>

      <div className={styles.content}>
        {config.renderContent
          ? config.renderContent({
              state,
              updateState,
              inputClass: styles.input,
              selectClass: styles.select,
              labelClass: styles.label,
              id,
              data,
            })
          : config.description && (
              <div className={styles.description}>{config.description}</div>
            )}
      </div>

      {config.handles?.source?.map((handle, idx) => (
        <Handle
          key={`source-${idx}`}
          type="source"
          position={Position.Right}
          id={`${id}-${handle.id}`}
          className={styles.handle}
          style={{
            top:
              handle.top ||
              `${((idx + 1) * 100) / (config.handles.source.length + 1)}%`,
          }}
        />
      ))}
    </div>
  );
};
