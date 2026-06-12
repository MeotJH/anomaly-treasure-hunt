"use client";

import { readJsonResponse } from "@/lib/api/read-json";
import { getBrowserAuthorizationHeaders } from "@/lib/api/browser-auth";
import { appConfig } from "@/lib/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { supabaseConfig } from "@/lib/supabase/config";
import { ReportSubmissionResult } from "../domain/report";

interface UploadedEvidencePhoto {
  path: string;
}

async function readJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    cache: "no-store",
  });

  return readJsonResponse<T>(response);
}

function buildEvidencePath(caseId: string, file: File) {
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "jpg"
    : "jpg";

  return `reports/${caseId}/${Date.now()}-${crypto.randomUUID()}.${extension || "jpg"}`;
}

export async function uploadEvidencePhoto(
  caseId: string,
  file: File,
): Promise<UploadedEvidencePhoto> {
  const supabase = createSupabaseBrowserClient();
  const path = buildEvidencePath(caseId, file);
  const bucket = supabaseConfig.storageBucket;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });

  if (uploadError) {
    throw new Error(`증거 이미지 업로드에 실패했습니다: ${uploadError.message}`);
  }

  return {
    path,
  };
}

export async function removeEvidencePhoto(path: string) {
  const supabase = createSupabaseBrowserClient();
  const bucket = supabaseConfig.storageBucket;

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`업로드한 이미지 정리에 실패했습니다: ${error.message}`);
  }
}

export async function submitCaseReport(
  caseId: string,
  payload: { code: string; photoUrl: string },
) {
  const authHeaders = await getBrowserAuthorizationHeaders(true);

  return readJson<ReportSubmissionResult>(`/api/cases/${caseId}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteMyReport(reportId: string) {
  const authHeaders = await getBrowserAuthorizationHeaders(true);

  return readJson<{ message: string }>(`/api/me/reports/${reportId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
}
