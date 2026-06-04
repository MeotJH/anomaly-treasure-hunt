"use client";

import { FormEvent, useState } from "react";
import { submitCaseReport } from "../../infrastructure/report-api";

export function ReportForm({ caseId }: { caseId: string }) {
  const [code, setCode] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const uploadedFile = formData.get("evidence") as File | null;
    const photoUrl = uploadedFile?.name
      ? `local-evidence/${caseId}/${uploadedFile.name}`
      : "";

    if (!photoUrl) {
      setMessage("증거 사진 파일을 선택해야 합니다.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await submitCaseReport(caseId, {
        code,
        photoUrl,
      });
      setMessage(`${result.message} 코드 일치 여부: ${result.isCodeCorrect ? "일치" : "불일치"}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20"
    >
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Evidence Upload</p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-50">현장 증거 보고</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
            MVP 스캐폴드에서는 파일명 기준의 로컬 참조 경로를 만들어 제출합니다.
            이후 Supabase Storage 연동 시 infrastructure 계층만 교체하면 됩니다.
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">식별 코드</span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 outline-none placeholder:text-zinc-500 focus:border-emerald-400/40"
            placeholder="GREEN-LUNG-001"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">증거 사진 파일</span>
          <input
            type="file"
            name="evidence"
            accept="image/*"
            onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? "")}
            className="block w-full rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-4 text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-400/15 file:px-4 file:py-2 file:text-emerald-100"
          />
          {selectedFileName ? (
            <p className="mt-2 text-xs text-zinc-500">선택 파일: {selectedFileName}</p>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-medium text-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "제출 중..." : "보고 제출"}
        </button>

        {message ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
            {message}
          </div>
        ) : null}
      </div>
    </form>
  );
}
