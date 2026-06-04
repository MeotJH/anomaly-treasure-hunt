import Link from "next/link";
import { ReactNode } from "react";
import { CaseDetail } from "../../domain/case";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-400">{title}</h3>
      <div className="mt-4 text-sm leading-7 text-zinc-200">{children}</div>
    </section>
  );
}

export function CaseDetailView({ caseDetail }: { caseDetail: CaseDetail }) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{caseDetail.fileNo}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-50">
              {caseDetail.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
              {caseDetail.summary}
            </p>
          </div>
          <StatusBadge label={caseDetail.status} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-400">
          <span>보상: {caseDetail.rewardName}</span>
          <span>등급: {caseDetail.accessLevel}</span>
        </div>
        <div className="mt-8">
          <Link
            href={`/cases/${caseDetail.id}/report`}
            className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 font-medium text-emerald-50 hover:border-emerald-300/60"
          >
            현장 보고 시작
          </Link>
        </div>
      </section>

      <Block title="Observation Report">{caseDetail.reportBody}</Block>

      <Block title="Clues">
        <ol className="space-y-4">
          {caseDetail.clues.map((clue) => (
            <li key={clue.order} className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Clue {clue.order}
              </p>
              <p className="mt-2 font-medium text-zinc-100">{clue.title}</p>
              <p className="mt-2 text-zinc-300">{clue.content}</p>
            </li>
          ))}
        </ol>
      </Block>

      <div className="grid gap-6 lg:grid-cols-2">
        <Block title="Mission Instruction">{caseDetail.mission.instruction}</Block>
        <Block title="Photo Requirement">{caseDetail.mission.photoRequirement}</Block>
      </div>

      <Block title="Safety Notice">{caseDetail.safetyNotice}</Block>
    </div>
  );
}
