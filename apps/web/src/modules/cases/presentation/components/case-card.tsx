import { CaseSummary } from "../../domain/case";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";
import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";
import { CaseThumbnail } from "./case-thumbnail";
import { DifficultyBadge } from "./difficulty-badge";

export function CaseCard({ caseItem, href }: { caseItem: CaseSummary; href: string }) {
  return (
    <article className="haunted-panel rounded-3xl border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-6 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="relative z-10 mb-5">
        <CaseThumbnail caseItem={caseItem} />
      </div>
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{caseItem.fileNo}</p>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-50">
            <span className="glitch-text" data-text={caseItem.title}>
              {caseItem.title}
            </span>
          </h2>
        </div>
        <StatusBadge label={caseItem.status} />
      </div>
      <p className="relative z-10 mt-4 text-sm leading-7 text-zinc-300">{caseItem.summary}</p>
      <div className="relative z-10 mt-6 space-y-3">
        <div className="reward-record signal-chip">
          <p className="reward-record-label">REWARD RECORD</p>
          <p className="reward-record-name" data-text={caseItem.rewardName}>
            {caseItem.rewardName}
          </p>
          <p className="reward-record-note">운영진 승인 후 추첨 대상에 포함됩니다.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
          <DifficultyBadge grade={caseItem.difficultyGrade} compact />
          <span className="inline-flex rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">
            열람 등급: {caseItem.accessLevel}
          </span>
        </div>
      </div>
      <div className="relative z-10 mt-6">
        <GlitchLink
          href={href}
          className="signal-chip distressed-button distressed-button-danger px-4 py-2 text-sm font-medium"
        >
          기록 열람
        </GlitchLink>
      </div>
    </article>
  );
}
