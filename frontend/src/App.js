import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { PipelineToolbar } from "./common/toolbar";
import { PipelineUI } from "./common/ui";
import { SubmitButton } from "./common/submit";
import { useStore } from "./common/store";
import styles from "./styles/App.module.less";

function App() {
  const [currentPipelineId, setCurrentPipelineId] = useState(null);
  const [currentPipelineName, setCurrentPipelineName] = useState(null);

  const handleSelectPipeline = (pipeline) => {
    // Load pipeline into canvas
    const nodesWithPosition = pipeline.nodes.map((node) => ({
      ...node,
      position: node.position || {
        x: Math.random() * 500,
        y: Math.random() * 300,
      },
    }));

    useStore.setState({ nodes: nodesWithPosition, edges: pipeline.edges });
    setCurrentPipelineId(pipeline.id);
    setCurrentPipelineName(pipeline.name);
  };

  const handleNewPipeline = () => {
    useStore.setState({ nodes: [], edges: [] });
    setCurrentPipelineId(null);
    setCurrentPipelineName(null);
  };

  const handleSave = (pipelineId) => {
    // Refresh sidebar after save
    window.location.reload();
  };

  return (
    <div className={styles.app}>
      <div className={styles.layout}>
        <Sidebar
          onSelectPipeline={handleSelectPipeline}
          onNewPipeline={handleNewPipeline}
        />
        <div className={styles.main}>
          <PipelineToolbar />
          <PipelineUI />
          <SubmitButton
            onSave={handleSave}
            currentPipelineId={currentPipelineId}
            currentPipelineName={currentPipelineName}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
