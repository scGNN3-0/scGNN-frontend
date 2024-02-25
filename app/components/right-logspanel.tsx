
import styles from "./right-logspanel.module.scss";

export function RightLogsPanel(
  {className}: {className?: string}
) {
  return(
    <div className={`${styles["right-logspanel"]} ${className}`}>
      <div className={styles["right-logspanel-header"]}>
        <div className={styles["right-logspanel-title"]}>
          Logs: 
        </div>
      </div>
      <div className={styles["right-logspanel-body"]}>
        <div className={styles["logs-area"]} >
        </div>
      </div>
    </div>
  );
}
