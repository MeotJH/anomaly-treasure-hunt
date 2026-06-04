import Link from "next/link";
import { CaseSummary } from "../../domain/case";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";

export function CaseCard({ caseItem, href }: { caseItem: CaseSummary; href: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{caseItem.fileNo}</p>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-50">{caseItem.title}</h2>
        </div>
        <StatusBadge label={caseItem.status} />
      </div>
      <p className="mt-4 text-sm leading-7 text-zinc-300">{caseItem.summary}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-xs text-zinc-400">
        <span>보상: {caseItem.rewardName}</span>
        <span>등급: {caseItem.accessLevel}</span>
      </div>
      <div className="mt-6">
        <Link
          href={href}
          className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-100 hover:border-emerald-300/60"
        >
          기록 열람
        </Link>
      </div>
    </article>
  );
}

