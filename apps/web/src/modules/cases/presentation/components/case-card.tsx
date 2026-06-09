import { CaseSummary } from "../../domain/case";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";
import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";
import { CaseThumbnail } from "./case-thumbnail";
import { DifficultyBadge } from "./difficulty-badge";

export function CaseCard({ caseItem, href }: { caseItem: CaseSummary; href: string }) {
  return (
    <article className="haunted-panel overflow-hidden rounded-[2rem] border border-rose-400/18 bg-[linear-gradient(180deg,rgba(26,11,15,0.96),rgba(10,11,15,0.96))] p-4 shadow-2xl shadow-black/35 backdrop-blur sm:p-5 lg:grid lg:grid-cols-[24rem_1fr] lg:gap-0">
      <CaseThumbnail caseItem={caseItem} />
      <div className="relative z-10 rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,rgba(13,11,15,0.8),rgba(8,10,14,0.9))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] lg:ml-4 lg:flex lg:min-h-full lg:items-stretch lg:rounded-[1.6rem]">
        <div className="flex h-full flex-1 flex-col justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
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
            <p className="mt-4 text-sm leading-7 text-zinc-300">{caseItem.summary}</p>
          </div>

          <div className="space-y-3">
            <div className="reward-record signal-chip">
              <p className="reward-record-label">REWARD RECORD</p>
              <p className="reward-record-name" data-text={caseItem.rewardName}>
                {caseItem.rewardName}
              </p>
              <p className="reward-record-note">운영진 승인 후 추첨 대상에 포함됩니다.</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-3">
              <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
                <DifficultyBadge grade={caseItem.difficultyGrade} compact />
                <span className="inline-flex rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">
                  열람 등급: {caseItem.accessLevel}
                </span>
              </div>
              <GlitchLink
                href={href}
                className="signal-chip distressed-button distressed-button-danger px-4 py-2 text-sm font-medium"
              >
                기록 열람
              </GlitchLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
