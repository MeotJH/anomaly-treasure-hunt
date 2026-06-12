import { readJsonResponse } from "@/lib/api/read-json";
import { getServerAuthorizationHeaders } from "@/lib/api/server-auth";
import { appConfig } from "@/lib/config";
import { InvestigationReportSnapshot } from "../domain/report";

async function readJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    cache: "no-store",
  });

  return readJsonResponse<T>(response);
}

export async function fetchAdminReports(caseId: string) {
  const headers = await getServerAuthorizationHeaders(true);

  return readJson<InvestigationReportSnapshot[]>(
    `/api/admin/cases/${caseId}/reports`,
    {
      headers,
    },
  );
}
