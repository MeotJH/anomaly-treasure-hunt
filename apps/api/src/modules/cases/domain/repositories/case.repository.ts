import { InvestigationCase } from "../entities/case.entity";

export interface CaseRepository {
  findCurrent(): Promise<InvestigationCase | null>;
  findVisible(): Promise<InvestigationCase[]>;
  findAll(): Promise<InvestigationCase[]>;
  findById(caseId: string): Promise<InvestigationCase | null>;
  create(caseItem: InvestigationCase): Promise<void>;
  update(caseId: string, next: Partial<ReturnType<InvestigationCase["toSnapshot"]>>): Promise<InvestigationCase>;
}
