export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? null,
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "businesskim93@gmail.com",
  storageBucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "evidence-photos",
  oauthProviders: (process.env.NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDERS ?? "google")
    .split(",")
    .map((provider) => provider.trim())
    .filter(Boolean),
} as const;

export function isSupabaseConfigured() {
  return Boolean(supabaseConfig.url && supabaseConfig.publishableKey);
}
