"use client";

import { useMemo, useState, useTransition } from "react";
import { AdminCaseRecord, CaseSummary } from "@/modules/cases/domain/case";
import { updateAdminCase } from "@/modules/cases/infrastructure/case-admin-browser-api";
import {
  fetchAdminReports,
  drawWinner,
  reviewAdminReport,
  updateWinnerReward,
} from "@/modules/reports/infrastructure/admin-browser-api";
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

type CaseStatusFilter = "all" | "draft" | "published" | "closed" | "announced";
type ManagedCaseStatus = "draft" | "published" | "closed" | "announced";

const filterLabels: Record<CaseStatusFilter, string> = {
  all: "전체",
  draft: "초안",
  published: "공개 중",
  closed: "종료",
  announced: "발표됨",
};

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
  const [statusFilter, setStatusFilter] = useState<CaseStatusFilter>("all");
  const [isPending, startTransition] = useTransition();

  const selectedCase =
    cases.find((candidate) => candidate.id === selectedCaseId) ?? cases[0] ?? caseItem;

  const filteredCases = useMemo(
    () =>
      statusFilter === "all"
        ? cases
        : cases.filter((caseItem) => caseItem.status === statusFilter),
    [cases, statusFilter],
  );

  async function loadReportsForCase(caseId: string) {
    try {
      const nextReports = await fetchAdminReports(caseId);
      setReports(nextReports);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "제보 목록을 불러오지 못했습니다.");
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
      setMessage(
        reviewStatus === "approved"
          ? `${reportId} 제보를 승인했습니다.`
          : `${reportId} 제보를 반려했습니다.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "제보 검토 중 오류가 발생했습니다.");
    }
  }

  async function handleDraw() {
    try {
      const selectedWinner = await drawWinner(selectedCase.id);
      setWinner(selectedWinner);
      setMessage("승인된 제보 중에서 보상 대상을 선정했습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "대상 선정 중 오류가 발생했습니다.");
    }
  }

  async function handleRewardUpdate() {
    if (!winner) {
      return;
    }

    try {
      const updatedWinner = await updateWinnerReward(winner.id, "reward_sent");
      setWinner(updatedWinner);
      setMessage("보상 지급 상태를 반영했습니다.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "보상 상태 변경 중 오류가 발생했습니다.",
      );
    }
  }

  async function handleCaseStatusChange(status: ManagedCaseStatus) {
    try {
      const updated = await updateAdminCase(selectedCase.id, { status });
      setCases((current) =>
        current.map((caseItem) => (caseItem.id === updated.id ? updated : caseItem)),
      );
      setSelectedCaseId(updated.id);
      setMessage(`${updated.fileNo} 문서 상태를 ${filterLabels[status]}로 변경했습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "문서 상태 변경에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-rose-950/40 bg-[linear-gradient(145deg,rgba(36,12,16,0.88),rgba(10,11,16,0.92))] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">통제실 필터</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-50">
              <span className="glitch-text" data-text="사건 상태별 보기">
                사건 상태별 보기
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(filterLabels) as CaseStatusFilter[]).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setStatusFilter(filterKey)}
                className={`distressed-button px-4 py-2 text-sm ${
                  statusFilter === filterKey
                    ? "distressed-button-danger"
                    : "distressed-button-neutral"
                }`}
              >
                {filterLabels[filterKey]}{" "}
                {filterKey === "all"
                  ? cases.length
                  : cases.filter((item) => item.status === filterKey).length}
              </button>
            ))}
          </div>
        </div>
      </section>

      <AdminCaseManager
        cases={filteredCases}
        selectedCaseId={selectedCaseId}
        onCasesChange={setCases}
        onSelectedCaseChange={handleSelectedCaseChange}
      />

      <section className="rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(145deg,rgba(36,12,16,0.88),rgba(10,11,16,0.92))] p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{selectedCase.fileNo}</p>
            <h2 className="mt-3 text-3xl font-semibold text-zinc-50">
              <span className="glitch-text" data-text={selectedCase.title}>
                {selectedCase.title}
              </span>
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              통제실에서는 사건 문서 공개, 제보 승인 또는 반려, 보상 대상 선정까지 한 번에
              처리합니다.
            </p>
          </div>
          <StatusBadge label={selectedCase.status} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleCaseStatusChange("draft")}
            className="distressed-button distressed-button-neutral px-4 py-2 text-sm"
          >
            초안으로 전환
          </button>
          <button
            type="button"
            onClick={() => handleCaseStatusChange("closed")}
            className="distressed-button distressed-button-warn px-4 py-2 text-sm"
          >
            사건 종료
          </button>
          <button
            type="button"
            onClick={() => handleCaseStatusChange("announced")}
            className="distressed-button distressed-button-info px-4 py-2 text-sm"
          >
            발표 상태로 전환
          </button>
        </div>

        {isPending ? (
          <p className="mt-3 text-sm text-zinc-400">선택한 문서의 제보 기록을 불러오는 중입니다...</p>
        ) : null}
      </section>

      <section className="space-y-4">
        {reports.map((report) => (
          <article
            key={report.id}
            className="rounded-3xl border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{report.id}</p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-50">{report.photoUrl}</h3>
              </div>
              <StatusBadge label={report.reviewStatus} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-400">
              <span>코드 판정: {report.isCodeCorrect ? "일치" : "불일치"}</span>
              <span>제출 시각: {new Date(report.submittedAt).toLocaleString("ko-KR")}</span>
            </div>
            {report.rejectionReason ? (
              <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                반려 사유: {report.rejectionReason}
              </p>
            ) : null}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleReview(report.id, "approved")}
                className="distressed-button distressed-button-success px-4 py-2 text-sm"
              >
                승인
              </button>
              <button
                onClick={() => handleReview(report.id, "rejected")}
                className="distressed-button distressed-button-danger px-4 py-2 text-sm"
              >
                반려
              </button>
            </div>
          </article>
        ))}
        {reports.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
            이 문서에는 아직 제출된 제보가 없습니다.
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDraw}
            className="distressed-button distressed-button-warn px-4 py-2 text-sm"
          >
            보상 대상 추첨
          </button>
          <button
            onClick={handleRewardUpdate}
            disabled={!winner}
            className="distressed-button distressed-button-info px-4 py-2 text-sm"
          >
            보상 지급 처리
          </button>
        </div>

        {winner ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">선정 기록</p>
            <p className="mt-2 text-sm text-zinc-200">
              제보자: {winner.userId} / 기록 ID: {winner.id}
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
