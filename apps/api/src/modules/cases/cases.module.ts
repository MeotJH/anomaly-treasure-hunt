import { Module } from "@nestjs/common";
import { CASE_REPOSITORY } from "./cases.tokens";
import { CaseResponseMapper } from "./application/services/case-response.mapper";
import { GetCaseDetailUseCase } from "./application/use-cases/get-case-detail.use-case";
import { GetCurrentCaseUseCase } from "./application/use-cases/get-current-case.use-case";
import { ListCasesUseCase } from "./application/use-cases/list-cases.use-case";
import { InMemoryCaseRepository } from "./infrastructure/repositories/in-memory-case.repository";
import { CasesController } from "./presentation/controllers/cases.controller";

@Module({
  controllers: [CasesController],
  providers: [
    CaseResponseMapper,
    GetCurrentCaseUseCase,
    ListCasesUseCase,
    GetCaseDetailUseCase,
    InMemoryCaseRepository,
    {
      provide: CASE_REPOSITORY,
      useExisting: InMemoryCaseRepository,
    },
  ],
  exports: [CASE_REPOSITORY],
})
export class CasesModule {}

