import { Inject, Injectable } from "@nestjs/common";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../../reports/reports.tokens";
import { InvestigationReportRepository } from "../../../reports/domain/repositories/investigation-report.repository";

@Injectable()
export class ReviewReportUseCase {
  constructor(
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
  ) {}

  async execute(
    reportId: string,
    reviewStatus: "approved" | "rejected",
    rejectionReason?: string,
  ) {
    const report = await this.reportRepository.updateReview(
      reportId,
      reviewStatus,
      new Date(),
      rejectionReason,
    );

    return report.toSnapshot();
  }
}

