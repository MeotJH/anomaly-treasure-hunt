import { getHomePageData } from "@/modules/home/application/get-home-page-data";
import { CaseCard } from "@/modules/cases/presentation/components/case-card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { currentCase, archivedCases } = await getHomePageData();

  return (
    <div className="space-y-10">
      <section className="haunted-panel grid gap-6 rounded-[2rem] border border-rose-900/40 bg-[linear-gradient(145deg,rgba(42,13,15,0.88),rgba(10,11,16,0.92))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.35em] text-rose-300/75">실시간 감시</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-50">
            <span className="glitch-text" data-text="이상현상 추적 관제판">
              이상현상 추적 관제판
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
            참여자는 퀴즈 풀이자가 아니라 현장 조사자입니다. 기록 문서를 읽고 실제
            위치를 추적한 뒤, 식별 코드와 현장 증거를 제출해 이상현상의 실체를
            확인합니다.
          </p>
        </div>
        <div className="relative z-10 rounded-3xl border border-rose-950/50 bg-black/30 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">감시 메모</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
            <li>사건 열람, 단서 추적, 현장 제보까지 MVP 흐름을 한 화면군으로 구성</li>
            <li>프론트는 Next.js, 백엔드는 Nest.js 기반 TypeScript 워크스페이스</li>
            <li>레이어 분리: 표현, 애플리케이션, 도메인, 인프라 구조 유지</li>
            <li>이후 인증, 저장소, 외부 연동은 인프라 계층만 교체하면 확장 가능</li>
          </ul>
        </div>
      </section>

      {currentCase ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">현재 개방 문서</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-50">지금 조사 가능한 이상현상</h2>
          </div>
          <CaseCard caseItem={currentCase} href={`/cases/${currentCase.id}`} />
        </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">봉인 기록</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">과거 조사 문서</h2>
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
