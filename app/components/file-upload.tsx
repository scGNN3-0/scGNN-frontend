import Locale from "../locales";
import { Modal, ReactDropZone } from "./ui-lib";
import styles from "./file-upload.module.scss";

export function FileUploadModal(
  {onClose}: {onClose: () => void}
) {
   async function onUpload(file: File, done: () => void) {

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
        />
        </div>
    </Modal>
    </div>
  )
}

