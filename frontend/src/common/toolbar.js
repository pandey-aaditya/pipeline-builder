import { DraggableNode } from "./draggableNode";
import styles from "../styles/toolbar.module.less";

export const PipelineToolbar = () => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.title}>Pipeline Nodes</div>
      <div className={styles.nodeContainer}>
        <DraggableNode type="customInput" label="Input" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="customOutput" label="Output" />
        <DraggableNode type="text" label="Text" />
        <DraggableNode type="filter" label="Filter" />
        <DraggableNode type="transform" label="Transform" />
        <DraggableNode type="merge" label="Merge" />
        <DraggableNode type="split" label="Split" />
        <DraggableNode type="validator" label="Validator" />
      </div>
    </div>
  );
};
