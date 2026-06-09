import { CaseSummary } from "@/modules/cases/domain/case";
import { DifficultyBadge } from "@/modules/cases/presentation/components/difficulty-badge";
import { CaseThumbnail } from "@/modules/cases/presentation/components/case-thumbnail";
import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";

export function ArchiveCaseCard({ caseItem }: { caseItem: CaseSummary }) {
  return (
    <article className="haunted-panel grid gap-4 rounded-[1.65rem] border border-white/8 bg-[linear-gradient(180deg,rgba(15,12,16,0.94),rgba(9,10,14,0.92))] p-4 sm:grid-cols-[11rem_1fr]">
      <CaseThumbnail caseItem={caseItem} variant="compact" />
      <div className="relative z-10 flex flex-col justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-zinc-500">{caseItem.fileNo}</p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-50">{caseItem.title}</h3>
            </div>
            <StatusBadge label={caseItem.status} />
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-7 text-zinc-300">{caseItem.summary}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <DifficultyBadge grade={caseItem.difficultyGrade} compact />
            <p className="text-xs text-zinc-400">{caseItem.rewardName}</p>
          </div>
          <GlitchLink
            href={`/cases/${caseItem.id}`}
            className="signal-chip distressed-button distressed-button-neutral px-4 py-2 text-sm font-medium"
          >
            기록 열람
          </GlitchLink>
        </div>
      </div>
    </article>
  );
}
