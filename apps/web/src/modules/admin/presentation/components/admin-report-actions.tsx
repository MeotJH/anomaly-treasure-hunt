"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { reviewAdminReport } from "@/modules/reports/infrastructure/admin-browser-api";

export function AdminReportActions({
  reportId,
}: {
  reportId: string;
}) {
  const router = useRouter();

  async function handleReview(reviewStatus: "approved" | "rejected") {
    try {
      await reviewAdminReport(reportId, reviewStatus);
      toast.success(reviewStatus === "approved" ? "제보 승인 완료" : "제보 반려 완료", {
        description:
          reviewStatus === "approved"
            ? "이 제보는 추첨 검토 대상에 포함됩니다."
            : "반려 사유와 함께 기록 상태가 갱신되었습니다.",
      });
      router.refresh();
    } catch (error) {
      toast.error("검토 처리 실패", {
        description:
          error instanceof Error ? error.message : "제보 상태를 갱신하는 중 오류가 발생했습니다.",
      });
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void handleReview("approved")}
        className="distressed-button distressed-button-success px-4 py-2 text-sm"
      >
        승인
      </button>
      <button
        type="button"
        onClick={() => void handleReview("rejected")}
        className="distressed-button distressed-button-danger px-4 py-2 text-sm"
      >
        반려
      </button>
    </>
  );
}
