
import { useLogsStore } from "../store/logs";
import ClearIcon from "../icons/clear.svg";

import styles from "./right-logspanel.module.scss";
import { IconButton } from "./button";

export function RightLogsPanel(
  {className}: {className?: string}
) {
  const logsStore = useLogsStore();
  function onClearLogs() {
    logsStore.setLogs("");
  }
  
  return(
    <div className={`${styles["right-logspanel"]} ${className}`}>
      <div className={styles["right-logspanel-header"]}>
        <div className={styles["right-logspanel-title"]}>
          Logs: 
        </div>
        <div className={styles["right-logspanel-clear"]}>
          <IconButton
            text="Clear"
            icon={<ClearIcon />}
            onClick={onClearLogs}
          ></IconButton>
        </div>
      </div>
      <div className={styles["right-logspanel-body"]}>
        <div className={styles["logs-area"]} > {logsStore.getLogs()}
        </div>
      </div>
    </div>
  );
}
