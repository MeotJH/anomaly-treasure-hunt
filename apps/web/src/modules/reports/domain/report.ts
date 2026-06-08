export interface ReportSubmissionResult {
  isCodeCorrect: boolean;
  reviewStatus: "pending" | "approved" | "rejected";
  message: string;
}

export interface InvestigationReportSnapshot {
  id: string;
  caseId: string;
  userId: string;
  submittedCodeMask: string;
  photoUrl: string;
  isCodeCorrect: boolean;
  reviewStatus: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
}

export interface MyInvestigationReportSnapshot extends InvestigationReportSnapshot {
  caseFileNo: string;
  caseTitle: string;
  caseStatus: string;
  resultOpen: boolean;
}

export interface AdminWinnerRecord {
  id: string;
  caseId: string;
  userId: string;
  reportId: string;
  status: string;
  selectedAt: string;
}
