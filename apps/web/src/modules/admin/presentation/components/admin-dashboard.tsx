"use client";

import { useState, useTransition } from "react";
import { AdminCaseRecord, CaseSummary } from "@/modules/cases/domain/case";
import {
  fetchAdminReports,
  drawWinner,
  reviewAdminReport,
  updateWinnerReward,
} from "@/modules/reports/infrastructure/admin-api";
import {
  AdminWinnerRecord,
  InvestigationReportSnapshot,
} from "@/modules/reports/domain/report";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";
import { AdminCaseManager } from "./admin-case-manager";

interface AdminDashboardProps {
  cases: AdminCaseRecord[];
  caseItem: CaseSummary;
  reports: InvestigationReportSnapshot[];
}

export function AdminDashboard({
  cases: initialCases,
  caseItem,
  reports: initialReports,
}: AdminDashboardProps) {
  const [cases, setCases] = useState(initialCases);
  const [selectedCaseId, setSelectedCaseId] = useState(caseItem.id);
  const [reports, setReports] = useState(initialReports);
  const [winner, setWinner] = useState<AdminWinnerRecord | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedCase =
    cases.find((candidate) => candidate.id === selectedCaseId) ?? cases[0] ?? caseItem;

  async function loadReportsForCase(caseId: string) {
    try {
      const nextReports = await fetchAdminReports(caseId);
      setReports(nextReports);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load reports.");
    }
  }

  function handleSelectedCaseChange(nextCaseId: string) {
    setSelectedCaseId(nextCaseId);
    setWinner(null);
    setMessage(null);

    startTransition(() => {
      void loadReportsForCase(nextCaseId);
    });
  }

  async function handleReview(reportId: string, reviewStatus: "approved" | "rejected") {
    try {
      const updatedReport = await reviewAdminReport(reportId, reviewStatus);
      setReports((current) =>
        current.map((report) => (report.id === reportId ? updatedReport : report)),
      );
      setMessage(`Report ${reportId} was marked as ${reviewStatus}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred while reviewing.");
    }
  }

  async function handleDraw() {
    try {
      const selectedWinner = await drawWinner(selectedCase.id);
      setWinner(selectedWinner);
      setMessage("A winner was selected from approved reports.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred during draw.");
    }
  }

  async function handleRewardUpdate() {
    if (!winner) {
      return;
    }

    try {
      const updatedWinner = await updateWinnerReward(winner.id, "reward_sent");
      setWinner(updatedWinner);
      setMessage("Winner reward status was updated to reward_sent.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "An error occurred while updating reward state.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <AdminCaseManager
        cases={cases}
        selectedCaseId={selectedCaseId}
        onCasesChange={setCases}
        onSelectedCaseChange={handleSelectedCaseChange}
      />

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{selectedCase.fileNo}</p>
        <h2 className="mt-3 text-3xl font-semibold text-zinc-50">{selectedCase.title}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-300">
          Demo admin mode backed by the Nest API using the `x-user-role=admin` header.
        </p>
        {isPending ? (
          <p className="mt-3 text-sm text-zinc-400">Loading reports for selected case...</p>
        ) : null}
      </section>

      <section className="space-y-4">
        {reports.map((report) => (
          <article key={report.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{report.id}</p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-50">{report.photoUrl}</h3>
              </div>
              <StatusBadge label={report.reviewStatus} />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleReview(report.id, "approved")}
                className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100"
              >
                Approve
              </button>
              <button
                onClick={() => handleReview(report.id, "rejected")}
                className="rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm text-rose-100"
              >
                Reject
              </button>
            </div>
          </article>
        ))}
        {reports.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
            No submitted reports are available for this case.
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDraw}
            className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-100"
          >
            Draw Winner
          </button>
          <button
            onClick={handleRewardUpdate}
            disabled={!winner}
            className="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100 disabled:opacity-40"
          >
            Mark Reward Sent
          </button>
        </div>

        {winner ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Winner</p>
            <p className="mt-2 text-sm text-zinc-200">
              {winner.id} / user: {winner.userId}
            </p>
            <div className="mt-3">
              <StatusBadge label={winner.status} />
            </div>
          </div>
        ) : null}

        {message ? <p className="mt-4 text-sm text-zinc-300">{message}</p> : null}
      </section>
    </div>
  );
}
