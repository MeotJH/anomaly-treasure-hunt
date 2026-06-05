import { Inject, Injectable } from "@nestjs/common";
import { CASE_REPOSITORY } from "../../../cases/cases.tokens";
import { CaseRepository } from "../../../cases/domain/repositories/case.repository";

@Injectable()
export class ListAdminCasesUseCase {
  constructor(
    @Inject(CASE_REPOSITORY)
    private readonly caseRepository: CaseRepository,
  ) {}

  async execute() {
    return this.caseRepository.findAll();
  }
}

