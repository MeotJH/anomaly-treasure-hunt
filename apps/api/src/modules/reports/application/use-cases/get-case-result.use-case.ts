import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CASE_REPOSITORY } from "../../../cases/cases.tokens";
import { CaseRepository } from "../../../cases/domain/repositories/case.repository";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../reports.tokens";
import { InvestigationReportRepository } from "../../domain/repositories/investigation-report.repository";

@Injectable()
export class GetCaseResultUseCase {
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

    const resultOpen = caseItem.isResultOpen();
    const winner = resultOpen
      ? await this.reportRepository.getWinnerByCaseId(caseId)
      : null;

    return {
      caseId,
      fileNo: caseItem.fileNo,
      title: caseItem.title,
      completionMessage: caseItem.completionMessage,
      winner:
        winner === null
          ? null
          : {
              id: winner.id,
              userId: winner.userId,
              status: winner.status,
            },
      resultOpen,
    };
  }
}
