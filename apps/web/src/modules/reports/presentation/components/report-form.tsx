"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CaseDetail } from "@/modules/cases/domain/case";
import { submitCaseReport } from "../../infrastructure/report-browser-api";

function buildTone(state: CaseDetail["reportAvailability"]["state"]) {
  switch (state) {
    case "approved_locked":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
    case "limit_reached":
      return "border-amber-400/20 bg-amber-400/10 text-amber-100";
    case "closed":
      return "border-white/10 bg-white/5 text-zinc-300";
    default:
      return "border-sky-400/20 bg-sky-400/10 text-sky-100";
  }
}

export function ReportForm({ caseDetail }: { caseDetail: CaseDetail }) {
  const caseId = caseDetail.id;
  const [code, setCode] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [resultHref, setResultHref] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const uploadedFile = formData.get("evidence") as File | null;
    const photoUrl = uploadedFile?.name ? `local-evidence/${caseId}/${uploadedFile.name}` : "";

    if (!photoUrl) {
      setMessage("현장 증거 이미지를 먼저 선택해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setResultHref(null);

    try {
      const result = await submitCaseReport(caseId, {
        code,
        photoUrl,
      });
      setMessage(`${result.message} 식별 코드 일치 여부: ${result.isCodeCorrect ? "일치" : "불일치"}`);
      setResultHref(`/cases/${caseId}/result`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "보고서 전송 중 예기치 못한 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-8 shadow-2xl shadow-black/30"
    >
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">현장 증거 제출</p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-50">
            <span className="glitch-text" data-text="이상 징후 보고서 작성">
              이상 징후 보고서 작성
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
            현장에서 확인한 식별 코드와 증거 사진을 함께 제출합니다. 이름이 보이는 구조물이 없으면 일반 풍경으로
            분류되어 반려될 수 있습니다.
          </p>
        </div>

        <div className={`rounded-2xl border px-4 py-4 text-sm ${buildTone(caseDetail.reportAvailability.state)}`}>
          <p>{caseDetail.reportAvailability.message}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-current/80">
            <span>누적 제출: {caseDetail.myReportStatus.submissionCount} / 5</span>
            <span>남은 제출: {caseDetail.myReportStatus.remainingSubmissionCount}회</span>
            {caseDetail.myReportStatus.latestReviewStatus ? (
              <span>최근 검토 상태: {caseDetail.myReportStatus.latestReviewStatus}</span>
            ) : null}
          </div>
          {caseDetail.myReportStatus.latestSubmittedAt ? (
            <p className="mt-2 text-xs text-current/70">
              최근 제출 시각: {new Date(caseDetail.myReportStatus.latestSubmittedAt).toLocaleString("ko-KR")}
            </p>
          ) : null}
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">식별 코드</span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            disabled={!caseDetail.canSubmitReport || isSubmitting}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 outline-none placeholder:text-zinc-500 focus:border-rose-400/40"
            placeholder="현장에서 확인한 코드를 입력"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">증거 이미지</span>
          <input
            type="file"
            name="evidence"
            accept="image/*"
            onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? "")}
            disabled={!caseDetail.canSubmitReport || isSubmitting}
            className="block w-full rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-4 text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-rose-500/15 file:px-4 file:py-2 file:text-rose-100"
          />
          {selectedFileName ? <p className="mt-2 text-xs text-zinc-500">선택한 파일: {selectedFileName}</p> : null}
        </label>

        <button
          type="submit"
          disabled={!caseDetail.canSubmitReport || isSubmitting}
          className="distressed-button distressed-button-danger px-5 py-3 text-sm font-medium"
        >
          {!caseDetail.canSubmitReport
            ? "현재 제출 불가"
            : isSubmitting
              ? "보고서 전송 중..."
              : "보고서 전송"}
        </button>

        {message ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
            {message}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {resultHref ? (
            <Link href={resultHref} className="distressed-button distressed-button-info px-4 py-2 text-sm">
              결과 구역 보기
            </Link>
          ) : null}
          {!caseDetail.canSubmitReport ? (
            <Link
              href={
                caseDetail.reportAvailability.state === "closed"
                  ? `/cases/${caseId}/result`
                  : "/me/reports"
              }
              className="distressed-button distressed-button-neutral px-4 py-2 text-sm"
            >
              {caseDetail.reportAvailability.state === "closed" ? "결과 구역 확인" : "내 제보 이력 보기"}
            </Link>
          ) : null}
        </div>
      </div>
    </form>
  );
}
