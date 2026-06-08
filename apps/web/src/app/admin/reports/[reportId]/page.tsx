import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { AdminReportActions } from "@/modules/admin/presentation/components/admin-report-actions";
import { fetchAdminReports } from "@/modules/reports/infrastructure/admin-api";
import { ReportDetailView } from "@/modules/reports/presentation/components/report-detail-view";

export const dynamic = "force-dynamic";

export default async function AdminReportDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{
    caseId?: string;
    caseTitle?: string;
    caseFileNo?: string;
    caseStatus?: string;
  }>;
}) {
  await requireAdmin("/admin");
  const { reportId } = await params;
  const { caseId, caseTitle, caseFileNo, caseStatus } = await searchParams;

  if (!caseId) {
    notFound();
  }

  const reports = await fetchAdminReports(caseId);
  const report = reports.find((item) => item.id === reportId);

  if (!report) {
    notFound();
  }

  return (
    <ReportDetailView
      report={{
        ...report,
        caseFileNo: caseFileNo ?? report.caseId,
        caseTitle: caseTitle ?? "관리자 검토 대상 제보",
        caseStatus: caseStatus ?? "published",
        resultOpen: false,
      }}
      heading={caseTitle ?? "관리자 제보 상세"}
      description="제출된 증거 이미지와 코드 판정, 검토 상태를 확인한 뒤 승인 또는 반려를 결정합니다."
      backHref="/admin"
      backLabel="통제실로 복귀"
      trailingActions={<AdminReportActions reportId={report.id} />}
    />
  );
}
