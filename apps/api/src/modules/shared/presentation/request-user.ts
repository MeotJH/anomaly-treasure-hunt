import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

export interface RequestUser {
  id: string;
  role: "user" | "admin";
}

export function getRequestUser(request: Request): RequestUser {
  const id = request.header("x-user-id");

  if (!id) {
    throw new UnauthorizedException("데모 모드에서는 x-user-id 헤더가 필요합니다.");
  }

  const roleHeader = request.header("x-user-role");
  const role = roleHeader === "admin" ? "admin" : "user";

  return { id, role };
}

export function requireAdmin(request: Request): RequestUser {
  const user = getRequestUser(request);

  if (user.role !== "admin") {
    throw new ForbiddenException("관리자 권한이 필요합니다.");
  }

  return user;
}
