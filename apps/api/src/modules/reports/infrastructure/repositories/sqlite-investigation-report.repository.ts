import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  InvestigationReport,
  InvestigationReportProps,
  ReviewStatus,
  RewardStatus,
  WinnerRecord,
  WinnerRecordProps,
} from "../../domain/entities/investigation-report.entity";
import { InvestigationReportRepository } from "../../domain/repositories/investigation-report.repository";
import { SqliteDatabase } from "../../../shared/infrastructure/sqlite-database";

type ReportRow = {
  id: string;
  case_id: string;
  user_id: string;
  submitted_code: string;
  normalized_code: string;
  photo_url: string;
  is_code_correct: number;
  review_status: ReviewStatus;
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
};

type WinnerRow = {
  id: string;
  case_id: string;
  user_id: string;
  report_id: string;
  status: RewardStatus;
  selected_at: string;
  notified_at: string | null;
  reward_sent_at: string | null;
};

@Injectable()
export class SqliteInvestigationReportRepository
  implements InvestigationReportRepository
{
  constructor(@Inject(SqliteDatabase) private readonly sqliteDatabase: SqliteDatabase) {}

  async create(report: InvestigationReport) {
    const snapshot = report.toSnapshot();
    this.sqliteDatabase.connection
      .prepare(`
        INSERT INTO reports (
          id, case_id, user_id, submitted_code, normalized_code, photo_url,
          is_code_correct, review_status, rejection_reason, submitted_at, reviewed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        snapshot.id,
        snapshot.caseId,
        snapshot.userId,
        snapshot.submittedCodeMask,
        snapshot.normalizedCodeHash,
        snapshot.photoUrl,
        snapshot.isCodeCorrect ? 1 : 0,
        snapshot.reviewStatus,
        snapshot.rejectionReason,
        snapshot.submittedAt.toISOString(),
        snapshot.reviewedAt?.toISOString() ?? null,
      );
  }

  async countByCaseAndUser(caseId: string, userId: string) {
    const row = this.sqliteDatabase.connection
      .prepare("SELECT COUNT(*) as count FROM reports WHERE case_id = ? AND user_id = ?")
      .get(caseId, userId) as { count: number };

    return row.count;
  }

  async findApprovedByCaseAndUser(caseId: string, userId: string) {
    const row = this.sqliteDatabase.connection
      .prepare(`
        SELECT * FROM reports
        WHERE case_id = ? AND user_id = ? AND review_status = 'approved'
        LIMIT 1
      `)
      .get(caseId, userId) as ReportRow | undefined;

    return row ? this.mapReport(row) : null;
  }

  async findByCaseAndUser(caseId: string, userId: string) {
    const rows = this.sqliteDatabase.connection
      .prepare(`
        SELECT * FROM reports
        WHERE case_id = ? AND user_id = ?
        ORDER BY submitted_at DESC
      `)
      .all(caseId, userId) as ReportRow[];

    return rows.map((row) => this.mapReport(row));
  }

  async findByUserId(userId: string) {
    const rows = this.sqliteDatabase.connection
      .prepare("SELECT * FROM reports WHERE user_id = ? ORDER BY submitted_at DESC")
      .all(userId) as ReportRow[];

    return rows.map((row) => this.mapReport(row));
  }

  async findByCaseId(caseId: string) {
    const rows = this.sqliteDatabase.connection
      .prepare("SELECT * FROM reports WHERE case_id = ? ORDER BY submitted_at DESC")
      .all(caseId) as ReportRow[];

    return rows.map((row) => this.mapReport(row));
  }

  async findById(reportId: string) {
    const row = this.sqliteDatabase.connection
      .prepare("SELECT * FROM reports WHERE id = ? LIMIT 1")
      .get(reportId) as ReportRow | undefined;

    return row ? this.mapReport(row) : null;
  }

  async updateReview(
    reportId: string,
    reviewStatus: ReviewStatus,
    reviewedAt: Date,
    rejectionReason?: string,
  ) {
    const report = await this.findById(reportId);

    if (!report) {
      throw new NotFoundException(`제보 기록 ${reportId}를 찾을 수 없습니다.`);
    }

    const nextReason = reviewStatus === "rejected" ? rejectionReason ?? "관리자 반려" : null;
    this.sqliteDatabase.connection
      .prepare(`
        UPDATE reports
        SET review_status = ?, rejection_reason = ?, reviewed_at = ?
        WHERE id = ?
      `)
      .run(reviewStatus, nextReason, reviewedAt.toISOString(), reportId);

    return (await this.findById(reportId)) as InvestigationReport;
  }

  async getWinnerByCaseId(caseId: string) {
    const row = this.sqliteDatabase.connection
      .prepare("SELECT * FROM winners WHERE case_id = ? LIMIT 1")
      .get(caseId) as WinnerRow | undefined;

    return row ? this.mapWinner(row) : null;
  }

  async createWinner(winner: WinnerRecord) {
    const snapshot = winner.toSnapshot();
    this.sqliteDatabase.connection
      .prepare(`
        INSERT INTO winners (
          id, case_id, user_id, report_id, status, selected_at, notified_at, reward_sent_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        snapshot.id,
        snapshot.caseId,
        snapshot.userId,
        snapshot.reportId,
        snapshot.status,
        snapshot.selectedAt.toISOString(),
        snapshot.notifiedAt?.toISOString() ?? null,
        snapshot.rewardSentAt?.toISOString() ?? null,
      );
  }

  async updateWinnerStatus(winnerId: string, status: RewardStatus, now: Date) {
    const winner = this.sqliteDatabase.connection
      .prepare("SELECT * FROM winners WHERE id = ? LIMIT 1")
      .get(winnerId) as WinnerRow | undefined;

    if (!winner) {
      throw new NotFoundException(`선정 기록 ${winnerId}를 찾을 수 없습니다.`);
    }

    const notifiedAt = status === "notified" ? now.toISOString() : winner.notified_at;
    const rewardSentAt =
      status === "reward_sent" ? now.toISOString() : winner.reward_sent_at;

    this.sqliteDatabase.connection
      .prepare(`
        UPDATE winners
        SET status = ?, notified_at = ?, reward_sent_at = ?
        WHERE id = ?
      `)
      .run(status, notifiedAt, rewardSentAt, winnerId);

    const updated = this.sqliteDatabase.connection
      .prepare("SELECT * FROM winners WHERE id = ? LIMIT 1")
      .get(winnerId) as WinnerRow;

    return this.mapWinner(updated);
  }

  private mapReport(row: ReportRow) {
    const props: InvestigationReportProps = {
      id: row.id,
      caseId: row.case_id,
      userId: row.user_id,
      submittedCodeMask: row.submitted_code,
      normalizedCodeHash: row.normalized_code,
      photoUrl: row.photo_url,
      isCodeCorrect: row.is_code_correct === 1,
      reviewStatus: row.review_status,
      rejectionReason: row.rejection_reason,
      submittedAt: new Date(row.submitted_at),
      reviewedAt: row.reviewed_at ? new Date(row.reviewed_at) : null,
    };

    return new InvestigationReport(props);
  }

  private mapWinner(row: WinnerRow) {
    const props: WinnerRecordProps = {
      id: row.id,
      caseId: row.case_id,
      userId: row.user_id,
      reportId: row.report_id,
      status: row.status,
      selectedAt: new Date(row.selected_at),
      notifiedAt: row.notified_at ? new Date(row.notified_at) : null,
      rewardSentAt: row.reward_sent_at ? new Date(row.reward_sent_at) : null,
    };

    return new WinnerRecord(props);
  }
}
