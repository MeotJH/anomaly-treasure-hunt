import Link from "next/link";
import { CaseSummary } from "../../domain/case";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";

export function CaseCard({ caseItem, href }: { caseItem: CaseSummary; href: string }) {
  return (
    <article className="haunted-panel rounded-3xl border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-6 shadow-2xl shadow-black/30 backdrop-blur">
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
      <div className="relative z-10 mt-5 flex flex-wrap gap-3 text-xs text-zinc-400">
        <span>보상 기록: {caseItem.rewardName}</span>
        <span>열람 등급: {caseItem.accessLevel}</span>
      </div>
      <div className="relative z-10 mt-6">
        <Link
          href={href}
          className="signal-chip distressed-button distressed-button-danger px-4 py-2 text-sm font-medium"
        >
          기록 열람
        </Link>
      </div>
    </article>
  );
}
