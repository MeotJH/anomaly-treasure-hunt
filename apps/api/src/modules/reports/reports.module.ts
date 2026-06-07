import { Module, forwardRef } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { CasesModule } from "../cases/cases.module";
import { INVESTIGATION_REPORT_REPOSITORY } from "./reports.tokens";
import { GetCaseResultUseCase } from "./application/use-cases/get-case-result.use-case";
import { ListMyReportsUseCase } from "./application/use-cases/list-my-reports.use-case";
import { SubmitInvestigationReportUseCase } from "./application/use-cases/submit-investigation-report.use-case";
import { IdentificationCodeService } from "./application/services/identification-code.service";
import { SqliteInvestigationReportRepository } from "./infrastructure/repositories/sqlite-investigation-report.repository";
import { ReportsController } from "./presentation/controllers/reports.controller";

@Module({
  imports: [SharedModule, forwardRef(() => CasesModule)],
  controllers: [ReportsController],
  providers: [
    IdentificationCodeService,
    SubmitInvestigationReportUseCase,
    ListMyReportsUseCase,
    GetCaseResultUseCase,
    SqliteInvestigationReportRepository,
    {
      provide: INVESTIGATION_REPORT_REPOSITORY,
      useExisting: SqliteInvestigationReportRepository,
    },
  ],
  exports: [INVESTIGATION_REPORT_REPOSITORY, IdentificationCodeService],
})
export class ReportsModule {}
