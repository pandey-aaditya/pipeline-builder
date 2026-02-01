import { useState, useEffect } from "react";
import { useStore } from "./store";
import { Modal } from "../components/Modal";
import { useModal } from "../hooks/useModal";
import { pipelineAPI } from "../utils/api";
import { MODAL_TYPES } from "../constants";
import styles from "../styles/submit.module.less";

export const SubmitButton = ({
  onSave,
  currentPipelineId,
  currentPipelineName,
}) => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const { modal, openModal, closeModal } = useModal();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pipelineName, setPipelineName] = useState("");

  const generateDefaultName = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `Pipeline-${day}${month}${year}-${hours}${minutes}${seconds}`;
  };

  useEffect(() => {
    if (showSaveDialog) {
      if (currentPipelineId && currentPipelineName) {
        setPipelineName(currentPipelineName);
      } else {
        setPipelineName(generateDefaultName());
      }
    }
  }, [showSaveDialog, currentPipelineId, currentPipelineName]);

  const handleSubmit = async () => {
    try {
      const data = await pipelineAPI.parsePipeline(nodes, edges);

      const details = {
        "Number of Nodes": data.num_nodes,
        "Number of Edges": data.num_edges,
        "Is DAG": data.is_dag ? "Yes ✓" : "No ✗",
      };

      if (data.warnings && data.warnings.length > 0) {
        details["Warnings"] = data.warnings.join(", ");
      }

      openModal(
        data.status === "warning" ? MODAL_TYPES.WARNING : MODAL_TYPES.SUCCESS,
        data.status === "warning" ? "Pipeline Warning" : "Pipeline Success",
        data.message,
        details,
      );
    } catch (error) {
      openModal(
        MODAL_TYPES.ERROR,
        "Connection Error",
        "Failed to connect to backend server. Please ensure the backend is running on port 8000.",
        { Error: error.message },
      );
    }
  };

  const handleSave = async () => {
    if (!pipelineName.trim()) {
      alert("Please enter a pipeline name");
      return;
    }

    try {
      let data;
      if (currentPipelineId) {
        // Update existing pipeline
        data = await pipelineAPI.updatePipeline(
          currentPipelineId,
          pipelineName,
          nodes,
          edges,
        );
      } else {
        // Create new pipeline
        data = await pipelineAPI.savePipeline(pipelineName, nodes, edges);
      }

      setShowSaveDialog(false);
      setPipelineName("");
      onSave?.(data.pipeline_id);

      openModal(
        MODAL_TYPES.SUCCESS,
        currentPipelineId ? "Pipeline Updated" : "Pipeline Saved",
        data.message,
        { "Pipeline ID": data.pipeline_id },
      );
    } catch (error) {
      openModal(MODAL_TYPES.ERROR, "Save Error", "Failed to save pipeline", {
        Error: error.message,
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <button
          type="button"
          onClick={() => setShowSaveDialog(true)}
          className={styles.saveButton}
        >
          Save Pipeline
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className={styles.submitButton}
        >
          Analyze Pipeline
        </button>
      </div>

      {showSaveDialog && (
        <div className={styles.saveDialog}>
          <div className={styles.saveDialogContent}>
            <h3>{currentPipelineId ? "Update Pipeline" : "Save Pipeline"}</h3>
            <input
              type="text"
              placeholder="Enter pipeline name"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              className={styles.saveInput}
            />
            <div className={styles.saveActions}>
              <button
                onClick={() => setShowSaveDialog(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={handleSave} className={styles.confirmButton}>
                {currentPipelineId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        details={modal.details}
      />
    </>
  );
};
