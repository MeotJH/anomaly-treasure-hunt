import { CaseSummary } from "../../domain/case";
import { CaseCard } from "./case-card";

export function CaseListView({ cases }: { cases: CaseSummary[] }) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Case Archive</p>
        <h2 className="mt-3 text-3xl font-semibold text-zinc-50">All Published Files</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300">
          Review active and archived investigation cases. This view maps directly to the
          case-reader backlog item and keeps discovery separate from the report flow.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {cases.map((caseItem) => (
          <CaseCard key={caseItem.id} caseItem={caseItem} href={`/cases/${caseItem.id}`} />
        ))}
      </div>
    </div>
  );
}

