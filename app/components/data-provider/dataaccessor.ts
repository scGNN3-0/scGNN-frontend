import { ApiPath } from "@/app/constant";

function get_json_header(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-requested-with": "XMLHttpRequest",
  };
}

export const requestUploadFile = async (
  jobId: string,
  file: File,
  dataType: string,
) => {
  const FILEUPLOAD = ApiPath.JobFile;
  let uploadPath = FILEUPLOAD;
  const data = new FormData();
  data.set('file', file);
  data.set('jobId', jobId);
  data.set("dataType", dataType);
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

export const requestJobFiles = async (jobId: string) => {
  const FILEURL = ApiPath.JobFiles + '/' + jobId;
  try {
    const res = await fetch(FILEURL, {
      method: "POST",      
    })
    return res;
  } catch (e: any) {
    console.log(e);
  }
}

export const requestDownloadJobFile = async (
  jobId: string, filename: string
) => {
  const fetchUrl = ApiPath.JobFile + '?' + new URLSearchParams({
    jobId,
    filename,
  });
  try {
    const res = await fetch(fetchUrl, {method: "GET"});
    const data = await res.blob();
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e: any) {
    console.error(e);
  }
}

export const requestDownloadTaskResultFile = async (
  taskId: string, filename: string
) => {
  const fetchUrl = `${ApiPath.TaskResultFile}/${taskId}/${filename}`;
  try {
    const res = await fetch(fetchUrl, {method: "GET"});
    const data = await res.blob();
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e: any) {
    console.error(e);
  }
};

export const requestRemoveJobFile = async (
  jobId: string, filename: string
) => {
  const fetchUrl = ApiPath.JobFile + '?' + new URLSearchParams({
    jobId,
    filename,
  });
  try {
    const res = await fetch(fetchUrl, {method: "DELETE"});
  } catch (e: any) {
    console.error(e);
  }  
}

export const requestJobId = async() => {
  const fetchUrl = ApiPath.JobId;
  try {
    const res = await fetch(fetchUrl, {method: "POST"});
    const jsonBody = await res.json();
    const jobId = jsonBody.jobId;
    return jobId;
  } catch( e: any) {
    console.error(e);
  }
}

export const requestTaskResults = async (taskId: string) => {
  const RESULTS = ApiPath.ObtainResults;
  let fetchPath = RESULTS as string;
  if (!fetchPath.endsWith("/")) {
    fetchPath += "/";
  }
  fetchPath += taskId;
  const response = await fetch (fetchPath, {
    method: "POST",
  });
  if (response.ok) {
    const jsonObj = await response.json();
    return jsonObj;
  }
  return {results: []};
};
