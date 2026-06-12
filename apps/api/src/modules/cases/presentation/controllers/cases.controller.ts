import { Controller, Get, Inject, Param, Req } from "@nestjs/common";
import { Request } from "express";
import { CaseResponseMapper } from "../../application/services/case-response.mapper";
import { GetCaseDetailUseCase } from "../../application/use-cases/get-case-detail.use-case";
import { GetCurrentCaseUseCase } from "../../application/use-cases/get-current-case.use-case";
import { ListCasesUseCase } from "../../application/use-cases/list-cases.use-case";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../../reports/reports.tokens";
import { InvestigationReportRepository } from "../../../reports/domain/repositories/investigation-report.repository";
import { tryGetRequestUser } from "../../../shared/presentation/request-user";

@Controller("api/cases")
export class CasesController {
  constructor(
    @Inject(GetCurrentCaseUseCase)
    private readonly getCurrentCaseUseCase: GetCurrentCaseUseCase,
    @Inject(ListCasesUseCase)
    private readonly listCasesUseCase: ListCasesUseCase,
    @Inject(GetCaseDetailUseCase)
    private readonly getCaseDetailUseCase: GetCaseDetailUseCase,
    @Inject(CaseResponseMapper)
    private readonly mapper: CaseResponseMapper,
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
  ) {}

  @Get("current")
  async getCurrentCase() {
    const caseItem = await this.getCurrentCaseUseCase.execute();

    if (!caseItem) {
      return null;
    }

    return this.mapper.toSummary(caseItem);
  }

  @Get()
  async listCases() {
    const cases = await this.listCasesUseCase.execute();
    return cases.map((caseItem) => this.mapper.toSummary(caseItem));
  }

  @Get(":caseId")
  async getCaseDetail(@Param("caseId") caseId: string, @Req() request: Request) {
    const caseItem = await this.getCaseDetailUseCase.execute(caseId);
    const user = await tryGetRequestUser(request);
    const userReports = user
      ? await this.reportRepository.findByCaseAndUser(caseId, user.id)
      : undefined;

    return this.mapper.toDetail(caseItem, userReports);
  }
}
