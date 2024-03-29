import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import { ERROR_OK, LOCAL_BASE_URL, scGNNPath } from "@/app/constant";
import { SCGNNServerResponse } from "../common";
import { prettyObject } from "@/app/utils/format";

const serverConfig = getServerSideConfig();

function get_baseurl(): string {
  let baseUrl = serverConfig.baseUrl ?? LOCAL_BASE_URL;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `http://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  return baseUrl;
}

async function request_upload_file(
  formData: FormData
) {
  
  const path = scGNNPath.JobFile;
  const jobId = formData.get('jobId');
  const file = formData.get('file');
  const baseUrl = get_baseurl();
  const fetchUrl = `${baseUrl}/${path}/${jobId}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10 * 60 * 1000);
  
  const fetchOptions: RequestInit = {
    method: "POST",
    body: formData,
    signal: controller.signal
  };
  try {
    const res = await fetch(fetchUrl, fetchOptions);
    const jsonBody = await res.json();
    // const value = jsonBody as SCGNNServerResponse;
    // if (value.code !== ERROR_SCGNNSERVER_OK) {
    //   console.error(value.error ?? "Unknown errors occurred in scGNN-server")
    // }
    return NextResponse.json(jsonBody);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handlePost(request: NextRequest) {
  try {
    const contentType = request.headers.get("Content-Type");
    const data = await request.formData();
    const res = await request_upload_file(data);
    return res;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(prettyObject(e));
  }
}

async function handleGet(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get("jobId");
  const filename = request.nextUrl.searchParams.get("filename");
  const baseUrl = get_baseurl();
  const path = scGNNPath.JobFile;
  const fetchUrl = `${baseUrl}/${path}/${jobId}/${filename}`;
  try {
    const res = await fetch(fetchUrl, {
      method: "GET",
    });
    return res;
  } catch (e: any) {
    console.error(e);
  }
}

async function handleDelete(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get("jobId");
  const filename = request.nextUrl.searchParams.get("filename");
  const baseUrl = get_baseurl();
  const path = scGNNPath.JobFile;
  const fetchUrl = `${baseUrl}/${path}/${jobId}/${filename}`;
  try {
    const res = await fetch(fetchUrl, {
      method: "DELETE",
    });
    return res;
  } catch (e: any) {
    console.error(e);
  }
}

export const POST = handlePost;
export const GET = handleGet;
export const DELETE = handleDelete;