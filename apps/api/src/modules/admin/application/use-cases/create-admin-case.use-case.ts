import { Inject, Injectable } from "@nestjs/common";
import { CASE_REPOSITORY } from "../../../cases/cases.tokens";
import {
  InvestigationCase,
  InvestigationCaseProps,
} from "../../../cases/domain/entities/case.entity";
import { CaseRepository } from "../../../cases/domain/repositories/case.repository";

export interface CreateAdminCaseCommand {
  fileNo: string;
  title: string;
  accessLevel: string;
  status: InvestigationCaseProps["status"];
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
}

@Injectable()
export class CreateAdminCaseUseCase {
  constructor(
    @Inject(CASE_REPOSITORY)
    private readonly caseRepository: CaseRepository,
  ) {}

  async execute(command: CreateAdminCaseCommand) {
    const existingCases = await this.caseRepository.findAll();
    const caseItem = new InvestigationCase({
      id: `case-${Date.now()}`,
      fileNo: command.fileNo,
      title: command.title,
      episodeNo: existingCases.length + 1,
      accessLevel: command.accessLevel,
      status: command.status,
      rewardName: command.rewardName,
      summary: command.summary,
      reportBody: command.reportBody,
      safetyNotice: command.safetyNotice,
      startsAt: new Date(command.startsAt),
      endsAt: new Date(command.endsAt),
      announcedAt: new Date(command.announcedAt),
      answerLocation: command.answerLocation,
      identificationCode: command.identificationCode,
      completionMessage: command.completionMessage,
      clues: [],
      mission: {
        instruction: "Add mission instruction from admin editor.",
        photoRequirement: "Add photo requirement from admin editor.",
        caution: "Add caution note from admin editor.",
      },
    });

    await this.caseRepository.create(caseItem);
    return caseItem;
  }
}

