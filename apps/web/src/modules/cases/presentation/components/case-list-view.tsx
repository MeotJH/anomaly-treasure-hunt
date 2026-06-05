import { CaseSummary } from "../../domain/case";
import { CaseCard } from "./case-card";

export function CaseListView({ cases }: { cases: CaseSummary[] }) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(145deg,rgba(32,11,14,0.88),rgba(10,11,16,0.92))] p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">기록 보관 구역</p>
        <h2 className="mt-3 text-3xl font-semibold text-zinc-50">
          <span className="glitch-text" data-text="공개된 이상현상 문서">
            공개된 이상현상 문서
          </span>
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300">
          현재 공개 중인 사건과 종료된 사건을 한곳에서 확인할 수 있습니다. 현장 제보
          전에 먼저 문서를 읽고, 단서와 촬영 조건을 비교해 조사 대상을 좁히는 용도입니다.
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
