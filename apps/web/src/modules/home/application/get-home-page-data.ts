import { fetchCases, fetchCurrentCase } from "@/modules/cases/infrastructure/case-api";

export async function getHomePageData() {
  const [currentCase, cases] = await Promise.all([fetchCurrentCase(), fetchCases()]);

  return {
    currentCase,
    archivedCases: currentCase
      ? cases.filter((caseItem) => caseItem.id !== currentCase.id)
      : cases,
  };
}

