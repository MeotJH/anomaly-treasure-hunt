import { getAuthContext } from "@/lib/auth";
import { AuthControls } from "@/modules/auth/presentation/components/auth-controls";
import { GlitchLink } from "@/modules/shared/presentation/components/glitch-link";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/";
  const auth = await getAuthContext();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="haunted-panel rounded-[2rem] border border-rose-900/40 bg-[linear-gradient(145deg,rgba(42,13,15,0.88),rgba(10,11,16,0.92))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <p className="text-xs uppercase tracking-[0.35em] text-rose-300/75">Access Gate</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-50">
          <span className="glitch-text" data-text="로그인 구역 진입">
            로그인 구역 진입
          </span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
          비인가 관측자는 제출 기록과 회수된 보고서에 접근할 수 없습니다. 신원 확인이 끝나면
          차단된 구역이 다시 열립니다.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Sign In</p>
          <div className="mt-4">
            <AuthControls
              userEmail={auth.email}
              isAdmin={auth.isAdmin}
              nextPath={next}
              align="start"
            />
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/10 bg-black/20 p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Routes</p>
          <div className="mt-4 space-y-3">
            <GlitchLink
              href="/"
              className="menu-glitch-link haunted-panel block rounded-3xl border border-white/10 bg-black/25 px-5 py-4 text-zinc-100"
            >
              <span className="block text-xs uppercase tracking-[0.28em] text-zinc-500">route</span>
              <span className="mt-2 block text-lg font-semibold">감시 현황으로 복귀</span>
            </GlitchLink>
            <GlitchLink
              href="/cases"
              className="menu-glitch-link haunted-panel block rounded-3xl border border-white/10 bg-black/25 px-5 py-4 text-zinc-100"
            >
              <span className="block text-xs uppercase tracking-[0.28em] text-zinc-500">route</span>
              <span className="mt-2 block text-lg font-semibold">이상 기록 다시 보기</span>
            </GlitchLink>
          </div>
        </aside>
      </section>
    </div>
  );
}
