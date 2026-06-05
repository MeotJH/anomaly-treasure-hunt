export interface CaseSummary {
  id: string;
  fileNo: string;
  title: string;
  episodeNo: number;
  status: string;
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

export interface CaseDetail extends CaseSummary {
  reportBody: string;
  clues: CaseClue[];
  mission: MissionInstruction;
  safetyNotice: string;
  canSubmitReport: boolean;
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
  identificationCode: string;
  completionMessage: string;
  clues: CaseClue[];
  mission: MissionInstruction;
}
