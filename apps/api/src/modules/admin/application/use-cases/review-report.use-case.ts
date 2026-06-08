import { Inject, Injectable } from "@nestjs/common";
import { EvidencePhotoUrlService } from "../../../reports/application/services/evidence-photo-url.service";
import { InvestigationReportRepository } from "../../../reports/domain/repositories/investigation-report.repository";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../../reports/reports.tokens";

@Injectable()
export class ReviewReportUseCase {
  constructor(
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
    @Inject(EvidencePhotoUrlService)
    private readonly evidencePhotoUrlService: EvidencePhotoUrlService,
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

    return this.evidencePhotoUrlService.mapReportSnapshot(report.toSnapshot());
  }
}
