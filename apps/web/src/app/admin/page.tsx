import { requireAdmin } from "@/lib/auth";
import { getAdminDashboardView } from "@/modules/admin/application/get-admin-dashboard-view";
import { AdminDashboard } from "@/modules/admin/presentation/components/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin("/admin");
  const { cases, selectedCase, reports } = await getAdminDashboardView();

  if (!selectedCase) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-zinc-300">
        통제실에서 관리할 사건 문서가 아직 없습니다.
      </div>
    );
  }

  return <AdminDashboard cases={cases} caseItem={selectedCase} reports={reports} />;
}
