import { ApiPath } from "@/app/constant";

function get_json_header(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-requested-with": "XMLHttpRequest",
  };
}

export const requestUploadFile = async (
  file: File,
) => {
  const FILEUPLOAD = ApiPath.File;
  let uploadPath = FILEUPLOAD;
  const data = new FormData();
  data.set('file', file);
  const res = await fetch(uploadPath, {
    method: "POST",
    body: data,
  });
  return res;
}

export const requestLogs = async (
  taskId: string
) => {
  const LOGS = ApiPath.Logs;
  let fetchPath = LOGS as string;
  if (!fetchPath.endsWith('/')) {
    fetchPath += "/";
  }
  fetchPath += taskId;
  const response = await fetch(fetchPath, {
    method: "GET",
  });
  return response;
}
