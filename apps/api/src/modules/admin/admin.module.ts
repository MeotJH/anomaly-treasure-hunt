import { Module } from "@nestjs/common";
import { CasesModule } from "../cases/cases.module";
import { ReportsModule } from "../reports/reports.module";
import { DrawWinnerUseCase } from "./application/use-cases/draw-winner.use-case";
import { ListCaseReportsUseCase } from "./application/use-cases/list-case-reports.use-case";
import { ReviewReportUseCase } from "./application/use-cases/review-report.use-case";
import { UpdateWinnerRewardUseCase } from "./application/use-cases/update-winner-reward.use-case";
import { AdminController } from "./presentation/controllers/admin.controller";

@Module({
  imports: [CasesModule, ReportsModule],
  controllers: [AdminController],
  providers: [
    ListCaseReportsUseCase,
    ReviewReportUseCase,
    DrawWinnerUseCase,
    UpdateWinnerRewardUseCase,
  ],
})
export class AdminModule {}
