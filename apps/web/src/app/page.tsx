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
            이 보관소는 도시 곳곳에 남은 비정상 흔적을 수집하는 공개 관측망입니다. 문서를 읽고,
            단서를 해석한 뒤, 현장에서 확보한 증거를 제출해 기록되지 않은 실체를 복원합니다.
          </p>
        </div>
        <div className="relative z-10 rounded-3xl border border-rose-950/50 bg-black/30 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">관측 지침</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
            <li>공개된 사건 문서를 먼저 읽고, 반복되는 문장과 누락된 이름을 단서로 사용합니다.</li>
            <li>현장을 추정했다면 표식, 안내판, 입구 구조물처럼 장소를 식별할 수 있는 증거를 확보합니다.</li>
            <li>제출된 사진과 식별 코드는 수동 검토를 거쳐 보존 기록 또는 반려 기록으로 분류됩니다.</li>
            <li>승인된 보고서는 추첨 대상에 편입되며, 동일 사건에 대한 중복 제보는 별도 확인 절차를 거칩니다.</li>
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
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">종료 기록</p>
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
