"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { MyInvestigationReportSnapshot } from "../../domain/report";
import { deleteMyReport } from "../../infrastructure/report-browser-api";

export function ReportDeleteAction({ report }: { report: MyInvestigationReportSnapshot }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const isBlocked = report.reviewStatus === "approved";

  async function handleDelete() {
    if (isBlocked || isDeleting) {
      return;
    }

    const confirmed = window.confirm("이 제보 기록을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteMyReport(report.id);
      toast.success("제보 기록 삭제 완료", {
        description: result.message,
      });
      router.push("/me/reports?view=list");
      router.refresh();
    } catch (error) {
      toast.error("제보 기록 삭제 실패", {
        description:
          error instanceof Error ? error.message : "제보 기록을 삭제하는 중 오류가 발생했습니다.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isBlocked || isDeleting}
      className="distressed-button distressed-button-warn px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isBlocked ? "승인된 제보는 삭제 불가" : isDeleting ? "제보 삭제 중.." : "내 제보 삭제"}
    </button>
  );
}
