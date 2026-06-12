"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { MyInvestigationReportSnapshot } from "../../domain/report";
import { deleteMyReport } from "../../infrastructure/report-browser-api";

function DeleteConfirmDialog({
  isDeleting,
  onCancel,
  onConfirm,
}: {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(4,5,8,0.82)] px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] border border-rose-500/18 bg-[linear-gradient(180deg,rgba(24,11,14,0.97),rgba(9,10,14,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.48)] sm:p-7">
        <p className="text-xs uppercase tracking-[0.28em] text-rose-300/70">
          Record Deletion Warning
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
          이 제보 기록을 삭제하시겠습니까?
        </h2>
        <p className="mt-4 text-sm leading-7 text-zinc-300">
          삭제된 기록은 복구할 수 없습니다. 제출한 이미지와 열람용 기록도 함께 정리됩니다.
        </p>

        <div className="mt-6 rounded-[1.5rem] border border-rose-400/16 bg-rose-500/8 p-4 text-sm text-rose-100">
          승인된 제보는 삭제할 수 없으며, 삭제가 진행되는 동안 다른 조작은 잠시 차단됩니다.
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="distressed-button distressed-button-neutral px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="distressed-button distressed-button-warn px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "삭제 처리 중..." : "삭제 진행"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReportDeleteAction({ report }: { report: MyInvestigationReportSnapshot }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const isBlocked = report.reviewStatus === "approved";

  function openConfirm() {
    if (isBlocked || isDeleting) {
      return;
    }

    setIsConfirmOpen(true);
  }

  function closeConfirm() {
    if (isDeleting) {
      return;
    }

    setIsConfirmOpen(false);
  }

  async function handleDelete() {
    if (isBlocked || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteMyReport(report.id);
      setIsConfirmOpen(false);
      toast.success("제보 기록 삭제 완료", {
        description: result.message,
      });
      router.push("/me/reports?view=list");
      router.refresh();
    } catch (error) {
      toast.error("제보 기록 삭제 실패", {
        description:
          error instanceof Error
            ? error.message
            : "제보 기록을 삭제하는 중 오류가 발생했습니다.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {isConfirmOpen ? (
        <DeleteConfirmDialog
          isDeleting={isDeleting}
          onCancel={closeConfirm}
          onConfirm={() => {
            void handleDelete();
          }}
        />
      ) : null}

      <button
        type="button"
        onClick={openConfirm}
        disabled={isBlocked || isDeleting}
        className="distressed-button distressed-button-warn px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isBlocked ? "승인된 제보는 삭제 불가" : isDeleting ? "제보 삭제 중..." : "내 제보 삭제"}
      </button>
    </>
  );
}
