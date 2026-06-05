export interface ReportSubmissionResult {
  isCodeCorrect: boolean;
  reviewStatus: "pending" | "approved" | "rejected";
  message: string;
}

export interface InvestigationReportSnapshot {
  id: string;
  caseId: string;
  userId: string;
  photoUrl: string;
  isCodeCorrect: boolean;
  reviewStatus: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  submittedAt: string;
}

export interface AdminWinnerRecord {
  id: string;
  caseId: string;
  userId: string;
  reportId: string;
  status: string;
  selectedAt: string;
}
