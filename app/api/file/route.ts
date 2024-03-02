import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import { ERROR_SCGNNSERVER_OK, LOCAL_BASE_URL, scGNNPath } from "@/app/constant";
import { SCGNNServerResponse } from "../common";
import { prettyObject } from "@/app/utils/format";

const serverConfig = getServerSideConfig();

async function request_upload_file(
  formData: FormData
) {
  let baseUrl = serverConfig.baseUrl ?? LOCAL_BASE_URL;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `http://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  const path = scGNNPath.FileUpload;
  const jobId = formData.get('jobId');
  const file = formData.get('file');
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

async function handle(request: NextRequest) {
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

export const POST = handle;
