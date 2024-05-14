import { ApiPath } from "@/app/constant";
import { getFetchUrl } from "@/app/utils/utils";

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
  subPath: string,
) => {
  const FILEUPLOAD = ApiPath.JobFile;
  let uploadPath = getFetchUrl(subPath??"", FILEUPLOAD);
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
  taskId: string,
  subPath: string,
) => {
  const LOGS = ApiPath.Logs;
  let fetchPath = getFetchUrl(subPath??"", LOGS as string);
  if (!fetchPath.endsWith('/')) {
    fetchPath += "/";
  }
  fetchPath += taskId;
  const response = await fetch(fetchPath, {
    method: "POST",
  });
  return response;
}

export const requestJobFiles = async (
  jobId: string,
  subPath: string,
) => {
  const FILEURL = getFetchUrl(subPath??"", ApiPath.JobFiles + '/' + jobId);
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
  jobId: string, filename: string, subPath: string,
) => {
  const fetchUrl = getFetchUrl(subPath??"", ApiPath.JobFile + '?' + new URLSearchParams({
    jobId,
    filename,
  }));
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
  taskId: string, filename: string, subPath: string,
) => {
  const fetchUrl = getFetchUrl(subPath??"", `${ApiPath.TaskResultFile}/${taskId}/${filename}`);
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
  jobId: string, filename: string, subPath: string
) => {
  const fetchUrl = getFetchUrl(subPath??"", ApiPath.JobFile + '?' + new URLSearchParams({
    jobId,
    filename,
  }));
  try {
    const res = await fetch(fetchUrl, {method: "DELETE"});
  } catch (e: any) {
    console.error(e);
  }  
}

export const requestJobId = async(subPath: string) => {
  const fetchUrl = getFetchUrl(subPath??"", ApiPath.JobId);
  try {
    const res = await fetch(fetchUrl, {method: "POST"});
    const jsonBody = await res.json();
    const jobId = jsonBody.jobId;
    return jobId;
  } catch( e: any) {
    console.error(e);
  }
}

export const requestTaskResults = async (taskId: string, subPath: string) => {
  const RESULTS = ApiPath.ObtainResults;
  let fetchPath = getFetchUrl(subPath??"", RESULTS as string);
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

export const requestJobTasksStatus = async (jobId: string, subPath: string) => {
  const JOBTASKSSTATUS = getFetchUrl(subPath??"", ApiPath.ObtainStatus);
  let fetchPath = JOBTASKSSTATUS as string;
  if (!fetchPath.endsWith("/")) {
    fetchPath += "/";
  }
  fetchPath += jobId;
  const response = await fetch (fetchPath, {
    method: "POST",
  });
  if (response.ok) {
    const jsonObj = await response.json();
    return jsonObj;
  }
  return {results: []};
};
