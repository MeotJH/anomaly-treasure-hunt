import { Body, Controller, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { DrawWinnerUseCase } from "../../application/use-cases/draw-winner.use-case";
import { ListCaseReportsUseCase } from "../../application/use-cases/list-case-reports.use-case";
import { ReviewReportUseCase } from "../../application/use-cases/review-report.use-case";
import { UpdateWinnerRewardUseCase } from "../../application/use-cases/update-winner-reward.use-case";
import { requireAdmin } from "../../../shared/presentation/request-user";
import { ReviewReportDto } from "./review-report.dto";
import { UpdateWinnerRewardDto } from "./update-winner-reward.dto";

@Controller("api/admin")
export class AdminController {
  constructor(
    private readonly listCaseReportsUseCase: ListCaseReportsUseCase,
    private readonly reviewReportUseCase: ReviewReportUseCase,
    private readonly drawWinnerUseCase: DrawWinnerUseCase,
    private readonly updateWinnerRewardUseCase: UpdateWinnerRewardUseCase,
  ) {}

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
