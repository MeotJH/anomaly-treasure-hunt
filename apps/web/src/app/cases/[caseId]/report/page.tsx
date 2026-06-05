import { getCaseDetailView } from "@/modules/cases/application/get-case-detail-view";
import { ReportForm } from "@/modules/reports/presentation/components/report-form";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const caseDetail = await getCaseDetailView(caseId);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <ReportForm caseId={caseId} />
      <aside className="space-y-6 rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{caseDetail.fileNo}</p>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-50">{caseDetail.title}</h2>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
            증거 촬영 조건
          </h3>
          <p className="mt-3 text-sm leading-7 text-zinc-300">{caseDetail.mission.photoRequirement}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">안전 수칙</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-300">{caseDetail.safetyNotice}</p>
        </div>
      </aside>
    </div>
  );
}
