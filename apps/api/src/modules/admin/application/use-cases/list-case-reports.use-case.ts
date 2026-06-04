import { Inject, Injectable } from "@nestjs/common";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../../reports/reports.tokens";
import { InvestigationReportRepository } from "../../../reports/domain/repositories/investigation-report.repository";

@Injectable()
export class ListCaseReportsUseCase {
  constructor(
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
  ) {}

  async execute(caseId: string) {
    const reports = await this.reportRepository.findByCaseId(caseId);
    return reports.map((report) => report.toSnapshot());
  }
}

