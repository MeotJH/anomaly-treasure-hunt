import { Module, forwardRef } from "@nestjs/common";
import { ReportsModule } from "../reports/reports.module";
import { SharedModule } from "../shared/shared.module";
import { CASE_REPOSITORY } from "./cases.tokens";
import { CaseResponseMapper } from "./application/services/case-response.mapper";
import { GetCaseDetailUseCase } from "./application/use-cases/get-case-detail.use-case";
import { GetCurrentCaseUseCase } from "./application/use-cases/get-current-case.use-case";
import { ListCasesUseCase } from "./application/use-cases/list-cases.use-case";
import { PrismaCaseRepository } from "./infrastructure/repositories/prisma-case.repository";
import { CasesController } from "./presentation/controllers/cases.controller";

@Module({
  imports: [SharedModule, forwardRef(() => ReportsModule)],
  controllers: [CasesController],
  providers: [
    CaseResponseMapper,
    GetCurrentCaseUseCase,
    ListCasesUseCase,
    GetCaseDetailUseCase,
    PrismaCaseRepository,
    {
      provide: CASE_REPOSITORY,
      useExisting: PrismaCaseRepository,
    },
  ],
  exports: [CASE_REPOSITORY],
})
export class CasesModule {}
