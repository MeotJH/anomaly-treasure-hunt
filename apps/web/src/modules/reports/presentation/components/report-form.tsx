"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { submitCaseReport } from "../../infrastructure/report-api";

export function ReportForm({ caseId }: { caseId: string }) {
  const [code, setCode] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [resultHref, setResultHref] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const uploadedFile = formData.get("evidence") as File | null;
    const photoUrl = uploadedFile?.name
      ? `local-evidence/${caseId}/${uploadedFile.name}`
      : "";

    if (!photoUrl) {
      setMessage("Select an evidence image before submitting.");
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
      setMessage(
        `${result.message} Code match: ${result.isCodeCorrect ? "matched" : "not matched"}`,
      );
      setResultHref(`/cases/${caseId}/result`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "An unexpected error occurred while submitting.",
      );
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
          <h2 className="mt-3 text-3xl font-semibold text-zinc-50">Submit Field Evidence</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
            This MVP scaffold submits a local evidence path derived from the selected file
            name. When storage is introduced later, the infrastructure layer can be swapped
            without changing the screen flow.
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">Identification code</span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50 outline-none placeholder:text-zinc-500 focus:border-emerald-400/40"
            placeholder="GREEN-LUNG-001"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">Evidence image</span>
          <input
            type="file"
            name="evidence"
            accept="image/*"
            onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? "")}
            className="block w-full rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-4 text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-400/15 file:px-4 file:py-2 file:text-emerald-100"
          />
          {selectedFileName ? (
            <p className="mt-2 text-xs text-zinc-500">Selected file: {selectedFileName}</p>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-medium text-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit report"}
        </button>

        {message ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
            {message}
          </div>
        ) : null}

        {resultHref ? (
          <Link
            href={resultHref}
            className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100"
          >
            View result screen
          </Link>
        ) : null}
      </div>
    </form>
  );
}
