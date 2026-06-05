import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CASE_REPOSITORY } from "../../cases.tokens";
import { CaseRepository } from "../../domain/repositories/case.repository";

@Injectable()
export class GetCaseDetailUseCase {
  constructor(
    @Inject(CASE_REPOSITORY)
    private readonly caseRepository: CaseRepository,
  ) {}

  async execute(caseId: string) {
    const caseItem = await this.caseRepository.findById(caseId);

    if (!caseItem || !caseItem.isVisible()) {
      throw new NotFoundException(`사건 문서 ${caseId}를 찾을 수 없습니다.`);
    }

    return caseItem;
  }
}
