import { ReactNode } from "react";
import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";
import { MyInvestigationReportSnapshot } from "../../domain/report";

function buildReviewMessage(reviewStatus: string) {
  if (reviewStatus === "approved") {
    return "관리자 검토가 완료되어 추첨 대상에 포함된 기록입니다.";
  }

  if (reviewStatus === "rejected") {
    return "현장 근거가 부족하거나 코드 또는 촬영 조건이 맞지 않아 반려된 기록입니다.";
  }

  return "관리자 검토 대기 중입니다. 확인 결과가 결정되면 이력에 반영됩니다.";
}

export function ReportDetailView({
  report,
  heading,
  description,
  backHref,
  backLabel,
  trailingActions,
}: {
  report: MyInvestigationReportSnapshot;
  heading: string;
  description: string;
  backHref: string;
  backLabel: string;
  trailingActions?: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(145deg,rgba(32,11,14,0.88),rgba(10,11,16,0.92))] p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{report.caseFileNo}</p>
            <h2 className="mt-3 text-3xl font-semibold text-zinc-50">
              <span className="glitch-text" data-text={heading}>
                {heading}
              </span>
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">{description}</p>
          </div>
          <StatusBadge label={report.reviewStatus} />
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-6">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
          <img
            src={report.photoUrl}
            alt={`${report.caseTitle} 제출 증거`}
            className="max-h-[36rem] w-full object-cover"
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-6">
        <div className="flex flex-wrap gap-3 text-sm text-zinc-300">
          <span>제보 ID: {report.id}</span>
          <span>사건 상태: {report.caseStatus}</span>
          <span>제출 코드: {report.submittedCodeMask}</span>
          <span>코드 판정: {report.isCodeCorrect ? "일치" : "불일치"}</span>
          <span>제출 시각: {new Date(report.submittedAt).toLocaleString("ko-KR")}</span>
          {report.reviewedAt ? (
            <span>검토 시각: {new Date(report.reviewedAt).toLocaleString("ko-KR")}</span>
          ) : null}
        </div>
        <p className="mt-4 text-sm leading-7 text-zinc-300">{buildReviewMessage(report.reviewStatus)}</p>
        {report.rejectionReason ? (
          <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            반려 사유: {report.rejectionReason}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={report.photoUrl}
            target="_blank"
            rel="noreferrer"
            className="distressed-button distressed-button-neutral px-4 py-2 text-sm"
          >
            증거 원본 보기
          </a>
          <GlitchLink
            href={backHref}
            className="distressed-button distressed-button-info px-4 py-2 text-sm"
          >
            {backLabel}
          </GlitchLink>
          <GlitchLink
            href={report.resultOpen ? `/cases/${report.caseId}/result` : `/cases/${report.caseId}`}
            className="distressed-button distressed-button-neutral px-4 py-2 text-sm"
          >
            {report.resultOpen ? "결과 구역 보기" : "사건 문서 보기"}
          </GlitchLink>
          {trailingActions}
        </div>
      </section>
    </div>
  );
}
