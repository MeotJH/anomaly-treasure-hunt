import Link from "next/link";
import { PropsWithChildren } from "react";
import { getAuthContext } from "@/lib/auth";
import { AuthControls } from "@/modules/auth/presentation/components/auth-controls";
import { ArchiveGlitchFx, ArchiveTitle } from "./archive-title";

const navigationItems = [
  { href: "/", label: "감시 현황" },
  { href: "/cases", label: "이상 기록" },
  { href: "/me/reports", label: "내 제보" },
];

export async function AppShell({ children }: PropsWithChildren) {
  const auth = await getAuthContext();
  const items = auth.isAdmin
    ? [...navigationItems, { href: "/admin", label: "통제실" }]
    : navigationItems;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#471515_0%,#14090c_34%,#06070a_72%,#030406_100%)] text-zinc-100">
      <ArchiveGlitchFx />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,60,60,0.08),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(96,165,250,0.06),transparent_18%)]" />
      <div className="app-shell-frame mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8">
        <header className="app-shell-header mb-8 flex flex-col gap-5 border-b border-rose-900/40 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="signal-chip inline-flex rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-xs uppercase tracking-[0.45em] text-rose-300/70">
              감시 기록 보관
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[0.02em] text-zinc-50 sm:text-4xl">
              <ArchiveTitle title="이상현상 추적 기록 보관소" />
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
              현장 단서, 식별 코드, 제보 이력을 한곳에 모아 이상현상의 흔적을 추적하는
              감시용 시제품입니다.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <nav className="flex flex-wrap justify-end gap-3 text-sm text-zinc-300">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="signal-chip rounded-full border border-white/10 bg-black/20 px-4 py-2 transition hover:border-rose-400/40 hover:bg-rose-950/30 hover:text-rose-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <AuthControls
              userEmail={auth.email}
              isAdmin={auth.isAdmin}
            />
          </div>
        </header>
        <main className="app-shell-main flex-1">{children}</main>
      </div>
    </div>
  );
}
