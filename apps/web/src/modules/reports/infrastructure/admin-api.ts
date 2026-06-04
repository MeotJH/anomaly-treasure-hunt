import { appConfig, createDemoHeaders } from "@/lib/config";
import {
  AdminWinnerRecord,
  InvestigationReportSnapshot,
} from "../domain/report";

async function readJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchAdminReports(caseId: string) {
  return readJson<InvestigationReportSnapshot[]>(`/api/admin/cases/${caseId}/reports`, {
    headers: createDemoHeaders("admin"),
  });
}

export async function reviewAdminReport(
  reportId: string,
  reviewStatus: "approved" | "rejected",
) {
  return readJson<InvestigationReportSnapshot>(`/api/admin/reports/${reportId}/review`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...createDemoHeaders("admin"),
    },
    body: JSON.stringify({
      reviewStatus,
      rejectionReason: reviewStatus === "rejected" ? "관리자 반려" : undefined,
    }),
  });
}

export async function drawWinner(caseId: string) {
  return readJson<AdminWinnerRecord>(`/api/admin/cases/${caseId}/draw`, {
    method: "POST",
    headers: createDemoHeaders("admin"),
  });
}

export async function updateWinnerReward(winnerId: string, status: string) {
  return readJson<AdminWinnerRecord>(`/api/admin/winners/${winnerId}/reward`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...createDemoHeaders("admin"),
    },
    body: JSON.stringify({ status }),
  });
}

