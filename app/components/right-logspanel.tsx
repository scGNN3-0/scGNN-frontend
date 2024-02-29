import dynamic from "next/dynamic";

import { useLogsStore } from "../store/logs";
import ClearIcon from "../icons/clear.svg";
import LoadingIcon from "../icons/three-dots.svg";

import styles from "./right-logspanel.module.scss";
import { IconButton } from "./button";

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <LoadingIcon />,
});

export function RightLogsPanel(
  {className}: {className?: string}
) {
  const logsStore = useLogsStore();
  function onClearLogs() {
    logsStore.setLogs("");
  }
  const logs = logsStore.getLogs();
  const taskId = logs.taskId;
  const content = logs.content;
  const display_logs = `${taskId} \n ${content}`;
  return(
    <div className={`${styles["right-logspanel"]} ${className}`}>
      <div className={styles["right-logspanel-header"]}>
        <div className={styles["right-logspanel-title"]}>
          Logs: 
        </div>
        <div className={styles["right-logspanel-clear"]}>
          <IconButton
            className={styles["clear-button"]}
            text="Clear"
            icon={<ClearIcon />}
            onClick={onClearLogs}
          ></IconButton>
        </div>
      </div>
      <div className={styles["right-logspanel-body"]}>
        <div className={styles["logs-area"]} > 
          <Markdown
            content={display_logs}
          ></Markdown>
        </div>
      </div>
    </div>
  );
}
