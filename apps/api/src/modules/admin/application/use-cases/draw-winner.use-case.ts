import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CASE_REPOSITORY } from "../../../cases/cases.tokens";
import { CaseRepository } from "../../../cases/domain/repositories/case.repository";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../../reports/reports.tokens";
import { WinnerRecord } from "../../../reports/domain/entities/investigation-report.entity";
import { InvestigationReportRepository } from "../../../reports/domain/repositories/investigation-report.repository";

@Injectable()
export class DrawWinnerUseCase {
  constructor(
    @Inject(CASE_REPOSITORY)
    private readonly caseRepository: CaseRepository,
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
  ) {}

  async execute(caseId: string) {
    const caseItem = await this.caseRepository.findById(caseId);

    if (!caseItem) {
      throw new NotFoundException(`Case ${caseId} was not found.`);
    }

    if (caseItem.isReportOpen(new Date())) {
      throw new BadRequestException("Winner draw is only allowed after the case closes.");
    }

    const existingWinner = await this.reportRepository.getWinnerByCaseId(caseId);
    if (existingWinner) {
      return existingWinner.toSnapshot();
    }

    const approvedReports = (await this.reportRepository.findByCaseId(caseId)).filter(
      (report) => report.reviewStatus === "approved",
    );

    if (approvedReports.length === 0) {
      throw new BadRequestException("No approved reports are available for the draw.");
    }

    const selected =
      approvedReports[Math.floor(Math.random() * approvedReports.length)];

    const winner = new WinnerRecord({
      id: `winner-${caseId}-${selected.id}`,
      caseId,
      userId: selected.userId,
      reportId: selected.id,
      status: "selected",
      selectedAt: new Date(),
      notifiedAt: null,
      rewardSentAt: null,
    });

    await this.reportRepository.createWinner(winner);

    return winner.toSnapshot();
  }
}

