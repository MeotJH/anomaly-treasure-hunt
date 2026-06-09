import { getHomePageData } from "@/modules/home/application/get-home-page-data";
import { CaseCard } from "@/modules/cases/presentation/components/case-card";
import { ArchiveCaseCard } from "@/modules/home/presentation/components/archive-case-card";
import { HomeHero } from "@/modules/home/presentation/components/home-hero";
import { ParticipationSteps } from "@/modules/home/presentation/components/participation-steps";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { currentCase, archivedCases } = await getHomePageData();

  return (
    <div className="space-y-10">
      <HomeHero />

      {currentCase ? (
        <section id="active-case" className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">현재 개방 문서</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-50">지금 조사 가능한 이상현상</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
              지금 바로 참여 가능한 대표 사건입니다. 문서를 읽고 장소를 추리한 뒤, 현장에서 확보한 증거를
              제출하세요.
            </p>
          </div>
          <CaseCard caseItem={currentCase} href={`/cases/${currentCase.id}`} />
        </section>
      ) : null}

      <ParticipationSteps />

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

      <section className="haunted-panel rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(16,11,14,0.94),rgba(8,10,14,0.92))] p-6">
        <details className="group relative z-10">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">운영 지침</p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-50">이 사이트는 무엇을 하는 곳인가요?</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 transition group-open:rotate-180">
              펼치기
            </span>
          </summary>
          <div className="mt-5 grid gap-4 text-sm leading-7 text-zinc-300 lg:grid-cols-3">
            <div className="rounded-[1.25rem] border border-white/8 bg-black/15 p-4">
              <h3 className="font-semibold text-zinc-100">관측 절차</h3>
              <p className="mt-2">
                사건 문서를 읽고 단서를 추적한 뒤, 실제 장소를 특정해 현장 증거를 확보합니다.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/8 bg-black/15 p-4">
              <h3 className="font-semibold text-zinc-100">증거 기준</h3>
              <p className="mt-2">
                장소를 식별할 수 있는 표식, 구조물, 안내판이 포함된 사진과 식별 코드가 필요합니다.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/8 bg-black/15 p-4">
              <h3 className="font-semibold text-zinc-100">검토 방식</h3>
              <p className="mt-2">
                모든 제보는 수동 검토를 거치며, 승인된 제보만 추첨 대상에 포함됩니다.
              </p>
            </div>
          </div>
        </details>
      </section>
    </div>
  );
}
