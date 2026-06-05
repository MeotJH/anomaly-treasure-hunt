import { appConfig, createDemoHeaders } from "@/lib/config";
import {
  AdminCaseRecord,
  CaseClue,
  CaseDetail,
  CaseResult,
  CaseSummary,
  MissionInstruction,
} from "../domain/case";

export interface AdminCasePayload {
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
  clues: CaseClue[];
  mission: MissionInstruction;
}

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

export async function createAdminCase(payload: AdminCasePayload) {
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
  payload: Partial<AdminCasePayload>,
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
