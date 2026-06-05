import { appConfig, createDemoHeaders } from "@/lib/config";
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
    throw new Error(`Request failed: ${response.status} ${path}`);
  }

  return (await response.json()) as T;
}

export async function fetchCurrentCase() {
  return readJson<CaseSummary | null>("/api/cases/current");
}

export async function fetchCases() {
  return readJson<CaseSummary[]>("/api/cases", {
    headers: createDemoHeaders("user"),
  });
}

export async function fetchCaseDetail(caseId: string) {
  return readJson<CaseDetail>(`/api/cases/${caseId}`, {
    headers: createDemoHeaders("user"),
  });
}

export async function fetchCaseResult(caseId: string) {
  return readJson<CaseResult>(`/api/cases/${caseId}/result`, {
    headers: createDemoHeaders("user"),
  });
}

export async function fetchAdminCases() {
  return readJson<AdminCaseRecord[]>("/api/admin/cases", {
    headers: createDemoHeaders("admin"),
  });
}

export async function createAdminCase(payload: {
  fileNo: string;
  title: string;
  accessLevel: string;
  status: "draft" | "published" | "closed" | "announced";
  rewardName: string;
  summary: string;
  reportBody: string;
  safetyNotice: string;
  startsAt: string;
  endsAt: string;
  announcedAt: string;
  answerLocation: string;
  identificationCode: string;
  completionMessage: string;
}) {
  return readJson<AdminCaseRecord>("/api/admin/cases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...createDemoHeaders("admin"),
    },
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCase(
  caseId: string,
  payload: Partial<{
    title: string;
    accessLevel: string;
    status: "draft" | "published" | "closed" | "announced";
    rewardName: string;
    summary: string;
    reportBody: string;
    safetyNotice: string;
    startsAt: string;
    endsAt: string;
    announcedAt: string;
    answerLocation: string;
    identificationCode: string;
    completionMessage: string;
  }>,
) {
  return readJson<AdminCaseRecord>(`/api/admin/cases/${caseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...createDemoHeaders("admin"),
    },
    body: JSON.stringify(payload),
  });
}
