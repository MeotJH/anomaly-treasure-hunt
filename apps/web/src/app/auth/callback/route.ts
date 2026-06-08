import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  console.log("[auth/callback] start", {
    origin: requestUrl.origin,
    next,
    hasCode: Boolean(code),
    cookieCount: request.cookies.getAll().length,
  });

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("[auth/callback] exchange result", {
      hasError: Boolean(error),
      errorMessage: error?.message ?? null,
    });
  }

  const redirectUrl = new URL(next, requestUrl.origin);
  console.log("[auth/callback] redirect", {
    redirectTo: redirectUrl.toString(),
  });
  return NextResponse.redirect(redirectUrl);
}
