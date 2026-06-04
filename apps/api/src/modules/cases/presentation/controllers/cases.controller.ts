import { Controller, Get, Param } from "@nestjs/common";
import { CaseResponseMapper } from "../../application/services/case-response.mapper";
import { GetCaseDetailUseCase } from "../../application/use-cases/get-case-detail.use-case";
import { GetCurrentCaseUseCase } from "../../application/use-cases/get-current-case.use-case";
import { ListCasesUseCase } from "../../application/use-cases/list-cases.use-case";

@Controller("api/cases")
export class CasesController {
  constructor(
    private readonly getCurrentCaseUseCase: GetCurrentCaseUseCase,
    private readonly listCasesUseCase: ListCasesUseCase,
    private readonly getCaseDetailUseCase: GetCaseDetailUseCase,
    private readonly mapper: CaseResponseMapper,
  ) {}

  @Get("current")
  async getCurrentCase() {
    const now = new Date();
    const caseItem = await this.getCurrentCaseUseCase.execute(now);

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
  async getCaseDetail(@Param("caseId") caseId: string) {
    const now = new Date();
    const caseItem = await this.getCaseDetailUseCase.execute(caseId);
    return this.mapper.toDetail(caseItem, now);
  }
}

