import { Injectable } from "@nestjs/common";
import { InvestigationCase } from "../../domain/entities/case.entity";

@Injectable()
export class CaseResponseMapper {
  toSummary(caseItem: InvestigationCase) {
    return {
      id: caseItem.id,
      fileNo: caseItem.fileNo,
      title: caseItem.title,
      episodeNo: caseItem.episodeNo,
      status: caseItem.status,
      accessLevel: caseItem.accessLevel,
      rewardName: caseItem.rewardName,
      summary: caseItem.summary,
      startsAt: caseItem.startsAt.toISOString(),
      endsAt: caseItem.endsAt.toISOString(),
      announcedAt: caseItem.announcedAt.toISOString(),
    };
  }

  toDetail(caseItem: InvestigationCase, now: Date) {
    return {
      ...this.toSummary(caseItem),
      reportBody: caseItem.reportBody,
      clues: caseItem.clues,
      mission: caseItem.mission,
      safetyNotice: caseItem.safetyNotice,
      canSubmitReport: caseItem.isReportOpen(now),
    };
  }
}

