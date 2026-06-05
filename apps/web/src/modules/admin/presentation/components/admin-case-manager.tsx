"use client";

import { FormEvent, useMemo, useState } from "react";
import { AdminCaseRecord } from "@/modules/cases/domain/case";
import { createAdminCase, updateAdminCase } from "@/modules/cases/infrastructure/case-api";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";

interface AdminCaseManagerProps {
  cases: AdminCaseRecord[];
  selectedCaseId: string;
  onCasesChange: (cases: AdminCaseRecord[]) => void;
  onSelectedCaseChange: (caseId: string) => void;
}

function isoInTwoDays() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString();
}

export function AdminCaseManager({
  cases,
  selectedCaseId,
  onCasesChange,
  onSelectedCaseChange,
}: AdminCaseManagerProps) {
  const [message, setMessage] = useState<string | null>(null);
  const selectedCase = useMemo(
    () => cases.find((caseItem) => caseItem.id === selectedCaseId) ?? cases[0] ?? null,
    [cases, selectedCaseId],
  );

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const createdCase = await createAdminCase({
        fileNo: String(formData.get("fileNo") ?? ""),
        title: String(formData.get("title") ?? ""),
        accessLevel: "Public Observation",
        status: "draft",
        rewardName: String(formData.get("rewardName") ?? ""),
        summary: String(formData.get("summary") ?? ""),
        reportBody: String(formData.get("reportBody") ?? ""),
        safetyNotice: String(formData.get("safetyNotice") ?? ""),
        startsAt: new Date().toISOString(),
        endsAt: isoInTwoDays(),
        announcedAt: isoInTwoDays(),
        answerLocation: String(formData.get("answerLocation") ?? ""),
        identificationCode: String(formData.get("identificationCode") ?? ""),
        completionMessage: String(formData.get("completionMessage") ?? ""),
      });
      onCasesChange([createdCase, ...cases]);
      onSelectedCaseChange(createdCase.id);
      setMessage(`Created ${createdCase.fileNo}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create case.");
    }
  }

  async function handlePublish() {
    if (!selectedCase) {
      return;
    }

    try {
      const updated = await updateAdminCase(selectedCase.id, { status: "published" });
      onCasesChange(cases.map((caseItem) => (caseItem.id === updated.id ? updated : caseItem)));
      onSelectedCaseChange(updated.id);
      setMessage(`Updated ${updated.fileNo} to published.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update case.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Case Registry</p>
            <h3 className="mt-2 text-2xl font-semibold text-zinc-50">Manage Cases</h3>
          </div>
          {selectedCase ? <StatusBadge label={selectedCase.status} /> : null}
        </div>

        <div className="mt-6 space-y-3">
          {cases.map((caseItem) => (
            <button
              key={caseItem.id}
              type="button"
              onClick={() => onSelectedCaseChange(caseItem.id)}
              className={`w-full rounded-2xl border px-4 py-4 text-left ${
                selectedCase?.id === caseItem.id
                  ? "border-emerald-400/30 bg-emerald-400/10"
                  : "border-white/10 bg-black/20"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{caseItem.fileNo}</p>
              <p className="mt-2 text-base font-medium text-zinc-100">{caseItem.title}</p>
              <p className="mt-2 text-sm text-zinc-400">{caseItem.summary}</p>
            </button>
          ))}
        </div>

        {selectedCase ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-zinc-300">Answer location: {selectedCase.answerLocation}</p>
            <p className="mt-2 text-sm text-zinc-300">Identification code: {selectedCase.identificationCode}</p>
            <button
              type="button"
              onClick={handlePublish}
              className="mt-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100"
            >
              Publish Selected Case
            </button>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Create Draft</p>
        <h3 className="mt-2 text-2xl font-semibold text-zinc-50">New Case</h3>
        <form onSubmit={handleCreate} className="mt-6 space-y-4">
          <input name="fileNo" placeholder="FILE-010" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50" />
          <input name="title" placeholder="Case title" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50" />
          <input name="rewardName" placeholder="Reward label" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50" />
          <input name="answerLocation" placeholder="Answer location" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50" />
          <input name="identificationCode" placeholder="Identification code" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50" />
          <textarea name="summary" placeholder="Summary" rows={3} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50" />
          <textarea name="reportBody" placeholder="Report body" rows={5} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50" />
          <textarea name="safetyNotice" placeholder="Safety notice" rows={3} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50" />
          <textarea name="completionMessage" placeholder="Completion message" rows={3} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-50" />
          <button
            type="submit"
            className="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100"
          >
            Create Draft Case
          </button>
        </form>
        {message ? <p className="mt-4 text-sm text-zinc-300">{message}</p> : null}
      </section>
    </div>
  );
}
