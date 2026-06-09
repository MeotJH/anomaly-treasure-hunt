import { Inject, Injectable } from "@nestjs/common";
import {
  InvestigationCase,
  InvestigationCaseProps,
} from "../../domain/entities/case.entity";
import { CaseRepository } from "../../domain/repositories/case.repository";
import { SqliteDatabase } from "../../../shared/infrastructure/sqlite-database";

type CaseRow = {
  id: string;
  file_no: string;
  title: string;
  episode_no: number;
  difficulty_grade: InvestigationCaseProps["difficultyGrade"];
  representative_image_url: string | null;
  access_level: string;
  status: InvestigationCaseProps["status"];
  reward_name: string;
  summary: string;
  report_body: string;
  safety_notice: string;
      starts_at: string;
      ends_at: string;
      announced_at: string;
      answer_location: string;
      identification_code: string;
  completion_message: string;
  clues_json: string;
  mission_instruction: string;
  mission_photo_requirement: string;
  mission_caution: string;
};

@Injectable()
export class SqliteCaseRepository implements CaseRepository {
  constructor(@Inject(SqliteDatabase) private readonly sqliteDatabase: SqliteDatabase) {}

  async findCurrent(now: Date) {
    const current = (await this.findVisible()).find((caseItem) => caseItem.isReportOpen(now));
    return current ?? null;
  }

  async findVisible() {
    const rows = this.sqliteDatabase.connection
      .prepare("SELECT * FROM cases WHERE status != 'draft' ORDER BY episode_no DESC")
      .all() as CaseRow[];

    return rows.map((row) => this.mapRow(row));
  }

  async findAll() {
    const rows = this.sqliteDatabase.connection
      .prepare("SELECT * FROM cases ORDER BY episode_no DESC")
      .all() as CaseRow[];

    return rows.map((row) => this.mapRow(row));
  }

  async findById(caseId: string) {
    const row = this.sqliteDatabase.connection
      .prepare("SELECT * FROM cases WHERE id = ?")
      .get(caseId) as CaseRow | undefined;

    return row ? this.mapRow(row) : null;
  }

  async create(caseItem: InvestigationCase) {
    const snapshot = caseItem.toSnapshot();
    this.sqliteDatabase.connection
      .prepare(`
        INSERT INTO cases (
          id, file_no, title, episode_no, difficulty_grade, representative_image_url, access_level, status, reward_name, summary,
          report_body, safety_notice, starts_at, ends_at, announced_at, answer_location,
          identification_code, completion_message, clues_json, mission_instruction,
          mission_photo_requirement, mission_caution
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        snapshot.id,
        snapshot.fileNo,
        snapshot.title,
        snapshot.episodeNo,
        snapshot.difficultyGrade,
        snapshot.representativeImageUrl,
        snapshot.accessLevel,
        snapshot.status,
        snapshot.rewardName,
        snapshot.summary,
        snapshot.reportBody,
        snapshot.safetyNotice,
        snapshot.startsAt.toISOString(),
        snapshot.endsAt.toISOString(),
        snapshot.announcedAt.toISOString(),
        snapshot.answerLocation,
        snapshot.identificationCodeHash,
        snapshot.completionMessage,
        JSON.stringify(snapshot.clues),
        snapshot.mission.instruction,
        snapshot.mission.photoRequirement,
        snapshot.mission.caution,
      );
  }

  async update(
    caseId: string,
    next: Partial<ReturnType<InvestigationCase["toSnapshot"]>>,
  ) {
    const current = await this.findById(caseId);

    if (!current) {
      throw new Error(`사건 문서 ${caseId}를 찾을 수 없습니다.`);
    }

    const snapshot = { ...current.toSnapshot(), ...next };

    this.sqliteDatabase.connection
      .prepare(`
        UPDATE cases
        SET
          file_no = ?,
          title = ?,
          episode_no = ?,
          difficulty_grade = ?,
          representative_image_url = ?,
          access_level = ?,
          status = ?,
          reward_name = ?,
          summary = ?,
          report_body = ?,
          safety_notice = ?,
          starts_at = ?,
          ends_at = ?,
          announced_at = ?,
          answer_location = ?,
          identification_code = ?,
          completion_message = ?,
          clues_json = ?,
          mission_instruction = ?,
          mission_photo_requirement = ?,
          mission_caution = ?
        WHERE id = ?
      `)
      .run(
        snapshot.fileNo,
        snapshot.title,
        snapshot.episodeNo,
        snapshot.difficultyGrade,
        snapshot.representativeImageUrl,
        snapshot.accessLevel,
        snapshot.status,
        snapshot.rewardName,
        snapshot.summary,
        snapshot.reportBody,
        snapshot.safetyNotice,
        snapshot.startsAt.toISOString(),
        snapshot.endsAt.toISOString(),
        snapshot.announcedAt.toISOString(),
        snapshot.answerLocation,
        snapshot.identificationCodeHash,
        snapshot.completionMessage,
        JSON.stringify(snapshot.clues),
        snapshot.mission.instruction,
        snapshot.mission.photoRequirement,
        snapshot.mission.caution,
        snapshot.id,
      );

    return this.mapSnapshot(snapshot);
  }

  private mapRow(row: CaseRow) {
    return this.mapSnapshot({
      id: row.id,
      fileNo: row.file_no,
      title: row.title,
      episodeNo: row.episode_no,
      difficultyGrade: row.difficulty_grade,
      representativeImageUrl: row.representative_image_url,
      accessLevel: row.access_level,
      status: row.status,
      rewardName: row.reward_name,
      summary: row.summary,
      reportBody: row.report_body,
      safetyNotice: row.safety_notice,
      startsAt: new Date(row.starts_at),
      endsAt: new Date(row.ends_at),
      announcedAt: new Date(row.announced_at),
      answerLocation: row.answer_location,
      identificationCodeHash: row.identification_code,
      completionMessage: row.completion_message,
      clues: JSON.parse(row.clues_json) as InvestigationCaseProps["clues"],
      mission: {
        instruction: row.mission_instruction,
        photoRequirement: row.mission_photo_requirement,
        caution: row.mission_caution,
      },
    });
  }

  private mapSnapshot(snapshot: InvestigationCaseProps) {
    return new InvestigationCase(snapshot);
  }
}
