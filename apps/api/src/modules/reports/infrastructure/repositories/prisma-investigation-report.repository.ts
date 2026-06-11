import { Prisma } from "@prisma/client";
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
import {
  deserializeBoolean,
  deserializeDate,
  serializeBoolean,
  serializeDate,
} from "../../../shared/infrastructure/prisma-persistence.util";
import { PrismaService } from "../../../shared/infrastructure/prisma.service";

type PrismaReportRecord = Prisma.ReportGetPayload<Record<string, never>>;
type PrismaWinnerRecord = Prisma.WinnerGetPayload<Record<string, never>>;

@Injectable()
export class PrismaInvestigationReportRepository
  implements InvestigationReportRepository
{
  constructor(@Inject(PrismaService) private readonly prismaService: PrismaService) {}

  async create(report: InvestigationReport) {
    const snapshot = report.toSnapshot();
    await this.prismaService.report.create({
      data: {
        id: snapshot.id,
        caseId: snapshot.caseId,
        userId: snapshot.userId,
        submittedCode: snapshot.submittedCodeMask,
        normalizedCode: snapshot.normalizedCodeHash,
        photoUrl: snapshot.photoUrl,
        displayPhotoUrl: snapshot.displayPhotoUrl,
        isCodeCorrect: serializeBoolean(snapshot.isCodeCorrect),
        reviewStatus: snapshot.reviewStatus,
        rejectionReason: snapshot.rejectionReason,
        submittedAt: serializeDate(snapshot.submittedAt),
        reviewedAt: snapshot.reviewedAt ? serializeDate(snapshot.reviewedAt) : null,
      },
    });
  }

  async countByCaseAndUser(caseId: string, userId: string) {
    return this.prismaService.report.count({
      where: {
        caseId,
        userId,
      },
    });
  }

  async findApprovedByCaseAndUser(caseId: string, userId: string) {
    const row = await this.prismaService.report.findFirst({
      where: {
        caseId,
        userId,
        reviewStatus: "approved",
      },
    });

    return row ? this.mapReport(row) : null;
  }

  async findByCaseAndUser(caseId: string, userId: string) {
    const rows = await this.prismaService.report.findMany({
      where: {
        caseId,
        userId,
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    return rows.map((row) => this.mapReport(row));
  }

  async findByUserId(userId: string) {
    const rows = await this.prismaService.report.findMany({
      where: { userId },
      orderBy: {
        submittedAt: "desc",
      },
    });

    return rows.map((row) => this.mapReport(row));
  }

  async findByCaseId(caseId: string) {
    const rows = await this.prismaService.report.findMany({
      where: { caseId },
      orderBy: {
        submittedAt: "desc",
      },
    });

    return rows.map((row) => this.mapReport(row));
  }

  async findById(reportId: string) {
    const row = await this.prismaService.report.findUnique({
      where: { id: reportId },
    });

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
      throw new NotFoundException(`Report ${reportId} was not found.`);
    }

    const nextReason =
      reviewStatus === "rejected" ? rejectionReason ?? "Rejected by admin review." : null;

    const updated = await this.prismaService.report.update({
      where: { id: reportId },
      data: {
        reviewStatus,
        rejectionReason: nextReason,
        reviewedAt: serializeDate(reviewedAt),
      },
    });

    return this.mapReport(updated);
  }

  async getWinnerByCaseId(caseId: string) {
    const row = await this.prismaService.winner.findUnique({
      where: { caseId },
    });

    return row ? this.mapWinner(row) : null;
  }

  async createWinner(winner: WinnerRecord) {
    const snapshot = winner.toSnapshot();
    await this.prismaService.winner.create({
      data: {
        id: snapshot.id,
        caseId: snapshot.caseId,
        userId: snapshot.userId,
        reportId: snapshot.reportId,
        status: snapshot.status,
        selectedAt: serializeDate(snapshot.selectedAt),
        notifiedAt: snapshot.notifiedAt ? serializeDate(snapshot.notifiedAt) : null,
        rewardSentAt: snapshot.rewardSentAt ? serializeDate(snapshot.rewardSentAt) : null,
      },
    });
  }

  async updateWinnerStatus(winnerId: string, status: RewardStatus, now: Date) {
    const winner = await this.prismaService.winner.findUnique({
      where: { id: winnerId },
    });

    if (!winner) {
      throw new NotFoundException(`Winner ${winnerId} was not found.`);
    }

    const updated = await this.prismaService.winner.update({
      where: { id: winnerId },
      data: {
        status,
        notifiedAt: status === "notified" ? serializeDate(now) : winner.notifiedAt,
        rewardSentAt:
          status === "reward_sent" ? serializeDate(now) : winner.rewardSentAt,
      },
    });

    return this.mapWinner(updated);
  }

  private mapReport(row: PrismaReportRecord) {
    const props: InvestigationReportProps = {
      id: row.id,
      caseId: row.caseId,
      userId: row.userId,
      submittedCodeMask: row.submittedCode,
      normalizedCodeHash: row.normalizedCode,
      photoUrl: row.photoUrl,
      displayPhotoUrl: row.displayPhotoUrl,
      isCodeCorrect: deserializeBoolean(row.isCodeCorrect),
      reviewStatus: row.reviewStatus as ReviewStatus,
      rejectionReason: row.rejectionReason,
      submittedAt: deserializeDate(row.submittedAt),
      reviewedAt: row.reviewedAt ? deserializeDate(row.reviewedAt) : null,
    };

    return new InvestigationReport(props);
  }

  private mapWinner(row: PrismaWinnerRecord) {
    const props: WinnerRecordProps = {
      id: row.id,
      caseId: row.caseId,
      userId: row.userId,
      reportId: row.reportId,
      status: row.status as RewardStatus,
      selectedAt: deserializeDate(row.selectedAt),
      notifiedAt: row.notifiedAt ? deserializeDate(row.notifiedAt) : null,
      rewardSentAt: row.rewardSentAt ? deserializeDate(row.rewardSentAt) : null,
    };

    return new WinnerRecord(props);
  }
}
