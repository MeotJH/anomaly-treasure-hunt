import {
  InvestigationReport,
  ReviewStatus,
  RewardStatus,
  WinnerRecord,
} from "../entities/investigation-report.entity";

export interface InvestigationReportRepository {
  create(report: InvestigationReport): Promise<void>;
  countByCaseAndUser(caseId: string, userId: string): Promise<number>;
  findApprovedByCaseAndUser(
    caseId: string,
    userId: string,
  ): Promise<InvestigationReport | null>;
  findByCaseAndUser(caseId: string, userId: string): Promise<InvestigationReport[]>;
  findByUserId(userId: string): Promise<InvestigationReport[]>;
  findByCaseId(caseId: string): Promise<InvestigationReport[]>;
  findById(reportId: string): Promise<InvestigationReport | null>;
  delete(reportId: string): Promise<void>;
  updateReview(
    reportId: string,
    reviewStatus: ReviewStatus,
    reviewedAt: Date,
    rejectionReason?: string,
  ): Promise<InvestigationReport>;
  getWinnerByCaseId(caseId: string): Promise<WinnerRecord | null>;
  createWinner(winner: WinnerRecord): Promise<void>;
  updateWinnerStatus(winnerId: string, status: RewardStatus, now: Date): Promise<WinnerRecord>;
}
