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
      throw new NotFoundException(`사건 문서 ${caseId}를 찾을 수 없습니다.`);
    }

    if (caseItem.isReportOpen(new Date())) {
      throw new BadRequestException("사건이 종료된 뒤에만 보상 대상을 선정할 수 있습니다.");
    }

    const existingWinner = await this.reportRepository.getWinnerByCaseId(caseId);
    if (existingWinner) {
      return existingWinner.toSnapshot();
    }

    const approvedReports = (await this.reportRepository.findByCaseId(caseId)).filter(
      (report) => report.reviewStatus === "approved",
    );

    if (approvedReports.length === 0) {
      throw new BadRequestException("선정 가능한 승인 제보가 없습니다.");
    }

    const selected = approvedReports[Math.floor(Math.random() * approvedReports.length)];

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
