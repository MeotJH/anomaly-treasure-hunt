"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured, supabaseConfig } from "@/lib/supabase/config";

const providerLabels: Record<string, string> = {
  google: "Google로 로그인",
  kakao: "Kakao로 로그인",
  "custom:naver": "Naver로 로그인",
};

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path d="M9 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25H9" />
      <path d="M14.25 16.5 19.5 12l-5.25-4.5" />
      <path d="M19.5 12H9" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="block h-5 w-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

export function AuthControls({
  userEmail,
  isAdmin,
  nextPath,
  align = "end",
  compact = false,
}: {
  userEmail: string | null;
  isAdmin: boolean;
  nextPath?: string;
  align?: "start" | "end";
  compact?: boolean;
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
  const providers = supabaseConfig.oauthProviders.map((providerId) => ({
    id: providerId,
    label: providerLabels[providerId] ?? `${providerId}로 로그인`,
  }));
  const primaryProvider = providers[0];

  async function handleOAuthSignIn(provider: string) {
    setPendingProvider(provider);

    const redirectTarget = nextPath ?? window.location.pathname;
    const authBaseUrl = supabaseConfig.siteUrl ?? window.location.origin;
    const redirectTo = `${authBaseUrl.replace(/\/$/, "")}/auth/callback?next=${encodeURIComponent(redirectTarget)}`;

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

  if (!userEmail && compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="session-icon-group group relative">
          <button
            type="button"
            onClick={() => void handleOAuthSignIn(primaryProvider.id)}
            disabled={pendingProvider !== null}
            className="session-icon-button"
            aria-label={primaryProvider.label}
            title={primaryProvider.label}
          >
            <PersonIcon />
          </button>
          <div className="session-hover-card">
            <p className="text-sm font-medium text-zinc-100">
              {pendingProvider === primaryProvider.id ? "로그인 이동 중.." : "로그인되지 않음"}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              guest access
            </p>
            <p className="mt-3 text-sm text-zinc-300">{primaryProvider.label}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className={`flex flex-wrap gap-3 ${align === "start" ? "justify-start" : "justify-end"}`}>
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => void handleOAuthSignIn(provider.id)}
            disabled={pendingProvider !== null}
            className="gsi-material-button"
            aria-label={provider.label}
          >
            <span className="gsi-material-button-state" />
            <span className="gsi-material-button-content-wrapper">
              <span className="gsi-material-button-icon">
                {provider.id === "google" ? <GoogleIcon /> : <PersonIcon />}
              </span>
              <span className="gsi-material-button-contents">
                {pendingProvider === provider.id ? "로그인 연결 중.." : provider.label}
              </span>
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="session-icon-group group relative">
          <button
            type="button"
            className="session-icon-button"
            aria-label={isAdmin ? "관리자 계정 정보" : "로그인 계정 정보"}
          >
            <PersonIcon />
          </button>
          <div className="session-hover-card">
            <p className="text-sm font-medium text-zinc-100">{userEmail}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              {isAdmin ? "admin clearance" : "field agent"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="session-icon-button"
          aria-label="로그아웃"
          title="로그아웃"
        >
          <LogoutIcon />
        </button>
      </div>
    );
  }

  const justifyClass = align === "start" ? "justify-start text-left" : "justify-end text-right";

  return (
    <div className={`flex flex-wrap items-center gap-3 text-sm ${justifyClass}`}>
      <div>
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
