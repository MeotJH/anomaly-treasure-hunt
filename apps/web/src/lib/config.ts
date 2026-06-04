export const appConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000",
  demoUserId: "demo-user-1",
  demoAdminId: "demo-admin-1",
} as const;

export function createDemoHeaders(role: "user" | "admin") {
  return {
    "x-user-id": role === "admin" ? appConfig.demoAdminId : appConfig.demoUserId,
    "x-user-role": role,
  };
}

