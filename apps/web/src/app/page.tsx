import { getHomePageData } from "@/modules/home/application/get-home-page-data";
import { CaseCard } from "@/modules/cases/presentation/components/case-card";
import { ArchiveCaseCard } from "@/modules/home/presentation/components/archive-case-card";
import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";

export const dynamic = "force-dynamic";

const firstVisitSteps = [
  {
    no: "01",
    title: "사건 문서 열람",
    description: "공개된 파일에서 반복 문장, 금지 조건, 누락된 지명 조각을 확인합니다.",
  },
  {
    no: "02",
    title: "위치 추리",
    description: "문서 속 단서와 실제 장소의 표식, 구조물, 동선을 대조해 현장을 좁힙니다.",
  },
  {
    no: "03",
    title: "증거 제출",
    description: "조건에 맞는 현장 사진과 식별 코드를 제출하면 운영진이 직접 검토합니다.",
  },
] as const;

export default async function Home() {
  const { currentCase, archivedCases } = await getHomePageData();

  return (
    <div className="space-y-10">
      <section className="haunted-panel rounded-[1.75rem] border border-rose-900/30 bg-[linear-gradient(180deg,rgba(21,11,14,0.92),rgba(9,10,14,0.94))] p-5 sm:p-6">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-rose-300/70">공개 관측 접수소</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            문서를 읽고, 장소를 추리하고, 증거를 제출하세요.
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
            이곳은 위치가 제거된 이상현상 사건 파일을 열람한 뒤 실제 장소를 추리하고, 현장에서 확보한
            사진과 식별 코드를 제출하는 조사형 보상 추첨 기록소입니다. 승인된 제보만 추첨 대상에
            편입됩니다.
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {firstVisitSteps.map((step) => (
            <article
              key={step.no}
              className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <p className="text-xs font-semibold tracking-[0.24em] text-rose-300/70">{step.no}</p>
              <h2 className="mt-2 text-lg font-semibold text-zinc-50">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{step.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <GlitchLink
            href="#active-case"
            className="signal-chip distressed-button distressed-button-danger px-5 py-3 text-sm font-medium"
          >
            첫 사건 열람하기
          </GlitchLink>
          <GlitchLink
            href="/guide"
            className="signal-chip distressed-button distressed-button-neutral px-5 py-3 text-sm font-medium"
          >
            관측 절차 보기
          </GlitchLink>
        </div>
      </section>

      {currentCase ? (
        <section id="active-case" className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">현재 개방 문서</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-50">지금 조사 가능한 이상현상</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
              처음 참여한다면 이 사건부터 열람하세요. 문서를 읽고 위치를 추리한 뒤, 현장 조건에 맞는 사진과
              식별 코드를 제출하면 됩니다.
            </p>
          </div>
          <CaseCard caseItem={currentCase} href={`/cases/${currentCase.id}`} />
        </section>
      ) : null}
      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">종료 기록</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">과거 조사 문서</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
            종료된 사건과 발표 대기 상태의 기록입니다. 현재 공개 사건보다 낮은 우선순위로 탐색할 수 있습니다.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {archivedCases.map((caseItem) => (
            <ArchiveCaseCard key={caseItem.id} caseItem={caseItem} />
          ))}
        </div>
      </section>
    </div>
  );
}
