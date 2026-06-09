import { requireSignedIn } from "@/lib/auth";
import { getCaseDetailView } from "@/modules/cases/application/get-case-detail-view";
import { DifficultyBadge } from "@/modules/cases/presentation/components/difficulty-badge";
import { difficultyMeta } from "@/modules/cases/domain/difficulty";
import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";
import { ReportForm } from "@/modules/reports/presentation/components/report-form";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  await requireSignedIn(`/cases/${caseId}/report`);
  const caseDetail = await getCaseDetailView(caseId);
  const difficulty = difficultyMeta[caseDetail.difficultyGrade];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <ReportForm caseDetail={caseDetail} />
      <aside className="space-y-6 rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{caseDetail.fileNo}</p>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-50">{caseDetail.title}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <DifficultyBadge grade={caseDetail.difficultyGrade} />
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              {difficulty.summary}
            </span>
          </div>
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
        <GlitchLink
          href="/guide"
          className="signal-chip distressed-button distressed-button-neutral w-full px-5 py-3 text-center text-sm font-medium"
        >
          관측 안내 보기
        </GlitchLink>
      </aside>
    </div>
  );
}
