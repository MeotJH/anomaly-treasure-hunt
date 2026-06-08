import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const storageBucket =
  process.env.SUPABASE_STORAGE_BUCKET ??
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ??
  "evidence-photos";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

@Injectable()
export class EvidencePhotoUrlService {
  private supabase: SupabaseClient | null = null;

  private getClient() {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error(
        "Supabase Storage 서명 URL 환경 변수가 없습니다. SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY를 설정해 주세요.",
      );
    }

    if (!this.supabase) {
      this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return this.supabase;
  }

  async createSignedUrl(path: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase.storage
      .from(storageBucket)
      .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

    if (error || !data?.signedUrl) {
      throw new Error(`증거 이미지 서명 URL 생성에 실패했습니다: ${error?.message ?? "unknown error"}`);
    }

    return data.signedUrl;
  }

  async mapReportSnapshot<T extends { photoUrl: string }>(snapshot: T) {
    return {
      ...snapshot,
      photoUrl: await this.createSignedUrl(snapshot.photoUrl),
    };
  }
}
