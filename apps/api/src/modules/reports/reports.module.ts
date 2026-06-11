import { Module, forwardRef } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { CasesModule } from "../cases/cases.module";
import { INVESTIGATION_REPORT_REPOSITORY } from "./reports.tokens";
import { GetCaseResultUseCase } from "./application/use-cases/get-case-result.use-case";
import { ListMyReportsUseCase } from "./application/use-cases/list-my-reports.use-case";
import { SubmitInvestigationReportUseCase } from "./application/use-cases/submit-investigation-report.use-case";
import { EvidencePhotoCorruptionService } from "./application/services/evidence-photo-corruption.service";
import { EvidencePhotoUrlService } from "./application/services/evidence-photo-url.service";
import { IdentificationCodeService } from "./application/services/identification-code.service";
import { PrismaInvestigationReportRepository } from "./infrastructure/repositories/prisma-investigation-report.repository";
import { ReportsController } from "./presentation/controllers/reports.controller";

@Module({
  imports: [SharedModule, forwardRef(() => CasesModule)],
  controllers: [ReportsController],
  providers: [
    EvidencePhotoCorruptionService,
    EvidencePhotoUrlService,
    IdentificationCodeService,
    SubmitInvestigationReportUseCase,
    ListMyReportsUseCase,
    GetCaseResultUseCase,
    PrismaInvestigationReportRepository,
    {
      provide: INVESTIGATION_REPORT_REPOSITORY,
      useExisting: PrismaInvestigationReportRepository,
    },
  ],
  exports: [INVESTIGATION_REPORT_REPOSITORY, IdentificationCodeService, EvidencePhotoUrlService],
})
export class ReportsModule {}
