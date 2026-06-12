"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CaseDetail } from "@/modules/cases/domain/case";
import { useInteractionLock } from "@/modules/shared/presentation/components/interaction-lock-context";
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

function buildSubmissionMessage(stage: SubmissionStage) {
  switch (stage) {
    case "uploading":
      return "증거 이미지를 업로드하는 중입니다...";
    case "submitting":
      return "보고서를 전송하는 중입니다...";
    case "redirecting":
      return "내 제보 기록으로 이동하는 중입니다...";
    default:
      return null;
  }
}

function buildSubmitButtonLabel(stage: SubmissionStage) {
  switch (stage) {
    case "uploading":
      return "이미지 업로드 중...";
    case "submitting":
      return "보고 전송 중...";
    case "redirecting":
      return "이동 중...";
    default:
      return "보고 전송";
  }
}

export function ReportForm({ caseDetail }: { caseDetail: CaseDetail }) {
  const router = useRouter();
  const { lock, unlock } = useInteractionLock();
  const caseId = caseDetail.id;
  const [code, setCode] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [submissionStage, setSubmissionStage] = useState<SubmissionStage>("idle");

  const isSubmitting = submissionStage !== "idle";
  const canEdit = caseDetail.canSubmitReport && !isSubmitting;

  useEffect(() => {
    const message = buildSubmissionMessage(submissionStage);

    if (message) {
      lock(message);
      return;
    }

    unlock();
  }, [lock, submissionStage, unlock]);

  useEffect(() => {
    return () => {
      unlock();
    };
  }, [unlock]);

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
            : "보고서를 전송하는 중 예상하지 못한 오류가 발생했습니다.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      className="rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-8 shadow-2xl shadow-black/30"
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
            현장에서 확인한 식별 코드와 증거 사진을 함께 제출합니다. 이름만 보이는 구조물이나 표식은
            일반 풍경으로 분류되어 반려될 수 있습니다.
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
          {selectedFileName ? <p className="mt-2 text-xs text-zinc-500">선택된 파일: {selectedFileName}</p> : null}
        </label>

        <button
          type="submit"
          disabled={!caseDetail.canSubmitReport || isSubmitting}
          className="distressed-button distressed-button-danger px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
        >
          {!caseDetail.canSubmitReport ? "현재 제출 불가" : buildSubmitButtonLabel(submissionStage)}
        </button>
      </fieldset>
    </form>
  );
}
