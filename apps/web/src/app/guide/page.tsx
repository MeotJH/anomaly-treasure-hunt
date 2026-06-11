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

const difficultyDefinitions = [
  {
    grade: "F",
    title: "기초 공개 관측",
    description:
      "공개 동선 안에서 바로 확인 가능한 초입 단계입니다. 장소 단서가 비교적 분명하고, 기본 안내만 지켜도 관측 흐름을 이해할 수 있습니다.",
  },
  {
    grade: "E",
    title: "초급 현장 접근",
    description:
      "기초 장비와 기본 주의만으로 대응 가능한 수준입니다. 사진 대상과 주변 맥락만 정확히 확보하면 검토 가능한 기록으로 분류됩니다.",
  },
  {
    grade: "D",
    title: "표준 조사 단계",
    description:
      "일반 참가자도 도전 가능한 보통 난이도입니다. 단서 조합, 현장 식별, 제출 사진 조건을 함께 맞춰야 합니다.",
  },
  {
    grade: "C",
    title: "중급 반복 판독",
    description:
      "반복 관찰과 비교 판단이 필요한 단계입니다. 사진 주피사체, 위치 맥락, 코드 조건을 더 엄격하게 충족해야 합니다.",
  },
  {
    grade: "B",
    title: "상급 위험 징후",
    description:
      "위험 징후가 뚜렷하게 드러나는 상급 단계입니다. 접근 전에 동선, 중단 기준, 반려 조건을 먼저 이해해야 합니다.",
  },
  {
    grade: "A",
    title: "베테랑 조사 권장",
    description:
      "경험 있는 조사자를 전제로 하는 고위험 단계입니다. 규칙 누락이나 현장 오판이 큰 실패로 이어질 수 있습니다.",
  },
  {
    grade: "S",
    title: "최상위 위험 단계",
    description:
      "규칙을 조금만 어겨도 즉각적인 피해나 회복하기 어려운 결과를 초래할 수 있는 최상위 난이도입니다.",
  },
] as const;

function GuideOrb({ variant }: { variant: "steps" | "evidence" | "reward" | "safety" }) {
  const glyph = {
    steps: (
      <svg viewBox="0 0 64 64" className="h-14 w-14 text-rose-100" fill="none" aria-hidden="true">
        <path d="M18 19h20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M18 31h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.78" />
        <path d="M18 43h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.58" />
        <circle cx="45" cy="21" r="5.5" stroke="currentColor" strokeWidth="2.2" />
        <path d="m42.5 21 1.6 1.6 3.4-3.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    evidence: (
      <svg viewBox="0 0 64 64" className="h-14 w-14 text-rose-100" fill="none" aria-hidden="true">
        <path
          d="M10 32c4.8-7.7 12.5-12 22-12s17.2 4.3 22 12c-4.8 7.7-12.5 12-22 12S14.8 39.7 10 32Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="32" r="8.5" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="32" cy="32" r="3.2" fill="currentColor" />
        <path d="M46.5 20.5 51 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
      </svg>
    ),
    reward: (
      <svg viewBox="0 0 64 64" className="h-14 w-14 text-rose-100" fill="none" aria-hidden="true">
        <path
          d="M20 18h24v8c0 8.1-5.2 15.3-12 18-6.8-2.7-12-9.9-12-18v-8Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M26 24h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
        <path d="m32 28 5 5-5 5-5-5 5-5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    ),
    safety: (
      <svg viewBox="0 0 64 64" className="h-14 w-14 text-rose-100" fill="none" aria-hidden="true">
        <path d="M32 14 50 47H14L32 14Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M32 25v10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="32" cy="40.5" r="1.7" fill="currentColor" />
      </svg>
    ),
  }[variant];

  return (
    <div className="guide-orb">
      <div className="guide-orb-core">
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.16)_0%,rgba(244,63,94,0.08)_28%,transparent_62%)]" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-rose-400/22 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur">
          <div className="absolute inset-[0.45rem] rounded-[1.35rem] border border-rose-300/14" />
          {glyph}
        </div>
      </div>
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
                      <p className="mt-2 text-lg font-semibold text-amber-50">이상현상 접촉 보상권</p>
                      <p className="mt-2 text-xs text-amber-200/70">기록 관리자 검토 후 보상 배정 명부에</p>
                      <p className="mt-2 text-xs text-amber-200/70">편입됩니다.</p>
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

      <section className="guide-difficulty haunted-panel rounded-[2.25rem] border border-rose-500/20 px-5 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-9">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200">
            위험도 기준
          </span>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            <span className="glitch-text" data-text="위험도 세부 정의">
              위험도 세부 정의
            </span>
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-300 sm:text-lg">
            각 사건 문서는 현장 접근성, 단서 해석 난도, 증거 확보 조건, 중단 기준을 함께 반영해 위험도를 구분합니다.
          </p>
        </div>

        <div className="guide-line mt-8" />

        <div className="mt-6 grid gap-3 sm:gap-4">
          {difficultyBands.map((band) => (
            <article
              key={band.title}
              className={`relative overflow-hidden rounded-[1.7rem] border bg-[linear-gradient(135deg,rgba(22,11,14,0.96),rgba(8,9,13,0.98)),radial-gradient(circle_at_left,transparent,transparent)] p-4 sm:p-5 ${band.tone.border} ${band.tone.glow}`}
            >
              <div className={`pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r ${band.tone.panel}`} />
              <div className="grid gap-4 lg:grid-cols-[13rem_1fr] lg:items-center">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                    {band.grades.map((grade) => (
                      <span
                        key={`${grade}-label`}
                        className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-200"
                      >
                        {grade}급
                      </span>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-center text-2xl font-semibold tracking-tight text-zinc-50 sm:text-left sm:text-4xl">
                      {band.title}
                    </h3>
                    <p className={`mt-1.5 text-center text-base font-medium sm:text-left sm:text-xl ${band.tone.accent}`}>
                      {band.subtitle}
                    </p>
                  </div>
                </div>

                <div className="border-l-0 border-white/10 lg:border-l lg:pl-6">
                  <ul className="space-y-3 sm:space-y-4">
                    {band.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-zinc-100 sm:gap-4">
                        <span className={`mt-2.5 h-2 w-2 shrink-0 rounded-full sm:mt-4 sm:h-2.5 sm:w-2.5 ${band.tone.dot}`} />
                        <span className="text-sm leading-6 text-zinc-200 sm:text-lg sm:leading-7">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,11,14,0.92),rgba(7,8,12,0.96))] p-4 sm:p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-rose-300/70">관측 난이도</p>
            <div className="-mx-1 mt-4 flex snap-x gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              {(["F", "E", "D", "C", "B", "A", "S"] as const).map((grade) => (
                <div key={grade} className="shrink-0 snap-start">
                  <DifficultyBadge grade={grade} compact />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))]">
            {difficultyDefinitions.map((item) => (
              <article
                key={item.grade}
                className="rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-4"
              >
                <div className="flex items-center gap-3">
                  <DifficultyBadge grade={item.grade} compact />
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-zinc-400">{item.title}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-3 rounded-[1.4rem] border border-rose-500/16 bg-black/20 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-500/24 bg-rose-500/8 text-base font-semibold text-rose-100 sm:h-14 sm:w-14 sm:text-lg">
                FILE
              </div>
              <div className="min-w-0">
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">사건 예시</p>
                <p className="mt-1 text-xl font-semibold leading-tight text-zinc-50 sm:text-2xl">
                  FILE-001 도시 폐엽 신호 변조
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-300 sm:text-base">
                  {difficultyMeta.F.summary} / {difficultyMeta.E.summary}
                </p>
              </div>
            </div>
            <span className="inline-flex w-full items-center justify-center rounded-full border border-emerald-400/22 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 sm:w-auto">
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
