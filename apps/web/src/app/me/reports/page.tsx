import { getMyReportsView } from "@/modules/reports/application/get-my-reports-view";
import { ReportHistoryList } from "@/modules/reports/presentation/components/report-history-list";

export const dynamic = "force-dynamic";

export default async function MyReportsPage() {
  const reports = await getMyReportsView();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(145deg,rgba(32,11,14,0.88),rgba(10,11,16,0.92))] p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">개인 제보 기록</p>
        <h2 className="mt-3 text-3xl font-semibold text-zinc-50">
          <span className="glitch-text" data-text="내가 남긴 현장 제보">
            내가 남긴 현장 제보
          </span>
        </h2>
        <p className="mt-3 text-sm leading-7 text-zinc-300">
          제출한 제보의 승인 상태, 코드 판정, 반려 사유를 시간순으로 확인할 수 있습니다.
        </p>
      </section>
      <ReportHistoryList reports={reports} />
    </div>
  );
}
