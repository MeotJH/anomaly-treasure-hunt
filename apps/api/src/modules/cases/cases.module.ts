import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { CASE_REPOSITORY } from "./cases.tokens";
import { CaseResponseMapper } from "./application/services/case-response.mapper";
import { GetCaseDetailUseCase } from "./application/use-cases/get-case-detail.use-case";
import { GetCurrentCaseUseCase } from "./application/use-cases/get-current-case.use-case";
import { ListCasesUseCase } from "./application/use-cases/list-cases.use-case";
import { SqliteCaseRepository } from "./infrastructure/repositories/sqlite-case.repository";
import { CasesController } from "./presentation/controllers/cases.controller";

@Module({
  imports: [SharedModule],
  controllers: [CasesController],
  providers: [
    CaseResponseMapper,
    GetCurrentCaseUseCase,
    ListCasesUseCase,
    GetCaseDetailUseCase,
    SqliteCaseRepository,
    {
      provide: CASE_REPOSITORY,
      useExisting: SqliteCaseRepository,
    },
  ],
  exports: [CASE_REPOSITORY],
})
export class CasesModule {}
