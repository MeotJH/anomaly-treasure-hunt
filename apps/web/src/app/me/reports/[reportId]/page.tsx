import { notFound } from "next/navigation";
import { requireSignedIn } from "@/lib/auth";
import { getMyReportsView } from "@/modules/reports/application/get-my-reports-view";
import { ReportDeleteAction } from "@/modules/reports/presentation/components/report-delete-action";
import { ReportDetailView } from "@/modules/reports/presentation/components/report-detail-view";

export const dynamic = "force-dynamic";

export default async function MyReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  await requireSignedIn("/me/reports");
  const { reportId } = await params;
  const reports = await getMyReportsView();
  const report = reports.find((item) => item.id === reportId);

  if (!report) {
    notFound();
  }

  return (
    <ReportDetailView
      report={report}
      heading={report.caseTitle}
      description="제출한 증거 이미지와 검토 결과를 확인하는 개인 제보 상세 기록입니다."
      backHref="/me/reports?view=list"
      backLabel="내 제보 목록으로"
      imageMode="display"
      showOriginalLink={false}
      showArtifactNotice
      trailingActions={<ReportDeleteAction report={report} />}
    />
  );
}
