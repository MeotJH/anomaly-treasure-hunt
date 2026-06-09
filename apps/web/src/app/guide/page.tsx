import { difficultyMeta, type DifficultyGrade } from "@/modules/cases/domain/difficulty";
import { DifficultyBadge } from "@/modules/cases/presentation/components/difficulty-badge";
import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";

const grades: DifficultyGrade[] = ["F", "E", "D", "C", "B", "A", "S"];

const participationSteps = [
  {
    title: "사건 문서 열람",
    description: "공개된 사건 파일을 읽고 반복 문장, 누락된 이름, 현장 단서를 먼저 정리합니다.",
  },
  {
    title: "장소 추리",
    description: "안내판, 표식, 구조물, 입구 형태처럼 장소를 특정할 수 있는 요소로 위치를 좁힙니다.",
  },
  {
    title: "증거 제출",
    description: "현장 사진과 식별 코드를 제출하면 운영진 수동 검토 후 기록이 승인 또는 반려됩니다.",
  },
] as const;

export default function GuidePage() {
  return (
    <div className="space-y-8">
      <section className="haunted-panel rounded-[2rem] border border-rose-900/40 bg-[linear-gradient(145deg,rgba(37,12,16,0.9),rgba(10,11,16,0.94))] p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-rose-300/75">관측 안내</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-50">
          <span className="glitch-text" data-text="이 사이트는 어떻게 참여하나요?">
            이 사이트는 어떻게 참여하나요?
          </span>
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-300">
          이 보관소는 사건 문서를 읽고 실제 장소를 추정한 뒤, 현장에서 확보한 증거를 제출해 이상현상 기록을
          복원하는 조사형 참여 사이트입니다. 승인된 제보만 추첨 대상에 포함됩니다.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <GlitchLink
            href="/"
            className="signal-chip distressed-button distressed-button-danger px-5 py-3 text-sm font-medium"
          >
            메인으로 돌아가기
          </GlitchLink>
          <GlitchLink
            href="/cases"
            className="signal-chip distressed-button distressed-button-neutral px-5 py-3 text-sm font-medium"
          >
            공개 사건 보기
          </GlitchLink>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">참여 절차</p>
          <h3 className="mt-2 text-2xl font-semibold text-zinc-50">참여 흐름</h3>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {participationSteps.map((step, index) => (
            <article
              key={step.title}
              className="haunted-panel rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(17,11,14,0.94),rgba(9,10,14,0.92))] p-5"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-zinc-500">{`0${index + 1}`}</p>
              <h4 className="mt-3 text-lg font-semibold text-zinc-50">{step.title}</h4>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">위험도 등급</p>
          <h3 className="mt-2 text-2xl font-semibold text-zinc-50">괴담(어둠) 위험도 등급</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400">
            사건 파일마다 위험도 등급이 표기됩니다. 낮은 등급은 비교적 안전하지만, 높은 등급은 규칙 위반 시
            치명적인 결과를 초래할 수 있습니다.
          </p>
        </div>
        <div className="grid gap-4">
          {grades.map((grade) => {
            const meta = difficultyMeta[grade];
            return (
              <article
                key={grade}
                className="haunted-panel rounded-[1.35rem] border border-white/8 bg-[linear-gradient(180deg,rgba(16,11,14,0.94),rgba(8,10,14,0.92))] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <DifficultyBadge grade={grade} />
                    <p className="mt-3 text-lg font-semibold text-zinc-50">{meta.summary}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="rounded-[1.5rem] border border-white/8 bg-black/15 p-5 text-sm leading-7 text-zinc-300">
          <p>
            `F ~ E급`은 비교적 안전하거나 초보자가 다룰 수 있는 수준입니다. `D ~ C급`은 일반적인 탐사 대상이
            되는 보통 난이도입니다. `B ~ A급`은 치명적인 위협이 도사리고 있어 베테랑 탐사자가 요구됩니다.
            `S급`은 규칙을 조금만 어겨도 즉각적인 사망이나 끔찍한 결과를 초래할 수 있는 최상위 난이도입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
