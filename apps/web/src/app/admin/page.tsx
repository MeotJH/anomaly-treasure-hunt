import { fetchCases, fetchCurrentCase } from "@/modules/cases/infrastructure/case-api";
import { fetchAdminReports } from "@/modules/reports/infrastructure/admin-api";
import { AdminDashboard } from "@/modules/admin/presentation/components/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const currentCase = await fetchCurrentCase();
  const cases = currentCase ? [currentCase] : await fetchCases();
  const targetCase = cases[0];

  if (!targetCase) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-zinc-300">
        관리할 사건이 없습니다.
      </div>
    );
  }

  const reports = await fetchAdminReports(targetCase.id);

  return <AdminDashboard caseItem={targetCase} reports={reports} />;
}

