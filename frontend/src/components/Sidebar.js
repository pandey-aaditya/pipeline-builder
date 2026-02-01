import { useState, useEffect } from "react";
import { pipelineAPI } from "../utils/api";
import { ConfirmModal } from "./ConfirmModal";
import styles from "../styles/Sidebar.module.less";

export const Sidebar = ({ onSelectPipeline, onNewPipeline }) => {
  const [pipelines, setPipelines] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    pipeline: null,
  });

  const loadPipelines = async () => {
    try {
      setLoading(true);
      const data = await pipelineAPI.listPipelines();
      setPipelines(data);
    } catch (error) {
      console.error("Failed to load pipelines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipelines();
  }, []);

  const handleSelect = async (id) => {
    setSelectedId(id);
    try {
      const pipeline = await pipelineAPI.getPipeline(id);
      onSelectPipeline(pipeline);
    } catch (error) {
      console.error("Failed to load pipeline:", error);
    }
  };

  const handleDeleteClick = (pipeline, e) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, pipeline });
  };

  const handleDeleteConfirm = async () => {
    try {
      await pipelineAPI.deletePipeline(deleteModal.pipeline.id);
      await loadPipelines();
      if (selectedId === deleteModal.pipeline.id) {
        setSelectedId(null);
        onNewPipeline();
      }
      setDeleteModal({ isOpen: false, pipeline: null });
    } catch (error) {
      console.error("Failed to delete pipeline:", error);
    }
  };

  const handleNew = () => {
    setSelectedId(null);
    onNewPipeline();
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2>Pipelines</h2>
        <button onClick={handleNew} className={styles.newButton}>
          + New
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.list}>
          {pipelines.length === 0 ? (
            <div className={styles.empty}>No pipelines yet</div>
          ) : (
            pipelines.map((pipeline) => (
              <div
                key={pipeline.id}
                className={`${styles.item} ${selectedId === pipeline.id ? styles.active : ""}`}
                onClick={() => handleSelect(pipeline.id)}
              >
                <div className={styles.itemContent}>
                  <div className={styles.itemName}>{pipeline.name}</div>
                  <div className={styles.itemMeta}>
                    {pipeline.num_nodes} nodes • {pipeline.num_edges} edges
                    {pipeline.is_dag && (
                      <span className={styles.dagBadge}>DAG</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteClick(pipeline, e)}
                  className={styles.deleteButton}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, pipeline: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Pipeline"
        message={`Are you sure you want to delete "${deleteModal.pipeline?.name}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};
