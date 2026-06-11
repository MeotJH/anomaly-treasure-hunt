"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CaseDetail } from "@/modules/cases/domain/case";
import {
  removeEvidencePhoto,
  submitCaseReport,
  uploadEvidencePhoto,
} from "../../infrastructure/report-browser-api";

type SubmissionStage = "idle" | "uploading" | "submitting" | "redirecting";

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

function buildSubmissionCopy(stage: SubmissionStage) {
  switch (stage) {
    case "uploading":
      return {
        title: "기록 사본을 고정하는 중입니다.",
        description: "증거 이미지를 보관소로 옮기고 있습니다. 이 단계가 끝날 때까지 다른 조작은 잠시 중지됩니다.",
      };
    case "submitting":
      return {
        title: "보고서를 제출 중입니다.",
        description: "식별 코드와 증거 경로를 대조해 제보 기록을 작성하고 있습니다.",
      };
    case "redirecting":
      return {
        title: "열람 구역으로 이동 중입니다.",
        description: "접수된 기록을 정리한 뒤 개인 제보 목록으로 연결하고 있습니다.",
      };
    default:
      return {
        title: "",
        description: "",
      };
  }
}

function SubmissionOverlay({ stage }: { stage: Exclude<SubmissionStage, "idle"> }) {
  const copy = buildSubmissionCopy(stage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(5,6,9,0.82)] px-4 py-6 backdrop-blur-sm"
      aria-live="assertive"
      aria-busy="true"
      role="alert"
    >
      <div className="w-full max-w-5xl rounded-[2rem] border border-rose-500/16 bg-[linear-gradient(180deg,rgba(24,11,14,0.96),rgba(9,10,14,0.98))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-rose-300/70">Report Transfer In Progress</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base">{copy.description}</p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-300" />
            관측 기록 잠금
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
            <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
            <div className="mt-4 h-10 w-2/3 animate-pulse rounded-2xl bg-white/8" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full animate-pulse rounded-full bg-white/6" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/6" />
            </div>
            <div className="mt-6 rounded-[1.4rem] border border-rose-500/14 bg-black/20 p-4">
              <div className="h-3 w-32 animate-pulse rounded-full bg-white/8" />
              <div className="mt-4 h-14 w-full animate-pulse rounded-2xl bg-white/6" />
            </div>
            <div className="mt-5">
              <div className="h-3 w-20 animate-pulse rounded-full bg-white/8" />
              <div className="mt-3 h-13 w-full animate-pulse rounded-2xl bg-white/6" />
            </div>
            <div className="mt-5">
              <div className="h-3 w-24 animate-pulse rounded-full bg-white/8" />
              <div className="mt-3 h-24 w-full animate-pulse rounded-[1.6rem] bg-white/6" />
            </div>
            <div className="mt-6 h-11 w-36 animate-pulse rounded-full bg-rose-500/18" />
          </section>

          <aside className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
            <div className="h-3 w-16 animate-pulse rounded-full bg-white/10" />
            <div className="mt-4 h-8 w-3/4 animate-pulse rounded-2xl bg-white/8" />
            <div className="mt-4 flex gap-3">
              <div className="h-8 w-16 animate-pulse rounded-full bg-white/8" />
              <div className="h-8 w-24 animate-pulse rounded-full bg-white/8" />
            </div>
            <div className="mt-8 space-y-6">
              <div>
                <div className="h-3 w-24 animate-pulse rounded-full bg-white/8" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded-full bg-white/6" />
                  <div className="h-3 w-11/12 animate-pulse rounded-full bg-white/6" />
                  <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/6" />
                </div>
              </div>
              <div>
                <div className="h-3 w-20 animate-pulse rounded-full bg-white/8" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded-full bg-white/6" />
                  <div className="h-3 w-10/12 animate-pulse rounded-full bg-white/6" />
                  <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/6" />
                </div>
              </div>
              <div className="h-11 w-full animate-pulse rounded-full bg-white/8" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function ReportForm({ caseDetail }: { caseDetail: CaseDetail }) {
  const router = useRouter();
  const caseId = caseDetail.id;
  const [code, setCode] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [submissionStage, setSubmissionStage] = useState<SubmissionStage>("idle");

  const isSubmitting = submissionStage !== "idle";
  const canEdit = caseDetail.canSubmitReport && !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const uploadedFile = formData.get("evidence") as File | null;

    if (!uploadedFile || uploadedFile.size === 0) {
      toast.error("증거 이미지 누락", {
        description: "현장 증거 이미지를 먼저 선택해 주세요.",
      });
      return;
    }

    setSubmissionStage("uploading");

    let uploadedPath: string | null = null;

    try {
      const uploadedEvidence = await uploadEvidencePhoto(caseId, uploadedFile);
      uploadedPath = uploadedEvidence.path;

      setSubmissionStage("submitting");

      await submitCaseReport(caseId, {
        code,
        photoUrl: uploadedEvidence.path,
      });

      toast.success("보고서 접수 완료", {
        description: "방금 제출한 증거는 내 제보 기록에서 바로 확인할 수 있습니다.",
      });

      setSubmissionStage("redirecting");
      router.push("/me/reports");
    } catch (error) {
      if (uploadedPath) {
        try {
          await removeEvidencePhoto(uploadedPath);
        } catch {
          // Cleanup failure should not override the original submission error.
        }
      }

      setSubmissionStage("idle");

      toast.error("보고 전송 실패", {
        description:
          error instanceof Error
            ? error.message
            : "보고를 전송하는 중 예상하지 못한 오류가 발생했습니다.",
      });
    }
  }

  return (
    <>
      {isSubmitting ? <SubmissionOverlay stage={submissionStage} /> : null}

      <form
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        className={`rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-8 shadow-2xl shadow-black/30 ${
          isSubmitting ? "pointer-events-none select-none" : ""
        }`}
      >
        <fieldset disabled={!canEdit} className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">현장 증거 제출</p>
            <h2 className="mt-3 text-3xl font-semibold text-zinc-50">
              <span className="glitch-text" data-text="이상 징후 보고서 작성">
                이상 징후 보고서 작성
              </span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
              현장에서 확인한 식별 코드와 증거 사진을 함께 제출합니다. 이름이 보이는 구조물이 없으면 일반
              풍경으로 분류되어 반려될 수 있습니다.
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
              className="block w-full rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-4 text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-rose-500/15 file:px-4 file:py-2 file:text-rose-100"
            />
            {selectedFileName ? <p className="mt-2 text-xs text-zinc-500">선택한 파일: {selectedFileName}</p> : null}
          </label>

          <button
            type="submit"
            className="distressed-button distressed-button-danger px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {!caseDetail.canSubmitReport
              ? "현재 제출 불가"
              : isSubmitting
                ? "보고서 제출 중입니다"
                : "보고 전송"}
          </button>
        </fieldset>
      </form>
    </>
  );
}
