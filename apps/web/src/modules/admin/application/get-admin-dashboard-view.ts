import { fetchAdminCases } from "@/modules/cases/infrastructure/case-api";
import { fetchAdminReports } from "@/modules/reports/infrastructure/admin-api";

export async function getAdminDashboardView() {
  const cases = await fetchAdminCases();
  const selectedCase = cases[0] ?? null;
  const reports = selectedCase ? await fetchAdminReports(selectedCase.id) : [];

  return {
    cases,
    selectedCase,
    reports,
  };
}

