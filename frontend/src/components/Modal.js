import styles from "../styles/Modal.module.less";

export const Modal = ({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
  details,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      default:
        return "ℹ";
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.header} ${styles[type]}`}>
          <div className={styles.icon}>{getIcon()}</div>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>{message}</p>

          {details && (
            <div className={styles.details}>
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className={styles.detailRow}>
                  <span className={styles.detailLabel}>{key}:</span>
                  <span className={styles.detailValue}>{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
