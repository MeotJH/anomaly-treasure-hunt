import { Inject, Injectable } from "@nestjs/common";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../../reports/reports.tokens";
import { RewardStatus } from "../../../reports/domain/entities/investigation-report.entity";
import { InvestigationReportRepository } from "../../../reports/domain/repositories/investigation-report.repository";

@Injectable()
export class UpdateWinnerRewardUseCase {
  constructor(
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
  ) {}

  async execute(winnerId: string, status: RewardStatus) {
    const winner = await this.reportRepository.updateWinnerStatus(
      winnerId,
      status,
      new Date(),
    );

    return winner.toSnapshot();
  }
}

