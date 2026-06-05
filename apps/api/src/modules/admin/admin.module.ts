import { Module } from "@nestjs/common";
import { CasesModule } from "../cases/cases.module";
import { ReportsModule } from "../reports/reports.module";
import { CreateAdminCaseUseCase } from "./application/use-cases/create-admin-case.use-case";
import { DrawWinnerUseCase } from "./application/use-cases/draw-winner.use-case";
import { ListAdminCasesUseCase } from "./application/use-cases/list-admin-cases.use-case";
import { ListCaseReportsUseCase } from "./application/use-cases/list-case-reports.use-case";
import { ReviewReportUseCase } from "./application/use-cases/review-report.use-case";
import { UpdateAdminCaseUseCase } from "./application/use-cases/update-admin-case.use-case";
import { UpdateWinnerRewardUseCase } from "./application/use-cases/update-winner-reward.use-case";
import { AdminController } from "./presentation/controllers/admin.controller";

@Module({
  imports: [CasesModule, ReportsModule],
  controllers: [AdminController],
  providers: [
    ListAdminCasesUseCase,
    CreateAdminCaseUseCase,
    UpdateAdminCaseUseCase,
    ListCaseReportsUseCase,
    ReviewReportUseCase,
    DrawWinnerUseCase,
    UpdateWinnerRewardUseCase,
  ],
})
export class AdminModule {}
