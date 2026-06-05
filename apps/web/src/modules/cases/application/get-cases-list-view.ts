import { fetchCases } from "../infrastructure/case-api";

export async function getCasesListView() {
  return fetchCases();
}

