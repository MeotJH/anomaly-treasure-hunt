import { Inject, Injectable } from "@nestjs/common";
import { EvidencePhotoUrlService } from "../../../reports/application/services/evidence-photo-url.service";
import { InvestigationReportRepository } from "../../../reports/domain/repositories/investigation-report.repository";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../../reports/reports.tokens";

@Injectable()
export class ListCaseReportsUseCase {
  constructor(
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
    @Inject(EvidencePhotoUrlService)
    private readonly evidencePhotoUrlService: EvidencePhotoUrlService,
  ) {}

  async execute(caseId: string) {
    const reports = await this.reportRepository.findByCaseId(caseId);

    return Promise.all(
      reports.map((report) => this.evidencePhotoUrlService.mapReportSnapshot(report.toSnapshot())),
    );
  }
}
