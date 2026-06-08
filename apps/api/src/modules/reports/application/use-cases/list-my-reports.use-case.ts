import { Inject, Injectable } from "@nestjs/common";
import { CASE_REPOSITORY } from "../../../cases/cases.tokens";
import { CaseRepository } from "../../../cases/domain/repositories/case.repository";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../reports.tokens";
import { InvestigationReportRepository } from "../../domain/repositories/investigation-report.repository";
import { EvidencePhotoUrlService } from "../services/evidence-photo-url.service";

@Injectable()
export class ListMyReportsUseCase {
  constructor(
    @Inject(CASE_REPOSITORY)
    private readonly caseRepository: CaseRepository,
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
    @Inject(EvidencePhotoUrlService)
    private readonly evidencePhotoUrlService: EvidencePhotoUrlService,
  ) {}

  async execute(userId: string) {
    const reports = await this.reportRepository.findByUserId(userId);
    const now = new Date();

    return Promise.all(
      reports.map(async (report) => {
        const caseItem = await this.caseRepository.findById(report.caseId);
        const snapshot = report.toSnapshot();

        return this.evidencePhotoUrlService.mapReportSnapshot({
          ...snapshot,
          caseFileNo: caseItem?.fileNo ?? report.caseId,
          caseTitle: caseItem?.title ?? "삭제되었거나 연결 불가한 사건",
          caseStatus: caseItem?.status ?? "closed",
          resultOpen: caseItem ? caseItem.isResultOpen(now) : false,
        });
      }),
    );
  }
}
