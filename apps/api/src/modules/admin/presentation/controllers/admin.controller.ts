import { Body, Controller, Get, Inject, Param, Patch, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { CreateAdminCaseUseCase } from "../../application/use-cases/create-admin-case.use-case";
import { DrawWinnerUseCase } from "../../application/use-cases/draw-winner.use-case";
import { ListAdminCasesUseCase } from "../../application/use-cases/list-admin-cases.use-case";
import { ListCaseReportsUseCase } from "../../application/use-cases/list-case-reports.use-case";
import { ReviewReportUseCase } from "../../application/use-cases/review-report.use-case";
import { UpdateAdminCaseUseCase } from "../../application/use-cases/update-admin-case.use-case";
import { UpdateWinnerRewardUseCase } from "../../application/use-cases/update-winner-reward.use-case";
import { requireAdmin } from "../../../shared/presentation/request-user";
import { CreateAdminCaseDto } from "./create-admin-case.dto";
import { ReviewReportDto } from "./review-report.dto";
import { UpdateAdminCaseDto } from "./update-admin-case.dto";
import { UpdateWinnerRewardDto } from "./update-winner-reward.dto";

@Controller("api/admin")
export class AdminController {
  constructor(
    @Inject(ListAdminCasesUseCase)
    private readonly listAdminCasesUseCase: ListAdminCasesUseCase,
    @Inject(CreateAdminCaseUseCase)
    private readonly createAdminCaseUseCase: CreateAdminCaseUseCase,
    @Inject(UpdateAdminCaseUseCase)
    private readonly updateAdminCaseUseCase: UpdateAdminCaseUseCase,
    @Inject(ListCaseReportsUseCase)
    private readonly listCaseReportsUseCase: ListCaseReportsUseCase,
    @Inject(ReviewReportUseCase)
    private readonly reviewReportUseCase: ReviewReportUseCase,
    @Inject(DrawWinnerUseCase)
    private readonly drawWinnerUseCase: DrawWinnerUseCase,
    @Inject(UpdateWinnerRewardUseCase)
    private readonly updateWinnerRewardUseCase: UpdateWinnerRewardUseCase,
  ) {}

  @Get("cases")
  async listCases(@Req() request: Request) {
    requireAdmin(request);
    const cases = await this.listAdminCasesUseCase.execute();
    return cases.map((caseItem) => caseItem.toSnapshot());
  }

  @Post("cases")
  async createCase(@Body() body: CreateAdminCaseDto, @Req() request: Request) {
    requireAdmin(request);
    const caseItem = await this.createAdminCaseUseCase.execute(body);
    return caseItem.toSnapshot();
  }

  @Patch("cases/:caseId")
  async updateCase(
    @Param("caseId") caseId: string,
    @Body() body: UpdateAdminCaseDto,
    @Req() request: Request,
  ) {
    requireAdmin(request);
    const caseItem = await this.updateAdminCaseUseCase.execute(caseId, body);
    return caseItem.toSnapshot();
  }

  @Get("cases/:caseId/reports")
  async listCaseReports(@Param("caseId") caseId: string, @Req() request: Request) {
    requireAdmin(request);
    return this.listCaseReportsUseCase.execute(caseId);
  }

  @Patch("reports/:reportId/review")
  async reviewReport(
    @Param("reportId") reportId: string,
    @Body() body: ReviewReportDto,
    @Req() request: Request,
  ) {
    requireAdmin(request);
    return this.reviewReportUseCase.execute(
      reportId,
      body.reviewStatus,
      body.rejectionReason,
    );
  }

  @Post("cases/:caseId/draw")
  async drawWinner(@Param("caseId") caseId: string, @Req() request: Request) {
    requireAdmin(request);
    return this.drawWinnerUseCase.execute(caseId);
  }

  @Patch("winners/:winnerId/reward")
  async updateWinnerReward(
    @Param("winnerId") winnerId: string,
    @Body() body: UpdateWinnerRewardDto,
    @Req() request: Request,
  ) {
    requireAdmin(request);
    return this.updateWinnerRewardUseCase.execute(winnerId, body.status);
  }
}
