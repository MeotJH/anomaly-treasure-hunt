import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

export interface RequestUser {
  id: string;
  role: "user" | "admin";
}

export function getRequestUser(request: Request): RequestUser {
  const id = request.header("x-user-id");

  if (!id) {
    throw new UnauthorizedException("x-user-id header is required in demo mode.");
  }

  const roleHeader = request.header("x-user-role");
  const role = roleHeader === "admin" ? "admin" : "user";

  return { id, role };
}

export function requireAdmin(request: Request): RequestUser {
  const user = getRequestUser(request);

  if (user.role !== "admin") {
    throw new ForbiddenException("Admin role is required.");
  }

  return user;
}
