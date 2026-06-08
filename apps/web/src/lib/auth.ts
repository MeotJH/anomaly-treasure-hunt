import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { isSupabaseConfigured, supabaseConfig } from "./supabase/config";

const readAuthSnapshot = cache(async () => {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      email: null,
      isAdmin: false,
      accessToken: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: userData }, { data: sessionData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession(),
  ]);

  const user = userData.user;
  const session = sessionData.session;
  const email = user?.email?.toLowerCase() ?? null;
  const isAdmin = email === supabaseConfig.adminEmail.toLowerCase();

  return {
    user,
    email,
    isAdmin,
    accessToken: user ? session?.access_token ?? null : null,
  };
});

export async function getAuthContext() {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      email: null,
      isAdmin: false,
      accessToken: null,
    };
  }

  return readAuthSnapshot();
}

export async function requireSignedIn(next = "/") {
  if (!isSupabaseConfigured()) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const auth = await getAuthContext();

  if (!auth.user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
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
