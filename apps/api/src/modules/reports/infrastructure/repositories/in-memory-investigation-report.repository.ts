import { Injectable, NotFoundException } from "@nestjs/common";
import {
  InvestigationReport,
  ReviewStatus,
  RewardStatus,
  WinnerRecord,
} from "../../domain/entities/investigation-report.entity";
import { InvestigationReportRepository } from "../../domain/repositories/investigation-report.repository";

@Injectable()
export class InMemoryInvestigationReportRepository
  implements InvestigationReportRepository
{
  private readonly reports: InvestigationReport[] = [];
  private readonly winners: WinnerRecord[] = [];

  async create(report: InvestigationReport) {
    this.reports.push(report);
  }

  async countByCaseAndUser(caseId: string, userId: string) {
    return this.reports.filter(
      (report) => report.caseId === caseId && report.userId === userId,
    ).length;
  }

  async findApprovedByCaseAndUser(caseId: string, userId: string) {
    return (
      this.reports.find(
        (report) =>
          report.caseId === caseId &&
          report.userId === userId &&
          report.reviewStatus === "approved",
      ) ?? null
    );
  }

  async findByCaseAndUser(caseId: string, userId: string) {
    return this.reports.filter(
      (report) => report.caseId === caseId && report.userId === userId,
    );
  }

  async findByUserId(userId: string) {
    return this.reports.filter((report) => report.userId === userId);
  }

  async findByCaseId(caseId: string) {
    return this.reports.filter((report) => report.caseId === caseId);
  }

  async findById(reportId: string) {
    return this.reports.find((report) => report.id === reportId) ?? null;
  }

  async updateReview(
    reportId: string,
    reviewStatus: ReviewStatus,
    reviewedAt: Date,
    rejectionReason?: string,
  ) {
    const report = await this.findById(reportId);

    if (!report) {
      throw new NotFoundException(`Report ${reportId} was not found.`);
    }

    if (reviewStatus === "approved") {
      report.approve(reviewedAt);
    } else {
      report.reject(rejectionReason ?? "관리자 반려", reviewedAt);
    }

    return report;
  }

  async getWinnerByCaseId(caseId: string) {
    return this.winners.find((winner) => winner.caseId === caseId) ?? null;
  }

  async createWinner(winner: WinnerRecord) {
    this.winners.push(winner);
  }

  async updateWinnerStatus(winnerId: string, status: RewardStatus, now: Date) {
    const winner = this.winners.find((candidate) => candidate.id === winnerId);

    if (!winner) {
      throw new NotFoundException(`Winner ${winnerId} was not found.`);
    }

    winner.updateStatus(status, now);
    return winner;
  }
}
