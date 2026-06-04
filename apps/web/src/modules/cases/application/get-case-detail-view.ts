import { fetchCaseDetail } from "../infrastructure/case-api";

export async function getCaseDetailView(caseId: string) {
  return fetchCaseDetail(caseId);
}

