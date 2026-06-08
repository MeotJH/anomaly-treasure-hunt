import "../../../load-env";
import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";
import { Request } from "express";

export interface RequestUser {
  id: string;
  email: string | null;
  role: "user" | "admin";
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Supabase API 환경 변수가 없습니다. SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY를 설정해 주세요.",
  );
}

const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? "businesskim93@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function extractBearerToken(request: Request) {
  const authorization = request.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function tryGetRequestUser(request: Request): Promise<RequestUser | null> {
  const token = extractBearerToken(request);

  if (!token) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new UnauthorizedException("유효하지 않은 로그인 세션입니다.");
  }

  const email = user.email?.toLowerCase() ?? null;
  const role = email && adminEmails.has(email) ? "admin" : "user";

  return {
    id: user.id,
    email,
    role,
  };
}

export async function getRequestUser(request: Request): Promise<RequestUser> {
  const user = await tryGetRequestUser(request);

  if (!user) {
    throw new UnauthorizedException("로그인이 필요합니다.");
  }

  return user;
}

export async function requireAdmin(request: Request): Promise<RequestUser> {
  const user = await getRequestUser(request);

  if (user.role !== "admin") {
    throw new ForbiddenException("관리자 권한이 필요합니다.");
  }

  return user;
}
