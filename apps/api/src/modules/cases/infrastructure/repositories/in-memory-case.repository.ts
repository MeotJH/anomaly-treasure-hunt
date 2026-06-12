import { Injectable } from "@nestjs/common";
import { InvestigationCase } from "../../domain/entities/case.entity";
import { CaseRepository } from "../../domain/repositories/case.repository";
import { createSeedCases } from "../../../shared/infrastructure/sqlite-seed";
import { compareCaseListOrder } from "./case-list-order";

@Injectable()
export class InMemoryCaseRepository implements CaseRepository {
  private readonly cases = createSeedCases().map((seed) => new InvestigationCase(seed));

  async findCurrent(now: Date) {
    return (
      this.cases.find((caseItem) => caseItem.isReportOpen(now) && caseItem.isVisible()) ??
      null
    );
  }

  async findVisible() {
    return this.cases
      .filter((caseItem) => caseItem.isVisible())
      .sort(compareCaseListOrder);
  }

  async findAll() {
    return [...this.cases];
  }

  async findById(caseId: string) {
    return this.cases.find((caseItem) => caseItem.id === caseId) ?? null;
  }

  async create(caseItem: InvestigationCase) {
    this.cases.unshift(caseItem);
  }

  async update(
    caseId: string,
    next: Partial<ReturnType<InvestigationCase["toSnapshot"]>>,
  ) {
    const caseItem = await this.findById(caseId);

    if (!caseItem) {
      throw new Error(`사건 문서 ${caseId}를 찾을 수 없습니다.`);
    }

    caseItem.update(next);
    return caseItem;
  }
}
