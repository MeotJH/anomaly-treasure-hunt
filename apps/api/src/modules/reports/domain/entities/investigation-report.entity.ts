export type ReviewStatus = "pending" | "approved" | "rejected";
export type RewardStatus = "selected" | "notified" | "reward_sent" | "cancelled";

export interface InvestigationReportProps {
  id: string;
  caseId: string;
  userId: string;
  submittedCodeMask: string;
  normalizedCodeHash: string;
  photoUrl: string;
  displayPhotoUrl: string | null;
  isCodeCorrect: boolean;
  reviewStatus: ReviewStatus;
  rejectionReason: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
}

export class InvestigationReport {
  constructor(private readonly props: InvestigationReportProps) {}

  get id() {
    return this.props.id;
  }

  get caseId() {
    return this.props.caseId;
  }

  get userId() {
    return this.props.userId;
  }

  get normalizedCodeHash() {
    return this.props.normalizedCodeHash;
  }

  get photoUrl() {
    return this.props.photoUrl;
  }

  get displayPhotoUrl() {
    return this.props.displayPhotoUrl;
  }

  get submittedAt() {
    return this.props.submittedAt;
  }

  get reviewStatus() {
    return this.props.reviewStatus;
  }

  get rejectionReason() {
    return this.props.rejectionReason;
  }

  get isCodeCorrect() {
    return this.props.isCodeCorrect;
  }

  approve(reviewedAt: Date) {
    this.props.reviewStatus = "approved";
    this.props.rejectionReason = null;
    this.props.reviewedAt = reviewedAt;
  }

  reject(reason: string, reviewedAt: Date) {
    this.props.reviewStatus = "rejected";
    this.props.rejectionReason = reason;
    this.props.reviewedAt = reviewedAt;
  }

  toSnapshot() {
    return { ...this.props };
  }
}

export interface WinnerRecordProps {
  id: string;
  caseId: string;
  userId: string;
  reportId: string;
  status: RewardStatus;
  selectedAt: Date;
  notifiedAt: Date | null;
  rewardSentAt: Date | null;
}

export class WinnerRecord {
  constructor(private readonly props: WinnerRecordProps) {}

  get id() {
    return this.props.id;
  }

  get caseId() {
    return this.props.caseId;
  }

  get reportId() {
    return this.props.reportId;
  }

  get userId() {
    return this.props.userId;
  }

  get status() {
    return this.props.status;
  }

  updateStatus(status: RewardStatus, now: Date) {
    this.props.status = status;
    if (status === "notified") {
      this.props.notifiedAt = now;
    }
    if (status === "reward_sent") {
      this.props.rewardSentAt = now;
    }
  }

  toSnapshot() {
    return { ...this.props };
  }
}
