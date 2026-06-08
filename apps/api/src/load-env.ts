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
