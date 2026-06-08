import { getServerAuthorizationHeaders } from "@/lib/api/server-auth";
import { appConfig } from "@/lib/config";
import {
  AdminCaseRecord,
  CaseDetail,
  CaseResult,
  CaseSummary,
} from "../domain/case";

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

export async function fetchCurrentCase() {
  return readJson<CaseSummary | null>("/api/cases/current");
}

export async function fetchCases() {
  return readJson<CaseSummary[]>("/api/cases");
}

export async function fetchCaseDetail(caseId: string) {
  const headers = await getServerAuthorizationHeaders(false);
  return readJson<CaseDetail>(`/api/cases/${caseId}`, {
    headers,
  });
}

export async function fetchCaseResult(caseId: string) {
  return readJson<CaseResult>(`/api/cases/${caseId}/result`);
}

export async function fetchAdminCases() {
  const headers = await getServerAuthorizationHeaders(true);
  return readJson<AdminCaseRecord[]>("/api/admin/cases", {
    headers,
  });
}
