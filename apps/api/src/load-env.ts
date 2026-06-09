import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const candidatePaths = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "../../.env"),
];

for (const candidatePath of candidatePaths) {
  if (existsSync(candidatePath)) {
    config({ path: candidatePath });
    break;
  }
}

if (!process.env.DATABASE_URL) {
  const sqlitePath = (process.env.SQLITE_PATH ?? ".local/anomaly-treasure-hunt.sqlite").replace(
    /\\/g,
    "/",
  );
  process.env.DATABASE_URL = `file:${resolve(process.cwd(), sqlitePath).replace(/\\/g, "/")}`;
}
