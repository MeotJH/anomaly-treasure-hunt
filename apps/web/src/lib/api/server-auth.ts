import "server-only";

import { getAuthContext } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function getServerAuthorizationHeaders(required = false) {
  if (!isSupabaseConfigured()) {
    if (required) {
      throw new Error("Supabase Auth 설정이 필요합니다.");
    }

    return {} as Record<string, string>;
  }

  const auth = await getAuthContext();

  if (!auth.accessToken) {
    if (required) {
      throw new Error("로그인이 필요합니다.");
    }

    return {} as Record<string, string>;
  }

  return {
    Authorization: `Bearer ${auth.accessToken}`,
  } satisfies Record<string, string>;
}
