import { getMyReportsView } from "@/modules/reports/application/get-my-reports-view";
import { ReportHistoryList } from "@/modules/reports/presentation/components/report-history-list";

export const dynamic = "force-dynamic";

export default async function MyReportsPage() {
  const reports = await getMyReportsView();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">My Reports</p>
        <h2 className="mt-3 text-3xl font-semibold text-zinc-50">내 보고 이력</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-300">
          데모 사용자 기준 보고 목록입니다. 실제 인증 연동 시 세션 사용자 기준으로 대체됩니다.
        </p>
      </section>
      <ReportHistoryList reports={reports} />
    </div>
  );
}

