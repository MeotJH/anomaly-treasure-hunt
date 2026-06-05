import { InvestigationReportSnapshot } from "../../domain/report";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";

export function ReportHistoryList({ reports }: { reports: InvestigationReportSnapshot[] }) {
  if (reports.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
        아직 제출된 제보 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <article
          key={report.id}
          className="rounded-3xl border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{report.caseId}</p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-50">{report.photoUrl}</h3>
            </div>
            <StatusBadge label={report.reviewStatus} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-400">
            <span>코드 판정: {report.isCodeCorrect ? "일치" : "불일치"}</span>
            <span>제출 시각: {new Date(report.submittedAt).toLocaleString("ko-KR")}</span>
          </div>
          {report.rejectionReason ? (
            <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              반려 사유: {report.rejectionReason}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
