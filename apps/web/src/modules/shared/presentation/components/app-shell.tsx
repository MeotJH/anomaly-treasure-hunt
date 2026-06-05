import Link from "next/link";
import { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1f2937_0%,#09090b_45%,#05070c_100%)] text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8">
        <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">
              Archive Access
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
              Anomaly Treasure Hunt MVP
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              도시 이상현상 기록을 열람하고, 현장 증거를 보고하는 조사형 MVP 스캐폴드.
            </p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm text-zinc-300">
            <Link href="/" className="rounded-full border border-white/10 px-4 py-2 hover:border-emerald-400/40">
              Home
            </Link>
            <Link href="/cases" className="rounded-full border border-white/10 px-4 py-2 hover:border-emerald-400/40">
              Cases
            </Link>
            <Link href="/me/reports" className="rounded-full border border-white/10 px-4 py-2 hover:border-emerald-400/40">
              My Reports
            </Link>
            <Link href="/admin" className="rounded-full border border-white/10 px-4 py-2 hover:border-amber-400/40">
              Admin
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
