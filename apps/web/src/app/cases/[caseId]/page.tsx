import { getCaseDetailView } from "@/modules/cases/application/get-case-detail-view";
import { CaseDetailView } from "@/modules/cases/presentation/components/case-detail-view";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const caseDetail = await getCaseDetailView(caseId);

  return <CaseDetailView caseDetail={caseDetail} />;
}

