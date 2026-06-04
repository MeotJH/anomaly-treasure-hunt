import { Module } from "@nestjs/common";
import { CasesModule } from "../cases/cases.module";
import { INVESTIGATION_REPORT_REPOSITORY } from "./reports.tokens";
import { GetCaseResultUseCase } from "./application/use-cases/get-case-result.use-case";
import { ListMyReportsUseCase } from "./application/use-cases/list-my-reports.use-case";
import { SubmitInvestigationReportUseCase } from "./application/use-cases/submit-investigation-report.use-case";
import { IdentificationCodeService } from "./application/services/identification-code.service";
import { InMemoryInvestigationReportRepository } from "./infrastructure/repositories/in-memory-investigation-report.repository";
import { ReportsController } from "./presentation/controllers/reports.controller";

@Module({
  imports: [CasesModule],
  controllers: [ReportsController],
  providers: [
    IdentificationCodeService,
    SubmitInvestigationReportUseCase,
    ListMyReportsUseCase,
    GetCaseResultUseCase,
    InMemoryInvestigationReportRepository,
    {
      provide: INVESTIGATION_REPORT_REPOSITORY,
      useExisting: InMemoryInvestigationReportRepository,
    },
  ],
  exports: [INVESTIGATION_REPORT_REPOSITORY],
})
export class ReportsModule {}

