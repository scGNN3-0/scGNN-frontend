
import styles from "./right-logpanel.module.scss";

export function RightLogPanel(
  {className}: {className?: string}
) {
  return(
    <div className={`${styles["right-logpanel"]} ${className}`}>
      <div className={styles["right-logpanel-header"]}>
        <div className={styles["right-logpanel-title"]}>
          Logs: 
        </div>
      </div>
      <div className={styles["right-logpanel-body"]}>
        <div className={styles["logs-area"]} >
        </div>
      </div>
    </div>
  );
}
