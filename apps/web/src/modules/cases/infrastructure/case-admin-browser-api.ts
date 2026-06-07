"use client";

import { getBrowserAuthorizationHeaders } from "@/lib/api/browser-auth";
import { appConfig } from "@/lib/config";
import { AdminCasePayload, AdminCaseRecord } from "../domain/case";

async function readJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `요청에 실패했습니다. 상태 코드: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function createAdminCase(payload: AdminCasePayload) {
  const authHeaders = await getBrowserAuthorizationHeaders(true);

  return readJson<AdminCaseRecord>("/api/admin/cases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCase(
  caseId: string,
  payload: Partial<AdminCasePayload>,
) {
  const authHeaders = await getBrowserAuthorizationHeaders(true);

  return readJson<AdminCaseRecord>(`/api/admin/cases/${caseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });
}
