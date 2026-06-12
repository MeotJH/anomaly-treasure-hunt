"use client";

import { readJsonResponse } from "@/lib/api/read-json";
import { getBrowserAuthorizationHeaders } from "@/lib/api/browser-auth";
import { appConfig } from "@/lib/config";
import { AdminCasePayload, AdminCaseRecord } from "../domain/case";

async function readJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    cache: "no-store",
  });

  return readJsonResponse<T>(response);
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
