export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? null,
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "businesskim93@gmail.com",
  naverProviderId: process.env.NEXT_PUBLIC_SUPABASE_NAVER_PROVIDER_ID ?? "custom:naver",
} as const;

export function isSupabaseConfigured() {
  return Boolean(supabaseConfig.url && supabaseConfig.publishableKey);
}
