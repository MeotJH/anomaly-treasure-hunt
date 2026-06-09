import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CASE_REPOSITORY } from "../../../cases/cases.tokens";
import { InvestigationCaseProps } from "../../../cases/domain/entities/case.entity";
import { CaseRepository } from "../../../cases/domain/repositories/case.repository";
import { IdentificationCodeService } from "../../../reports/application/services/identification-code.service";

export type UpdateAdminCaseCommand = Partial<{
  title: string;
  difficultyGrade: InvestigationCaseProps["difficultyGrade"];
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

    return this.caseRepository.update(caseId, {
      ...("title" in command ? { title: command.title } : {}),
      ...("difficultyGrade" in command ? { difficultyGrade: command.difficultyGrade } : {}),
      ...("accessLevel" in command ? { accessLevel: command.accessLevel } : {}),
      ...("status" in command ? { status: command.status } : {}),
      ...("rewardName" in command ? { rewardName: command.rewardName } : {}),
      ...("summary" in command ? { summary: command.summary } : {}),
      ...("reportBody" in command ? { reportBody: command.reportBody } : {}),
      ...("safetyNotice" in command ? { safetyNotice: command.safetyNotice } : {}),
      ...("startsAt" in command ? { startsAt: new Date(command.startsAt!) } : {}),
      ...("endsAt" in command ? { endsAt: new Date(command.endsAt!) } : {}),
      ...("announcedAt" in command ? { announcedAt: new Date(command.announcedAt!) } : {}),
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
