import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";
import { MyInvestigationReportSnapshot } from "../../domain/report";

export function ReportHistoryList({ reports }: { reports: MyInvestigationReportSnapshot[] }) {
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
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{report.caseFileNo}</p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-50">{report.caseTitle}</h3>
            </div>
            <StatusBadge label={report.reviewStatus} />
          </div>

          <div className="mt-4 flex gap-4">
            <div className="h-24 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              <img
                src={report.displayPhotoUrl ?? report.photoUrl}
                alt={`${report.caseTitle} 제출 증거`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
                <span>사건 상태: {report.caseStatus}</span>
                <span>코드 판정: {report.isCodeCorrect ? "일치" : "불일치"}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                제출 시각: {new Date(report.submittedAt).toLocaleString("ko-KR")}
              </p>
              {report.displayPhotoUrl ? (
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-amber-200/70">
                  열람용 사본에 기록 손실 반영됨
                </p>
              ) : null}
              <div className="mt-4">
                <GlitchLink
                  href={`/me/reports/${report.id}`}
                  className="distressed-button distressed-button-info px-4 py-2 text-sm"
                >
                  제보 상세 보기
                </GlitchLink>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
