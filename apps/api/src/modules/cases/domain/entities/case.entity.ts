export type CaseStatus = "draft" | "published" | "closed" | "announced";

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

export interface InvestigationCaseProps {
  id: string;
  fileNo: string;
  title: string;
  episodeNo: number;
  accessLevel: string;
  status: CaseStatus;
  rewardName: string;
  summary: string;
  reportBody: string;
  safetyNotice: string;
  startsAt: Date;
  endsAt: Date;
  announcedAt: Date;
  answerLocation: string;
  identificationCodeHash: string;
  completionMessage: string;
  clues: CaseClue[];
  mission: MissionInstruction;
}

export class InvestigationCase {
  constructor(private readonly props: InvestigationCaseProps) {}

  get id() {
    return this.props.id;
  }

  get fileNo() {
    return this.props.fileNo;
  }

  get title() {
    return this.props.title;
  }

  get episodeNo() {
    return this.props.episodeNo;
  }

  get status() {
    return this.props.status;
  }

  get answerLocation() {
    return this.props.answerLocation;
  }

  get identificationCodeHash() {
    return this.props.identificationCodeHash;
  }

  get startsAt() {
    return this.props.startsAt;
  }

  get endsAt() {
    return this.props.endsAt;
  }

  get announcedAt() {
    return this.props.announcedAt;
  }

  get completionMessage() {
    return this.props.completionMessage;
  }

  get summary() {
    return this.props.summary;
  }

  get reportBody() {
    return this.props.reportBody;
  }

  get clues() {
    return this.props.clues;
  }

  get mission() {
    return this.props.mission;
  }

  get accessLevel() {
    return this.props.accessLevel;
  }

  get rewardName() {
    return this.props.rewardName;
  }

  get safetyNotice() {
    return this.props.safetyNotice;
  }

  toSnapshot() {
    return {
      ...this.props,
      clues: this.props.clues.map((clue) => ({ ...clue })),
      mission: { ...this.props.mission },
    };
  }

  update(next: Partial<InvestigationCaseProps>) {
    Object.assign(this.props, next);
  }

  isReportOpen(now: Date) {
    return now >= this.props.startsAt && now <= this.props.endsAt;
  }

  isResultOpen(now: Date) {
    return now >= this.props.announcedAt || this.props.status === "announced";
  }

  isVisible() {
    return this.props.status !== "draft";
  }
}
