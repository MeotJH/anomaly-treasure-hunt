import { ReactNode } from "react";
import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";
import { CaseDetail } from "../../domain/case";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="haunted-panel rounded-3xl border border-rose-950/40 bg-[linear-gradient(180deg,rgba(18,10,13,0.92),rgba(10,11,15,0.9))] p-6">
      <div className="relative z-10">
        <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-400">{title}</h3>
        <div className="mt-4 text-sm leading-7 text-zinc-200">{children}</div>
      </div>
    </section>
  );
}

export function CaseDetailView({ caseDetail }: { caseDetail: CaseDetail }) {
  return (
    <div className="space-y-6">
      <section className="haunted-panel rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(145deg,rgba(36,12,16,0.88),rgba(10,11,16,0.92))] p-8">
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{caseDetail.fileNo}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-50">
              <span className="glitch-text" data-text={caseDetail.title}>
                {caseDetail.title}
              </span>
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">{caseDetail.summary}</p>
          </div>
          <StatusBadge label={caseDetail.status} />
        </div>
        <div className="relative z-10 mt-8 flex flex-wrap gap-3 text-sm text-zinc-400">
          <span>보상 기록: {caseDetail.rewardName}</span>
          <span>열람 등급: {caseDetail.accessLevel}</span>
        </div>
        <div className="relative z-10 mt-8">
          <GlitchLink
            href={`/cases/${caseDetail.id}/report`}
            className="signal-chip distressed-button distressed-button-danger px-5 py-3 font-medium"
          >
            현장 보고 시작
          </GlitchLink>
        </div>
      </section>

      <Block title="이상 관측 보고서">
        <div className="whitespace-pre-line">{caseDetail.reportBody}</div>
      </Block>

      <Block title="수집된 단서">
        <ol className="space-y-4">
          {caseDetail.clues.map((clue) => (
            <li key={clue.order} className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">단서 {clue.order}</p>
              <p className="mt-2 font-medium text-zinc-100">{clue.title}</p>
              <p className="mt-2 text-zinc-300">{clue.content}</p>
            </li>
          ))}
        </ol>
      </Block>

      <div className="grid gap-6 lg:grid-cols-2">
        <Block title="조사 지시">{caseDetail.mission.instruction}</Block>
        <Block title="증거 촬영 조건">{caseDetail.mission.photoRequirement}</Block>
      </div>

      <Block title="안전 수칙">
        <div className="space-y-4">
          <p>{caseDetail.safetyNotice}</p>
          <p className="text-zinc-400">{caseDetail.mission.caution}</p>
        </div>
      </Block>
    </div>
  );
}
