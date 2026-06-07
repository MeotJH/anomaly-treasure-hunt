"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured, supabaseConfig } from "@/lib/supabase/config";

const providers = [
  { id: "google", label: "Google로 로그인" },
  { id: "kakao", label: "Kakao로 로그인" },
  { id: supabaseConfig.naverProviderId, label: "Naver로 로그인" },
] as const;

export function AuthControls({
  userEmail,
  isAdmin,
}: {
  userEmail: string | null;
  isAdmin: boolean;
}) {
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        supabase auth not configured
      </p>
    );
  }

  const supabase = createSupabaseBrowserClient();

  async function handleOAuthSignIn(provider: string) {
    setPendingProvider(provider);

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as never,
      options: {
        redirectTo,
      },
    });

    if (error) {
      setPendingProvider(null);
      throw error;
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!userEmail) {
    return (
      <div className="flex flex-wrap justify-end gap-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => void handleOAuthSignIn(provider.id)}
            disabled={pendingProvider !== null}
            className="signal-chip rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-zinc-200 transition hover:border-rose-400/40 hover:bg-rose-950/30 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pendingProvider === provider.id ? "이동 중..." : provider.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
      <div className="text-right">
        <p className="text-zinc-200">{userEmail}</p>
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
          {isAdmin ? "admin clearance" : "field agent"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        className="signal-chip rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-zinc-200 transition hover:border-rose-400/40 hover:bg-rose-950/30 hover:text-rose-100"
      >
        로그아웃
      </button>
    </div>
  );
}
