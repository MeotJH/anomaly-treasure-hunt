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
    private readonly identificationCodeService: IdentificationCodeService,
  ) {}

  async execute(command: SubmitReportCommand) {
    const now = new Date();
    const caseItem = await this.caseRepository.findById(command.caseId);

    if (!caseItem) {
      throw new NotFoundException(`Case ${command.caseId} was not found.`);
    }

    if (!caseItem.isReportOpen(now)) {
      throw new BadRequestException("This case is not accepting reports.");
    }

    const approvedReport = await this.reportRepository.findApprovedByCaseAndUser(
      command.caseId,
      command.userId,
    );

    if (approvedReport) {
      throw new ConflictException("An approved report already exists for this case.");
    }

    const submissionCount = await this.reportRepository.countByCaseAndUser(
      command.caseId,
      command.userId,
    );

    if (submissionCount >= 5) {
      throw new HttpException(
        "Submission limit reached for this case.",
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
      message:
        "보고가 접수되었습니다. 검토 후 추첨 대상 등록 여부가 확정됩니다.",
    };
  }
}
