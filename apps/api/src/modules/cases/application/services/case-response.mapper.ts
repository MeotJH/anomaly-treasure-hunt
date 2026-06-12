import { Injectable } from "@nestjs/common";
import { InvestigationCase } from "../../domain/entities/case.entity";
import { InvestigationReport } from "../../../reports/domain/entities/investigation-report.entity";

@Injectable()
export class CaseResponseMapper {
  toSummary(caseItem: InvestigationCase) {
    return {
      id: caseItem.id,
      fileNo: caseItem.fileNo,
      title: caseItem.title,
      episodeNo: caseItem.episodeNo,
      status: caseItem.status,
      difficultyGrade: caseItem.difficultyGrade,
      representativeImageUrl: caseItem.representativeImageUrl,
      accessLevel: caseItem.accessLevel,
      rewardName: caseItem.rewardName,
      summary: caseItem.summary,
      startsAt: caseItem.startsAt.toISOString(),
      endsAt: caseItem.endsAt.toISOString(),
      announcedAt: caseItem.announcedAt.toISOString(),
    };
  }

  toDetail(caseItem: InvestigationCase, userReports?: InvestigationReport[]) {
    const hasApprovedReport =
      userReports?.some((report) => report.reviewStatus === "approved") ?? false;
    const submissionCount = userReports?.length ?? 0;
    const remainingSubmissionCount = Math.max(0, 5 - submissionCount);
    const latestReport = userReports?.[0] ?? null;

    const reportAvailability = !caseItem.isReportOpen()
      ? {
          state: "closed" as const,
          message: "이 사건은 현재 제보를 받고 있지 않습니다.",
        }
      : hasApprovedReport
        ? {
            state: "approved_locked" as const,
            message: "이미 승인된 제보가 있어 추가 제출이 잠겨 있습니다.",
          }
        : remainingSubmissionCount === 0
          ? {
              state: "limit_reached" as const,
              message: "이 사건에 허용된 5회 제출을 모두 사용했습니다.",
            }
          : {
              state: "open" as const,
              message: "현장 식별 코드와 증거 사진을 제출할 수 있습니다.",
            };

    return {
      ...this.toSummary(caseItem),
      reportBody: caseItem.reportBody,
      clues: caseItem.clues,
      mission: caseItem.mission,
      safetyNotice: caseItem.safetyNotice,
      canSubmitReport: reportAvailability.state === "open",
      reportAvailability,
      myReportStatus: {
        submissionCount,
        remainingSubmissionCount,
        hasApprovedReport,
        latestReviewStatus: latestReport?.reviewStatus ?? null,
        latestSubmittedAt: latestReport?.submittedAt.toISOString() ?? null,
      },
    };
  }
}
