import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseConfig } from "./config";

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    console.log("[supabase/middleware] skipped: not configured");
    return NextResponse.next({
      request,
    });
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseConfig.url!,
    supabaseConfig.publishableKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("[supabase/middleware] getUser", {
    path: request.nextUrl.pathname,
    hasUser: Boolean(user),
    email: user?.email ?? null,
    hasError: Boolean(error),
    errorMessage: error?.message ?? null,
  });

  return response;
}
