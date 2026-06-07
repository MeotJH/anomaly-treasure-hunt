import Link from "next/link";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";
import { MyInvestigationReportSnapshot } from "../../domain/report";

function buildReviewMessage(report: MyInvestigationReportSnapshot) {
  if (report.reviewStatus === "approved") {
    return "관리자 검토가 완료되어 추첨 대상에 포함된 기록입니다.";
  }

  if (report.reviewStatus === "rejected") {
    return "현장 근거가 부족하거나 코드 또는 촬영 조건이 맞지 않아 반려된 기록입니다.";
  }

  return "관리자 검토 대기 중입니다. 승인 여부가 결정되면 이력에 반영됩니다.";
}

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
              <p className="mt-2 text-sm text-zinc-400">증거 참조: {report.photoUrl}</p>
            </div>
            <StatusBadge label={report.reviewStatus} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-400">
            <span>사건 상태: {report.caseStatus}</span>
            <span>제출 코드: {report.submittedCodeMask}</span>
            <span>코드 판정: {report.isCodeCorrect ? "일치" : "불일치"}</span>
            <span>제출 시각: {new Date(report.submittedAt).toLocaleString("ko-KR")}</span>
            {report.reviewedAt ? (
              <span>검토 시각: {new Date(report.reviewedAt).toLocaleString("ko-KR")}</span>
            ) : null}
          </div>
          <p className="mt-4 text-sm leading-7 text-zinc-300">{buildReviewMessage(report)}</p>
          {report.rejectionReason ? (
            <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              반려 사유: {report.rejectionReason}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/cases/${report.caseId}`}
              className="distressed-button distressed-button-neutral px-4 py-2 text-sm"
            >
              사건 문서 보기
            </Link>
            <Link
              href={report.resultOpen ? `/cases/${report.caseId}/result` : `/cases/${report.caseId}/report`}
              className="distressed-button distressed-button-info px-4 py-2 text-sm"
            >
              {report.resultOpen ? "결과 구역 보기" : "추가 제보 화면 보기"}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
