import { config } from "dotenv";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const workspaceRoot = resolve(__dirname, "..");
const envCandidates = [resolve(workspaceRoot, ".env"), resolve(workspaceRoot, "../../.env")];

for (const candidate of envCandidates) {
  if (existsSync(candidate)) {
    config({ path: candidate });
    break;
  }
}

if (!process.env.DATABASE_URL) {
  const sqlitePath = (process.env.SQLITE_PATH ?? ".local/anomaly-treasure-hunt.sqlite").replace(
    /\\/g,
    "/",
  );
  process.env.DATABASE_URL = `file:${resolve(workspaceRoot, sqlitePath).replace(/\\/g, "/")}`;
}

const prismaArgs = [...process.argv.slice(2), "--schema", "prisma/schema.prisma"];
const command =
  process.platform === "win32"
    ? resolve(workspaceRoot, "node_modules/.bin/prisma.cmd")
    : resolve(workspaceRoot, "node_modules/.bin/prisma");
const result =
  process.platform === "win32"
    ? spawnSync("cmd.exe", ["/d", "/s", "/c", command, ...prismaArgs], {
        cwd: workspaceRoot,
        env: process.env,
        stdio: "inherit",
      })
    : spawnSync(command, prismaArgs, {
        cwd: workspaceRoot,
        env: process.env,
        stdio: "inherit",
      });

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
