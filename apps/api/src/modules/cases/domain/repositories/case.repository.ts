import { InvestigationCase } from "../entities/case.entity";

export interface CaseRepository {
  findCurrent(now: Date): Promise<InvestigationCase | null>;
  findVisible(): Promise<InvestigationCase[]>;
  findById(caseId: string): Promise<InvestigationCase | null>;
}

