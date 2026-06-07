"use client";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export async function getBrowserAuthorizationHeaders(required = true) {
  if (!isSupabaseConfigured()) {
    if (required) {
      throw new Error("Supabase Auth 설정이 필요합니다.");
    }

    return {} as Record<string, string>;
  }

  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    if (required) {
      throw new Error("로그인이 필요합니다.");
    }

    return {} as Record<string, string>;
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  } satisfies Record<string, string>;
}
