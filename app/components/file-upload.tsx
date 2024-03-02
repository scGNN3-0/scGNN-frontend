import Locale from "../locales";
import { Modal, ReactDropZone } from "./ui-lib";
import styles from "./file-upload.module.scss";
import { requestUploadFile } from "./data-provider/dataaccessor";

export function FileUploadModal(
  {onClose, jobId, onUploaded}: 
  {
    onClose: () => void, 
    jobId?: string,
    onUploaded: (message: string) => void
  }
) {
  async function onUpload(file: File, done: () => void) {
    try {
      const res = await requestUploadFile(jobId??"", file);
      const jsonBody = await res.json();
      onUploaded(jsonBody.message??"");
    } catch (e: any) {
      console.log(e);
    }
    done();
  }
  return (
    <div className="modal-mask">
      <Modal
        title="Upload File ..."
        onClose={onClose}
      >
        <div className={styles["file-upload-body"]}>
        <ReactDropZone
          accept={{ 
            "application/pdf": ["application/pdf"], 
            "text/plain": ["text/plain"], 
            "image/png": [".png"],
            "image/jpeg": [".jpg", "jpeg"],
          }}
          onUpload={onUpload}
          fileTypeLabel="Images (jpg, png), TXT, PDF"
        />
        </div>
    </Modal>
    </div>
  )
}

