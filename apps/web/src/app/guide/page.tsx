import { difficultyMeta } from "@/modules/cases/domain/difficulty";
import { DifficultyBadge } from "@/modules/cases/presentation/components/difficulty-badge";
import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";

const participationGuide = [
  {
    sectionNo: "01",
    title: "참여 방법",
    icon: "steps",
    items: [
      {
        index: "1",
        title: "사건 문서 열람",
        description: "현재 조사 가능한 이상현상 문서를 확인하고 반복 문장, 단서, 누락된 이름을 먼저 정리합니다.",
      },
      {
        index: "2",
        title: "장소 추리",
        description: "문서의 단서와 제보 정보를 바탕으로 실제 장소를 좁혀가며 표식과 구조물을 대조합니다.",
      },
      {
        index: "3",
        title: "현장 증거 제출",
        description: "추정 장소에서 확보한 사진과 식별 코드를 제출하면 운영진 수동 검토가 진행됩니다.",
      },
    ],
  },
  {
    sectionNo: "02",
    title: "증거 기준",
    icon: "evidence",
    items: [
      {
        index: "✓",
        title: "장소명 표식 확인",
        description: "건물명, 시설명, 도로명 등 실제 위치를 식별할 수 있는 표식이 드러나야 합니다.",
      },
      {
        index: "✓",
        title: "안내판 또는 구조물 식별",
        description: "안내판, 입구, 기둥, 벽면, 조형물처럼 특정 장소를 가리키는 구조가 보여야 합니다.",
      },
      {
        index: "×",
        title: "흐린 사진 반려 가능",
        description: "지나치게 흔들리거나 식별이 불가능한 사진은 반려될 수 있습니다.",
      },
    ],
  },
  {
    sectionNo: "03",
    title: "보상 및 검토",
    icon: "reward",
    items: [
      {
        index: "✓",
        title: "수동 검토 후 승인",
        description: "제출된 증거는 운영진이 직접 검토하며, 자동 판정으로 승인되지 않습니다.",
      },
      {
        index: "✓",
        title: "중복 제보 확인",
        description: "동일 사건에 대한 중복 제보는 별도 확인 절차를 거치며 추가 보상이 보장되지 않습니다.",
      },
      {
        index: "✓",
        title: "승인 시 추첨 대상 포함",
        description: "운영진 승인 후 추첨 대상에 포함됩니다.",
      },
    ],
  },
  {
    sectionNo: "04",
    title: "안전 수칙",
    icon: "safety",
    items: [
      {
        index: "!",
        title: "출입금지 구역 접근 금지",
        description: "통제 구역, 위험 시설, 사유지는 조사 대상이라도 접근하지 마세요.",
      },
      {
        index: "!",
        title: "야간 무리한 이동 지양",
        description: "안전한 시간대에 조사하고 혼자 이동하지 마세요.",
      },
      {
        index: "!",
        title: "개인정보 노출 주의",
        description: "타인의 얼굴, 차량 번호, 개인 정보가 포함된 사진은 제출하지 마세요.",
      },
    ],
  },
] as const;

const difficultyBands = [
  {
    title: "낮음",
    subtitle: "초보 조사자 추천",
    grades: ["F", "E"] as const,
    bullets: ["유명 장소 중심", "단서가 직접적임", "초보 조사자 추천"],
    tone: {
      border: "border-emerald-500/30",
      glow: "shadow-[0_0_40px_rgba(52,211,153,0.12)]",
      accent: "text-emerald-300",
      dot: "bg-emerald-300",
      panel: "from-emerald-500/14 via-black/0 to-black/0",
      radar: "guide-radar-low",
    },
  },
  {
    title: "보통",
    subtitle: "숙련도 중급 이상",
    grades: ["D", "C"] as const,
    bullets: ["단서 조합 필요", "구도 탐색 필요", "현장 확인 권장"],
    tone: {
      border: "border-amber-500/30",
      glow: "shadow-[0_0_40px_rgba(251,191,36,0.1)]",
      accent: "text-amber-300",
      dot: "bg-amber-300",
      panel: "from-amber-500/14 via-black/0 to-black/0",
      radar: "guide-radar-medium",
    },
  },
  {
    title: "높음",
    subtitle: "숙련자 전용",
    grades: ["B", "A", "S"] as const,
    bullets: ["지역 지식 필요", "증거 조건 까다로움", "복수 단서 해석"],
    tone: {
      border: "border-rose-500/30",
      glow: "shadow-[0_0_40px_rgba(244,63,94,0.1)]",
      accent: "text-rose-300",
      dot: "bg-rose-300",
      panel: "from-rose-500/14 via-black/0 to-black/0",
      radar: "guide-radar-high",
    },
  },
] as const;

function GuideOrb({ variant }: { variant: "steps" | "evidence" | "reward" | "safety" }) {
  const glyph = {
    steps: (
      <div className="relative h-16 w-16">
        <div className="absolute inset-3 rounded-xl border border-rose-300/55" />
        <div className="absolute left-5 top-6 h-1 w-6 bg-rose-200/80" />
        <div className="absolute left-5 top-9 h-1 w-5 bg-rose-200/60" />
        <div className="absolute right-4 top-8 h-5 w-5 rounded-full border border-rose-300/80" />
      </div>
    ),
    evidence: (
      <div className="relative h-16 w-16">
        <div className="absolute inset-4 rounded-lg border border-rose-300/55" />
        <div className="absolute left-7 top-3 h-10 w-10 rounded-full border border-rose-300/80" />
        <div className="absolute left-12 top-8 h-px w-7 bg-rose-200/80" />
        <div className="absolute left-[1.9rem] top-[1.55rem] h-3.5 w-3.5 rounded-full border border-rose-300/80" />
      </div>
    ),
    reward: (
      <div className="relative h-16 w-16">
        <div className="absolute inset-x-5 top-4 h-9 rounded-t-[1rem] border border-b-0 border-rose-300/70" />
        <div className="absolute inset-x-4 top-6 h-8 rounded-b-[1rem] border border-rose-300/70" />
        <div className="absolute left-1/2 top-8 h-3 w-3 -translate-x-1/2 rotate-45 border border-rose-200/80" />
      </div>
    ),
    safety: (
      <div className="relative h-16 w-16">
        <div className="absolute left-1/2 top-3 h-0 w-0 -translate-x-1/2 border-l-[22px] border-r-[22px] border-b-[38px] border-l-transparent border-r-transparent border-b-rose-300/15" />
        <div className="absolute left-1/2 top-4 h-0 w-0 -translate-x-1/2 border-l-[18px] border-r-[18px] border-b-[32px] border-l-transparent border-r-transparent border-b-transparent outline outline-1 outline-rose-300/70" />
        <div className="absolute left-1/2 top-8 h-4 w-1 -translate-x-1/2 rounded-full bg-rose-200/90" />
        <div className="absolute left-1/2 top-[2.8rem] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-rose-200/90" />
      </div>
    ),
  }[variant];

  return (
    <div className="guide-orb">
      <div className="guide-orb-core">{glyph}</div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="space-y-8">
      <section className="guide-hero haunted-panel rounded-[2.25rem] border border-rose-500/20 px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="guide-rec">REC</div>
        <div className="guide-crosshair hidden lg:block" />
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="relative z-10">
            <span className="inline-flex rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200">
              신규 조사자 안내
            </span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl">
              <span className="glitch-text" data-text="관측 안내">
                관측 안내
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300 sm:text-xl">
              처음 참여한다면 아래 절차와 증거 기준을 먼저 확인하세요.
            </p>
          </div>

          <div className="relative z-10 min-h-[240px]">
            <div className="guide-dossier">
              <div className="guide-dossier-ring" />
              <div className="guide-dossier-card">
                <p className="text-sm uppercase tracking-[0.22em] text-amber-100/55">Anomaly Dossier</p>
                <div className="mt-4 grid grid-cols-[1fr_5.25rem] gap-3">
                  <div>
                    <div className="h-3 w-28 rounded-full bg-white/8" />
                    <div className="mt-2 h-2 w-20 rounded-full bg-white/6" />
                    <div className="mt-7 rounded-2xl border border-rose-500/25 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-rose-200/60">Reward Record</p>
                      <p className="mt-2 text-lg font-semibold text-amber-50">치킨 기프티콘 추첨권</p>
                      <p className="mt-2 text-xs text-amber-200/70">운영진 승인 후 추첨 대상에 포함됩니다.</p>
                    </div>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-black/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="guide-divider mt-8">
          <div className="guide-divider-eye" />
        </div>
      </section>

      <section className="space-y-4">
        {participationGuide.map((block) => (
          <article
            key={block.title}
            className="haunted-panel rounded-[2rem] border border-rose-500/18 bg-[linear-gradient(180deg,rgba(30,10,13,0.92),rgba(7,8,12,0.96))] p-4 sm:p-5 lg:p-6"
          >
            <div className="grid gap-5 lg:grid-cols-[17rem_1fr]">
              <div className="border-b border-rose-500/12 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
                <p className="text-lg font-semibold tracking-[0.18em] text-rose-300/80">{block.sectionNo}</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-50">{block.title}</h2>
                <div className="mt-6">
                  <GuideOrb variant={block.icon} />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                {block.items.map((item, index) => (
                  <div
                    key={item.title}
                    className={`${index === 0 ? "" : "border-t border-dashed border-rose-500/18"} flex gap-4 py-4 sm:gap-5 sm:py-5`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rose-400/28 bg-white/[0.03] text-lg font-semibold text-zinc-100">
                      {item.index}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-zinc-50">{item.title}</h3>
                      <p className="mt-2 text-base leading-7 text-zinc-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="guide-difficulty haunted-panel rounded-[2.25rem] border border-rose-500/20 px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200">
            관측 기준
          </span>
          <h2 className="mt-6 text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl">
            <span className="glitch-text" data-text="관측 난이도">
              관측 난이도
            </span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-300 sm:text-xl">
            난이도는 단서 해석의 복잡도, 현장 접근성, 증거 확보의 어려움을 종합해 산정됩니다.
          </p>
        </div>

        <div className="guide-line mt-8" />

        <div className="mt-7 grid gap-5">
          {difficultyBands.map((band) => (
            <article
              key={band.title}
              className={`relative overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,rgba(22,11,14,0.96),rgba(8,9,13,0.98)),radial-gradient(circle_at_left,transparent,transparent)] p-5 sm:p-6 ${band.tone.border} ${band.tone.glow}`}
            >
              <div className={`pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r ${band.tone.panel}`} />
              <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:items-center">
                <div className="flex items-center gap-5">
                  <div className={`guide-radar ${band.tone.radar}`} />
                  <div>
                    <h3 className="text-5xl font-semibold tracking-tight text-zinc-50">{band.title}</h3>
                    <p className={`mt-2 text-2xl font-medium ${band.tone.accent}`}>{band.subtitle}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {band.grades.map((grade) => (
                        <DifficultyBadge key={grade} grade={grade} compact />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-l-0 border-white/10 lg:border-l lg:pl-8">
                  <ul className="space-y-4">
                    {band.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-4 text-2xl text-zinc-100 sm:text-[2rem]">
                        <span className={`mt-4 h-2.5 w-2.5 shrink-0 rounded-full ${band.tone.dot}`} />
                        <span className="text-xl leading-8 text-zinc-200 sm:text-2xl">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,11,14,0.92),rgba(7,8,12,0.96))] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-rose-300/70">위험도 세부 정의</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["F", "E", "D", "C", "B", "A", "S"] as const).map((grade) => (
                  <DifficultyBadge key={grade} grade={grade} compact />
                ))}
              </div>
            </div>
            <div className="max-w-2xl text-sm leading-7 text-zinc-300">
              <p>
                `F ~ E급`은 비교적 안전하거나 초보자가 다룰 수 있는 수준입니다. `D ~ C급`은 일반적인 탐사
                대상이 되는 보통 난이도입니다. `B ~ A급`은 치명적인 위협이 도사리고 있어 베테랑 탐사자가
                요구됩니다. `S급`은 규칙을 조금만 어겨도 즉각적인 사망이나 끔찍한 결과를 초래할 수 있는 최상위
                난이도입니다.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 rounded-[1.4rem] border border-rose-500/16 bg-black/20 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/24 bg-rose-500/8 text-lg font-semibold text-rose-100">
                FILE
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">사건 예시</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-50">FILE-001 도시 폐엽 신호 변조</p>
                <p className="mt-1 text-base text-emerald-300">
                  {difficultyMeta.F.summary} / {difficultyMeta.E.summary}
                </p>
              </div>
            </div>
            <span className="inline-flex rounded-full border border-emerald-400/22 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200">
              초보 조사자 적합
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-rose-500/16 bg-[linear-gradient(180deg,rgba(26,11,14,0.92),rgba(8,9,13,0.96))] p-5 text-sm leading-7 text-zinc-300 sm:px-6">
        모든 제보는 운영진이 신중히 검토하며, 허위 정보나 조작된 증거는 제재될 수 있습니다.
      </section>

      <div className="flex flex-wrap gap-3">
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
    </div>
  );
}
