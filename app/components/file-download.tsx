
import { useEffect, useState } from "react";
import Locale from "../locales";
import { useChatStore } from "../store";
import DeleteIcon from "../icons/delete.svg";
import DownloadIcon from "../icons/download.svg";
import { List, ListItem, Modal, showConfirm } from "./ui-lib";
import styles from "./file-download.module.scss"
import { IconButton } from "./button";
import { 
  requestDownloadJobFile, 
  requestJobFiles, 
  requestRemoveJobFile 
} from "./data-provider/dataaccessor";

interface JobFile {
  filename: string;
  filesize?: number;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function FileDownloadModal (
  { onClose, onDownloaded }: {
    onClose: () => void,
    onDownloaded: (message: string) => void
  }
) {
  const session = useChatStore().currentSession();
  const jobId = session.jobId !== undefined ? (`${session.jobId}`) : undefined;
  const [jobFiles, setJobFiles] = useState<Array<JobFile>>([]);
  async function onDownload(filename: string) {
    try {
      await requestDownloadJobFile(jobId??"", filename);
    } catch (e: any) {
      console.error(e);
    }
  }
  async function onRemoveFile(filename: string) {
    const theId = jobId??"";
    if (theId.length === 0 || filename.length === 0) {
      return;
    }
    if (!await showConfirm(`Are you sure to remove the file?`)) {
      return;
    }
    try {
      await requestRemoveJobFile(jobId??"", filename);
      await updateJobFiles();
    } catch (e: any) {
      console.error(e);
    }
  }

  async function updateJobFiles() {
    if (jobId && jobId.length > 0) {
      const res = await requestJobFiles(jobId);
      try {
        const {job_files: files} = await res?.json();
        setJobFiles(files as Array<JobFile>);
        console.dir(files);
      } catch (e: any) {
        console.log(e);
      }
    }
  }
  useEffect(() => {
    updateJobFiles();
  }, []);

  return (
    <div className="modal-mask">
      <Modal
        title="Job Files"
        onClose={onClose}
      >
      {jobFiles === undefined || jobFiles.length === 0 ? (
        <div>No job files found</div>
      ): (
        <List>
          { jobFiles.map((jobFile: JobFile) => (
            <ListItem
              title={jobFile.filename}
              subTitle={`size: ${formatFileSize(jobFile.filesize??0)}`}
              key={`JobFile-${jobFile.filename}`}
            >
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <IconButton
                  text="Delete"
                  icon={<DeleteIcon />}
                  onClick={async () => (onRemoveFile(jobFile.filename))}
                />
                <IconButton
                  text="Download"
                  icon={<DownloadIcon />}
                  onClick={() => (onDownload(jobFile.filename))}
                />
            </div>
            </ListItem>
          ))}
        </List>
      )}
      </Modal>
    </div>
  )
}

