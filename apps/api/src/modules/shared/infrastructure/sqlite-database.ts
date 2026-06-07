import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createSeedCases } from "./sqlite-seed";
import { createHash } from "node:crypto";

function normalizeCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

function hashCode(code: string) {
  return createHash("sha256").update(normalizeCode(code)).digest("hex");
}

function isHash(value: string) {
  return /^[a-f0-9]{64}$/i.test(value);
}

function maskCode(code: string) {
  const normalizedCode = normalizeCode(code);

  if (normalizedCode.length <= 4) {
    return "*".repeat(normalizedCode.length);
  }

  return `${normalizedCode.slice(0, 2)}${"*".repeat(normalizedCode.length - 4)}${normalizedCode.slice(-2)}`;
}

@Injectable()
export class SqliteDatabase implements OnModuleDestroy {
  private readonly database: DatabaseSync;

  constructor() {
    const configuredPath = process.env.SQLITE_PATH ?? ".local/anomaly-treasure-hunt.sqlite";
    const filePath = resolve(process.cwd(), configuredPath);

    mkdirSync(dirname(filePath), { recursive: true });

    this.database = new DatabaseSync(filePath);
    this.database.exec("PRAGMA foreign_keys = ON;");
    this.initializeSchema();
    this.migrateLegacySecrets();
    this.syncSeedCases();
  }

  get connection() {
    return this.database;
  }

  onModuleDestroy() {
    this.database.close();
  }

  private initializeSchema() {
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        file_no TEXT NOT NULL,
        title TEXT NOT NULL,
        episode_no INTEGER NOT NULL,
        access_level TEXT NOT NULL,
        status TEXT NOT NULL,
        reward_name TEXT NOT NULL,
        summary TEXT NOT NULL,
        report_body TEXT NOT NULL,
        safety_notice TEXT NOT NULL,
        starts_at TEXT NOT NULL,
        ends_at TEXT NOT NULL,
        announced_at TEXT NOT NULL,
        answer_location TEXT NOT NULL,
        identification_code TEXT NOT NULL,
        completion_message TEXT NOT NULL,
        clues_json TEXT NOT NULL,
        mission_instruction TEXT NOT NULL,
        mission_photo_requirement TEXT NOT NULL,
        mission_caution TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        submitted_code TEXT NOT NULL,
        normalized_code TEXT NOT NULL,
        photo_url TEXT NOT NULL,
        is_code_correct INTEGER NOT NULL,
        review_status TEXT NOT NULL,
        rejection_reason TEXT,
        submitted_at TEXT NOT NULL,
        reviewed_at TEXT
      );

      CREATE TABLE IF NOT EXISTS winners (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        report_id TEXT NOT NULL,
        status TEXT NOT NULL,
        selected_at TEXT NOT NULL,
        notified_at TEXT,
        reward_sent_at TEXT
      );
    `);
  }

  private syncSeedCases() {
    const statement = this.database.prepare(`
      INSERT INTO cases (
        id,
        file_no,
        title,
        episode_no,
        access_level,
        status,
        reward_name,
        summary,
        report_body,
        safety_notice,
        starts_at,
        ends_at,
        announced_at,
        answer_location,
        identification_code,
        completion_message,
        clues_json,
        mission_instruction,
        mission_photo_requirement,
        mission_caution
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        file_no = excluded.file_no,
        title = excluded.title,
        episode_no = excluded.episode_no,
        access_level = excluded.access_level,
        status = excluded.status,
        reward_name = excluded.reward_name,
        summary = excluded.summary,
        report_body = excluded.report_body,
        safety_notice = excluded.safety_notice,
        starts_at = excluded.starts_at,
        ends_at = excluded.ends_at,
        announced_at = excluded.announced_at,
        answer_location = excluded.answer_location,
        identification_code = excluded.identification_code,
        completion_message = excluded.completion_message,
        clues_json = excluded.clues_json,
        mission_instruction = excluded.mission_instruction,
        mission_photo_requirement = excluded.mission_photo_requirement,
        mission_caution = excluded.mission_caution
    `);

    for (const seed of createSeedCases()) {
      statement.run(
        seed.id,
        seed.fileNo,
        seed.title,
        seed.episodeNo,
        seed.accessLevel,
        seed.status,
        seed.rewardName,
        seed.summary,
        seed.reportBody,
        seed.safetyNotice,
        seed.startsAt.toISOString(),
        seed.endsAt.toISOString(),
        seed.announcedAt.toISOString(),
        seed.answerLocation,
        seed.identificationCodeHash,
        seed.completionMessage,
        JSON.stringify(seed.clues),
        seed.mission.instruction,
        seed.mission.photoRequirement,
        seed.mission.caution,
      );
    }
  }

  private migrateLegacySecrets() {
    const caseRows = this.database
      .prepare("SELECT id, identification_code FROM cases")
      .all() as Array<{ id: string; identification_code: string }>;

    const updateCaseCode = this.database.prepare(
      "UPDATE cases SET identification_code = ? WHERE id = ?",
    );

    for (const row of caseRows) {
      if (row.identification_code && !isHash(row.identification_code)) {
        updateCaseCode.run(hashCode(row.identification_code), row.id);
      }
    }

    const reportRows = this.database
      .prepare("SELECT id, submitted_code, normalized_code FROM reports")
      .all() as Array<{
        id: string;
        submitted_code: string;
        normalized_code: string;
      }>;

    const updateReportCode = this.database.prepare(`
      UPDATE reports
      SET submitted_code = ?, normalized_code = ?
      WHERE id = ?
    `);

    for (const row of reportRows) {
      if (row.normalized_code && !isHash(row.normalized_code)) {
        updateReportCode.run(
          maskCode(row.submitted_code || row.normalized_code),
          hashCode(row.normalized_code),
          row.id,
        );
      }
    }
  }
}
