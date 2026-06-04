import { Inject, Injectable } from "@nestjs/common";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../reports.tokens";
import { InvestigationReportRepository } from "../../domain/repositories/investigation-report.repository";

@Injectable()
export class ListMyReportsUseCase {
  constructor(
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
  ) {}

  async execute(userId: string) {
    const reports = await this.reportRepository.findByUserId(userId);
    return reports.map((report) => report.toSnapshot());
  }
}

