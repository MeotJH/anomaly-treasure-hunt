import { getHomePageData } from "@/modules/home/application/get-home-page-data";
import { CaseCard } from "@/modules/cases/presentation/components/case-card";
import { ArchiveCaseCard } from "@/modules/home/presentation/components/archive-case-card";
import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { currentCase, archivedCases } = await getHomePageData();

  return (
    <div className="space-y-10">
      <section className="haunted-panel rounded-[1.75rem] border border-rose-900/30 bg-[linear-gradient(180deg,rgba(21,11,14,0.92),rgba(9,10,14,0.94))] p-5">
        <p className="max-w-3xl text-sm leading-7 text-zinc-300">
          공개 문서는 위치가 제거된 이상현상 사건 기록이다. 단서와 누락 정보를 대조해 실제 장소를 추정한다. 현장 사진과 식별 코드가 확보되면 제보 기록이 성립한다
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <GlitchLink
            href="#active-case"
            className="signal-chip distressed-button distressed-button-danger px-5 py-3 text-sm font-medium"
          >
            공개 사건 보기
          </GlitchLink>
          <GlitchLink
            href="/guide"
            className="signal-chip distressed-button distressed-button-neutral px-5 py-3 text-sm font-medium"
          >
            관측 안내
          </GlitchLink>
        </div>
      </section>

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
