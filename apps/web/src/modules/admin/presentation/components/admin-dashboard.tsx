"use client";

import { useState } from "react";
import { CaseSummary } from "@/modules/cases/domain/case";
import {
  drawWinner,
  reviewAdminReport,
  updateWinnerReward,
} from "@/modules/reports/infrastructure/admin-api";
import {
  AdminWinnerRecord,
  InvestigationReportSnapshot,
} from "@/modules/reports/domain/report";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";

interface AdminDashboardProps {
  caseItem: CaseSummary;
  reports: InvestigationReportSnapshot[];
}

export function AdminDashboard({ caseItem, reports: initialReports }: AdminDashboardProps) {
  const [reports, setReports] = useState(initialReports);
  const [winner, setWinner] = useState<AdminWinnerRecord | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleReview(reportId: string, reviewStatus: "approved" | "rejected") {
    try {
      const updatedReport = await reviewAdminReport(reportId, reviewStatus);
      setReports((current) =>
        current.map((report) => (report.id === reportId ? updatedReport : report)),
      );
      setMessage(`보고 ${reportId}가 ${reviewStatus} 처리되었습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "리뷰 중 오류가 발생했습니다.");
    }
  }

  async function handleDraw() {
    try {
      const selectedWinner = await drawWinner(caseItem.id);
      setWinner(selectedWinner);
      setMessage("보상 대상자가 추첨되었습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "추첨 중 오류가 발생했습니다.");
    }
  }

  async function handleRewardUpdate() {
    if (!winner) {
      return;
    }

    try {
      const updatedWinner = await updateWinnerReward(winner.id, "reward_sent");
      setWinner(updatedWinner);
      setMessage("보상 지급 상태가 reward_sent 로 변경되었습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "상태 갱신 중 오류가 발생했습니다.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{caseItem.fileNo}</p>
        <h2 className="mt-3 text-3xl font-semibold text-zinc-50">{caseItem.title}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-300">
          관리자 데모 모드입니다. `x-user-role=admin` 헤더를 사용하는 Nest API와 연결됩니다.
        </p>
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
            아직 제출된 보고가 없습니다.
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

