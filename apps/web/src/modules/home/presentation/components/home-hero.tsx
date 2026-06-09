import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";

export function HomeHero() {
  return (
    <section className="haunted-panel relative overflow-hidden rounded-[2rem] border border-rose-900/40 bg-[linear-gradient(135deg,rgba(40,12,16,0.96),rgba(10,11,16,0.94))] px-6 py-8 shadow-[0_35px_90px_rgba(0,0,0,0.38)] sm:px-8 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,132,132,0.18),transparent_18%),radial-gradient(circle_at_78%_20%,rgba(103,232,249,0.12),transparent_16%),linear-gradient(120deg,rgba(16,24,22,0.5),transparent_35%,rgba(30,8,12,0.58)_100%)]" />
      <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_20%,rgba(0,0,0,0.3)_100%),radial-gradient(circle_at_60%_35%,rgba(190,24,93,0.26),transparent_22%),radial-gradient(circle_at_32%_58%,rgba(45,212,191,0.18),transparent_20%),linear-gradient(145deg,#233036_0%,#10141b_46%,#241418_100%)] lg:block" />
      <div className="relative z-10 max-w-3xl">
        <p className="signal-chip inline-flex rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.4em] text-rose-300/80">
          감시 기록 보관
        </p>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
          <span className="glitch-text" data-text="이상현상 추적 기록 보관소">
            이상현상 추적 기록 보관소
          </span>
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
          도시 곳곳의 이상 징후를 추적하고, 공개된 사건 문서를 읽어 실제 장소를 추리한 뒤 현장에서 확보한
          증거를 제출하세요.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
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
      </div>
    </section>
  );
}
