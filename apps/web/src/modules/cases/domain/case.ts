export interface CaseSummary {
  id: string;
  fileNo: string;
  title: string;
  episodeNo: number;
  status: string;
  difficultyGrade: "F" | "E" | "D" | "C" | "B" | "A" | "S";
  representativeImageUrl: string | null;
  accessLevel: string;
  rewardName: string;
  summary: string;
  startsAt: string;
  endsAt: string;
  announcedAt: string;
}

export interface CaseClue {
  order: number;
  title: string;
  content: string;
}

export interface MissionInstruction {
  instruction: string;
  photoRequirement: string;
  caution: string;
}

export interface AdminCasePayload {
  fileNo: string;
  title: string;
  difficultyGrade: "F" | "E" | "D" | "C" | "B" | "A" | "S";
  representativeImageUrl?: string;
  accessLevel: string;
  status: "draft" | "published" | "closed" | "announced";
  rewardName: string;
  summary: string;
  reportBody: string;
  safetyNotice: string;
  startsAt: string;
  endsAt: string;
  announcedAt: string;
  answerLocation: string;
  identificationCode: string;
  completionMessage: string;
  clues: CaseClue[];
  mission: MissionInstruction;
}

export interface CaseDetail extends CaseSummary {
  reportBody: string;
  clues: CaseClue[];
  mission: MissionInstruction;
  safetyNotice: string;
  canSubmitReport: boolean;
  reportAvailability: {
    state: "open" | "closed" | "approved_locked" | "limit_reached";
    message: string;
  };
  myReportStatus: {
    submissionCount: number;
    remainingSubmissionCount: number;
    hasApprovedReport: boolean;
    latestReviewStatus: "pending" | "approved" | "rejected" | null;
    latestSubmittedAt: string | null;
  };
}

export interface CaseResult {
  caseId: string;
  fileNo: string;
  title: string;
  resultOpen: boolean;
  completionMessage: string;
  winner: {
    id: string;
    userId: string;
    status: string;
  } | null;
}

export interface AdminCaseRecord extends CaseSummary {
  reportBody: string;
  safetyNotice: string;
  answerLocation: string;
  hasIdentificationCode: boolean;
  completionMessage: string;
  clues: CaseClue[];
  mission: MissionInstruction;
}
