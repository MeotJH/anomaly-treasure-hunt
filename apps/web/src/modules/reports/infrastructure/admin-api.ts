import { getServerAuthorizationHeaders } from "@/lib/api/server-auth";
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
  const headers = await getServerAuthorizationHeaders(true);

  return readJson<InvestigationReportSnapshot[]>(`/api/admin/cases/${caseId}/reports`, {
    headers,
  });
}
