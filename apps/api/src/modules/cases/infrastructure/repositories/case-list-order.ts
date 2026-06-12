import { InvestigationCaseProps } from "../../domain/entities/case.entity";

const visibleCaseStatusPriority: Record<InvestigationCaseProps["status"], number> = {
  published: 0,
  announced: 1,
  closed: 2,
  draft: 3,
};

type CaseListOrderTarget = {
  status: string;
  episodeNo: number;
};

export function compareCaseListOrder(
  left: CaseListOrderTarget,
  right: CaseListOrderTarget,
) {
  const priorityGap =
    getCaseStatusPriority(left.status) - getCaseStatusPriority(right.status);

  if (priorityGap !== 0) {
    return priorityGap;
  }

  return right.episodeNo - left.episodeNo;
}

function getCaseStatusPriority(status: string) {
  return visibleCaseStatusPriority[status as InvestigationCaseProps["status"]] ?? Number.MAX_SAFE_INTEGER;
}
