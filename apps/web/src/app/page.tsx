import { getHomePageData } from "@/modules/home/application/get-home-page-data";
import { CaseCard } from "@/modules/cases/presentation/components/case-card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { currentCase, archivedCases } = await getHomePageData();

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">
            Current Investigation
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-50">
            도시 이상현상 조사형 보물찾기 MVP
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
            사용자는 단순한 퀴즈 참여자가 아니라 조사원입니다. 사건 기록을 읽고
            현장을 추론한 뒤, 식별 코드와 증거 사진을 보고하는 흐름을 중심으로
            FE/BE 구조를 분리했습니다.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">MVP Notes</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
            <li>Next.js App Router + Nest.js 기반 TypeScript 워크스페이스</li>
            <li>Layered Architecture: presentation / application / domain / infrastructure</li>
            <li>현재는 데모 헤더 기반 인증 컨텍스트와 인메모리 저장소를 사용</li>
            <li>다음 단계에서 Supabase/Auth/Storage 교체가 가능하도록 경계 분리</li>
          </ul>
        </div>
      </section>

      {currentCase ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">New File</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-50">이번 주 공개 기록</h2>
          </div>
          <CaseCard caseItem={currentCase} href={`/cases/${currentCase.id}`} />
        </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Archive</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">보관 기록</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {archivedCases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} href={`/cases/${caseItem.id}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
