import { Inject, Injectable } from "@nestjs/common";
import { CASE_REPOSITORY } from "../../../cases/cases.tokens";
import {
  InvestigationCase,
  InvestigationCaseProps,
} from "../../../cases/domain/entities/case.entity";
import { CaseRepository } from "../../../cases/domain/repositories/case.repository";
import { IdentificationCodeService } from "../../../reports/application/services/identification-code.service";
import { buildLegacyScheduleForStatus } from "./legacy-case-schedule";

export interface CreateAdminCaseCommand {
  fileNo: string;
  title: string;
  difficultyGrade: InvestigationCaseProps["difficultyGrade"];
  representativeImageUrl?: string;
  accessLevel: string;
  status: InvestigationCaseProps["status"];
  rewardName: string;
  summary: string;
  reportBody: string;
  safetyNotice: string;
  answerLocation: string;
  identificationCode: string;
  completionMessage: string;
  clues: InvestigationCaseProps["clues"];
  mission: InvestigationCaseProps["mission"];
}

@Injectable()
export class CreateAdminCaseUseCase {
  constructor(
    @Inject(CASE_REPOSITORY)
    private readonly caseRepository: CaseRepository,
    @Inject(IdentificationCodeService)
    private readonly identificationCodeService: IdentificationCodeService,
  ) {}

  async execute(command: CreateAdminCaseCommand) {
    const existingCases = await this.caseRepository.findAll();
    const schedule = buildLegacyScheduleForStatus(command.status);
    const caseItem = new InvestigationCase({
      id: `case-${Date.now()}`,
      fileNo: command.fileNo,
      title: command.title,
      episodeNo: existingCases.length + 1,
      difficultyGrade: command.difficultyGrade,
      representativeImageUrl: command.representativeImageUrl?.trim() || null,
      accessLevel: command.accessLevel,
      status: command.status,
      rewardName: command.rewardName,
      summary: command.summary,
      reportBody: command.reportBody,
      safetyNotice: command.safetyNotice,
      startsAt: schedule.startsAt,
      endsAt: schedule.endsAt,
      announcedAt: schedule.announcedAt,
      answerLocation: command.answerLocation,
      identificationCodeHash: this.identificationCodeService.hash(command.identificationCode),
      completionMessage: command.completionMessage,
      clues: command.clues,
      mission: command.mission,
    });

    await this.caseRepository.create(caseItem);
    return caseItem;
  }
}
