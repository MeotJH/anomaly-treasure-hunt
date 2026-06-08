"use client";

import { getBrowserAuthorizationHeaders } from "@/lib/api/browser-auth";
import { appConfig } from "@/lib/config";
import { AdminWinnerRecord, InvestigationReportSnapshot } from "../domain/report";

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

export async function fetchAdminReports(caseId: string) {
  const authHeaders = await getBrowserAuthorizationHeaders(true);

  return readJson<InvestigationReportSnapshot[]>(`/api/admin/cases/${caseId}/reports`, {
    headers: authHeaders,
  });
}

export async function reviewAdminReport(
  reportId: string,
  reviewStatus: "approved" | "rejected",
) {
  const authHeaders = await getBrowserAuthorizationHeaders(true);

  return readJson<InvestigationReportSnapshot>(`/api/admin/reports/${reportId}/review`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify({
      reviewStatus,
      rejectionReason: reviewStatus === "rejected" ? "관리자 반려" : undefined,
    }),
  });
}

export async function drawWinner(caseId: string) {
  const authHeaders = await getBrowserAuthorizationHeaders(true);

  return readJson<AdminWinnerRecord>(`/api/admin/cases/${caseId}/draw`, {
    method: "POST",
    headers: authHeaders,
  });
}

export async function updateWinnerReward(winnerId: string, status: string) {
  const authHeaders = await getBrowserAuthorizationHeaders(true);

  return readJson<AdminWinnerRecord>(`/api/admin/winners/${winnerId}/reward`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify({ status }),
  });
}
