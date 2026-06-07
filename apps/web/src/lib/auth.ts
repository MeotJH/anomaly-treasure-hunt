import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { isSupabaseConfigured, supabaseConfig } from "./supabase/config";

export async function getAuthContext() {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      email: null,
      isAdmin: false,
      accessToken: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.toLowerCase() ?? null;
  const isAdmin = email === supabaseConfig.adminEmail.toLowerCase();

  return {
    user,
    email,
    isAdmin,
    accessToken: user ? (await supabase.auth.getSession()).data.session?.access_token ?? null : null,
  };
}

export async function requireSignedIn(next = "/") {
  if (!isSupabaseConfigured()) {
    redirect(`/?next=${encodeURIComponent(next)}`);
  }

  const auth = await getAuthContext();

  if (!auth.user) {
    redirect(`/?next=${encodeURIComponent(next)}`);
  }

  return auth;
}

export async function requireAdmin(next = "/admin") {
  const auth = await requireSignedIn(next);

  if (!auth.isAdmin) {
    redirect("/");
  }

  return auth;
}
