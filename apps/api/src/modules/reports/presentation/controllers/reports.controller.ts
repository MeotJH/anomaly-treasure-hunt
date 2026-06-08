import { Body, Controller, Get, Inject, Param, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { GetCaseResultUseCase } from "../../application/use-cases/get-case-result.use-case";
import { ListMyReportsUseCase } from "../../application/use-cases/list-my-reports.use-case";
import { SubmitInvestigationReportUseCase } from "../../application/use-cases/submit-investigation-report.use-case";
import { getRequestUser } from "../../../shared/presentation/request-user";
import { SubmitReportDto } from "./submit-report.dto";

@Controller("api")
export class ReportsController {
  constructor(
    @Inject(SubmitInvestigationReportUseCase)
    private readonly submitInvestigationReportUseCase: SubmitInvestigationReportUseCase,
    @Inject(ListMyReportsUseCase)
    private readonly listMyReportsUseCase: ListMyReportsUseCase,
    @Inject(GetCaseResultUseCase)
    private readonly getCaseResultUseCase: GetCaseResultUseCase,
  ) {}

  @Post("cases/:caseId/report")
  async submitReport(
    @Param("caseId") caseId: string,
    @Body() body: SubmitReportDto,
    @Req() request: Request,
  ) {
    const user = await getRequestUser(request);

    return this.submitInvestigationReportUseCase.execute({
      caseId,
      userId: user.id,
      code: body.code,
      photoUrl: body.photoUrl,
    });
  }

  @Get("me/reports")
  async listMyReports(@Req() request: Request) {
    const user = await getRequestUser(request);
    return this.listMyReportsUseCase.execute(user.id);
  }

  @Get("cases/:caseId/result")
  async getCaseResult(@Param("caseId") caseId: string) {
    return this.getCaseResultUseCase.execute(caseId);
  }
}
