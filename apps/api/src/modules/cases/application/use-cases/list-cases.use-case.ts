import { Inject, Injectable } from "@nestjs/common";
import { CASE_REPOSITORY } from "../../cases.tokens";
import { CaseRepository } from "../../domain/repositories/case.repository";

@Injectable()
export class ListCasesUseCase {
  constructor(
    @Inject(CASE_REPOSITORY)
    private readonly caseRepository: CaseRepository,
  ) {}

  execute() {
    return this.caseRepository.findVisible();
  }
}

