"use client";

import { getBrowserAuthorizationHeaders } from "@/lib/api/browser-auth";
import { appConfig } from "@/lib/config";
import { ReportSubmissionResult } from "../domain/report";

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

export async function submitCaseReport(caseId: string, payload: { code: string; photoUrl: string }) {
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
