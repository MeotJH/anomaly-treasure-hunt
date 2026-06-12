import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CASE_REPOSITORY } from "../../../cases/cases.tokens";
import { InvestigationCaseProps } from "../../../cases/domain/entities/case.entity";
import { CaseRepository } from "../../../cases/domain/repositories/case.repository";
import { IdentificationCodeService } from "../../../reports/application/services/identification-code.service";
import { buildLegacyScheduleForStatus } from "./legacy-case-schedule";

export type UpdateAdminCaseCommand = Partial<{
  title: string;
  difficultyGrade: InvestigationCaseProps["difficultyGrade"];
  representativeImageUrl: string;
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
}>;

@Injectable()
export class UpdateAdminCaseUseCase {
  constructor(
    @Inject(CASE_REPOSITORY)
    private readonly caseRepository: CaseRepository,
    @Inject(IdentificationCodeService)
    private readonly identificationCodeService: IdentificationCodeService,
  ) {}

  async execute(caseId: string, command: UpdateAdminCaseCommand) {
    const caseItem = await this.caseRepository.findById(caseId);

    if (!caseItem) {
      throw new NotFoundException(`사건 문서 ${caseId}를 찾을 수 없습니다.`);
    }

    const nextStatus = "status" in command && command.status ? command.status : caseItem.status;
    const schedule = buildLegacyScheduleForStatus(nextStatus);

    return this.caseRepository.update(caseId, {
      ...("title" in command ? { title: command.title } : {}),
      ...("difficultyGrade" in command ? { difficultyGrade: command.difficultyGrade } : {}),
      ...("representativeImageUrl" in command
        ? { representativeImageUrl: command.representativeImageUrl?.trim() || null }
        : {}),
      ...("accessLevel" in command ? { accessLevel: command.accessLevel } : {}),
      ...("status" in command ? { status: command.status } : {}),
      ...("rewardName" in command ? { rewardName: command.rewardName } : {}),
      ...("summary" in command ? { summary: command.summary } : {}),
      ...("reportBody" in command ? { reportBody: command.reportBody } : {}),
      ...("safetyNotice" in command ? { safetyNotice: command.safetyNotice } : {}),
      startsAt: schedule.startsAt,
      endsAt: schedule.endsAt,
      announcedAt: schedule.announcedAt,
      ...("answerLocation" in command ? { answerLocation: command.answerLocation } : {}),
      ...("identificationCode" in command
        ? {
            identificationCodeHash: this.identificationCodeService.hash(
              command.identificationCode!,
            ),
          }
        : {}),
      ...("completionMessage" in command ? { completionMessage: command.completionMessage } : {}),
      ...("clues" in command ? { clues: command.clues } : {}),
      ...("mission" in command ? { mission: command.mission } : {}),
    });
  }
}
