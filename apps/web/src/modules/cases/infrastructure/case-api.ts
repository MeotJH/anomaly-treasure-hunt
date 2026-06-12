import { readJsonResponse } from "@/lib/api/read-json";
import { getServerAuthorizationHeaders } from "@/lib/api/server-auth";
import { appConfig } from "@/lib/config";
import {
  AdminCaseRecord,
  CaseDetail,
  CaseResult,
  CaseSummary,
} from "../domain/case";

async function readJson<T>(
  path: string,
  init?: RequestInit,
  options?: { allowEmpty?: boolean },
) {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    cache: "no-store",
  });

  return readJsonResponse<T>(response, options);
}

export async function fetchCurrentCase() {
  const caseItem = await readJson<CaseSummary | null | Record<string, never>>(
    "/api/cases/current",
    undefined,
    { allowEmpty: true },
  );

  if (!caseItem) {
    return null;
  }

  if (
    typeof caseItem === "object" &&
    !Array.isArray(caseItem) &&
    Object.keys(caseItem).length === 0
  ) {
    return null;
  }

  return caseItem as CaseSummary;
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
