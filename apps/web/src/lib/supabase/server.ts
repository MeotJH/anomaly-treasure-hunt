import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured, supabaseConfig } from "./config";

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase 환경 변수가 없습니다. NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 설정해 주세요.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseConfig.url!, supabaseConfig.publishableKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot always set cookies. Middleware handles refresh writes.
        }
      },
    },
  });
}
