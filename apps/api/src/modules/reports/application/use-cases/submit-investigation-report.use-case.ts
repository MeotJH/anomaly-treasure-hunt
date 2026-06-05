import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CASE_REPOSITORY } from "../../../cases/cases.tokens";
import { CaseRepository } from "../../../cases/domain/repositories/case.repository";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../reports.tokens";
import { InvestigationReport } from "../../domain/entities/investigation-report.entity";
import { InvestigationReportRepository } from "../../domain/repositories/investigation-report.repository";
import { IdentificationCodeService } from "../services/identification-code.service";

interface SubmitReportCommand {
  caseId: string;
  userId: string;
  code: string;
  photoUrl: string;
}

@Injectable()
export class SubmitInvestigationReportUseCase {
  constructor(
    @Inject(CASE_REPOSITORY)
    private readonly caseRepository: CaseRepository,
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
    @Inject(IdentificationCodeService)
    private readonly identificationCodeService: IdentificationCodeService,
  ) {}

  async execute(command: SubmitReportCommand) {
    const now = new Date();
    const caseItem = await this.caseRepository.findById(command.caseId);

    if (!caseItem) {
      throw new NotFoundException(`사건 문서 ${command.caseId}를 찾을 수 없습니다.`);
    }

    if (!caseItem.isReportOpen(now)) {
      throw new BadRequestException("이 사건은 현재 제보를 받고 있지 않습니다.");
    }

    const approvedReport = await this.reportRepository.findApprovedByCaseAndUser(
      command.caseId,
      command.userId,
    );

    if (approvedReport) {
      throw new ConflictException("이미 승인된 제보가 있어 추가 제출할 수 없습니다.");
    }

    const submissionCount = await this.reportRepository.countByCaseAndUser(
      command.caseId,
      command.userId,
    );

    if (submissionCount >= 5) {
      throw new HttpException(
        "이 사건에 대한 제보 가능 횟수를 모두 사용했습니다.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const normalizedCode = this.identificationCodeService.normalize(command.code);
    const isCodeCorrect =
      normalizedCode === this.identificationCodeService.normalize(caseItem.identificationCode);

    const report = new InvestigationReport({
      id: `report-${Date.now()}-${submissionCount + 1}`,
      caseId: command.caseId,
      userId: command.userId,
      submittedCode: command.code,
      normalizedCode,
      photoUrl: command.photoUrl,
      isCodeCorrect,
      reviewStatus: "pending",
      rejectionReason: null,
      submittedAt: now,
      reviewedAt: null,
    });

    await this.reportRepository.create(report);

    return {
      isCodeCorrect,
      reviewStatus: report.reviewStatus,
      message: "제보가 접수되었습니다. 검토가 끝나면 기록 상태가 갱신됩니다.",
    };
  }
}
