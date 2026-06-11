function parseAdminEmails() {
  return new Set(
    (
      process.env.ADMIN_EMAILS ??
      process.env.NEXT_PUBLIC_ADMIN_EMAILS ??
      process.env.NEXT_PUBLIC_ADMIN_EMAIL ??
      "businesskim93@gmail.com"
    )
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? null,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? null,
  adminEmails: parseAdminEmails(),
  storageBucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "evidence-photos",
  oauthProviders: (process.env.NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDERS ?? "google")
    .split(",")
    .map((provider) => provider.trim())
    .filter(Boolean),
} as const;

export function isSupabaseConfigured() {
  return Boolean(supabaseConfig.url && supabaseConfig.publishableKey);
}
