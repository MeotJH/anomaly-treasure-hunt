import { Inject, Injectable } from "@nestjs/common";
import { CASE_REPOSITORY } from "../../cases.tokens";
import { CaseRepository } from "../../domain/repositories/case.repository";

@Injectable()
export class GetCurrentCaseUseCase {
  constructor(
    @Inject(CASE_REPOSITORY)
    private readonly caseRepository: CaseRepository,
  ) {}

  execute(now: Date) {
    return this.caseRepository.findCurrent(now);
  }
}

