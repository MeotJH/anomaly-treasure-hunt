import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CASE_REPOSITORY } from "../../../cases/cases.tokens";
import { CaseRepository } from "../../../cases/domain/repositories/case.repository";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../reports.tokens";
import { InvestigationReport } from "../../domain/entities/investigation-report.entity";
import { InvestigationReportRepository } from "../../domain/repositories/investigation-report.repository";
import { EvidencePhotoCorruptionService } from "../services/evidence-photo-corruption.service";
import { IdentificationCodeService } from "../services/identification-code.service";

interface SubmitReportCommand {
  caseId: string;
  userId: string;
  code: string;
  photoUrl: string;
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const storageBucket =
  process.env.SUPABASE_STORAGE_BUCKET ??
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ??
  "evidence-photos";
const storagePathPrefix = "reports/";

@Injectable()
export class SubmitInvestigationReportUseCase {
  private readonly logger = new Logger(SubmitInvestigationReportUseCase.name);

  constructor(
    @Inject(CASE_REPOSITORY)
    private readonly caseRepository: CaseRepository,
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
    @Inject(EvidencePhotoCorruptionService)
    private readonly evidencePhotoCorruptionService: EvidencePhotoCorruptionService,
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
      throw new ConflictException("이미 확인된 제보가 있어 추가 제출할 수 없습니다.");
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
    const normalizedPhotoUrl = command.photoUrl.trim();

    if (!normalizedCode) {
      throw new BadRequestException("식별 코드를 비워둘 수 없습니다.");
    }

    if (!supabaseUrl) {
      throw new BadRequestException("Supabase 저장소 설정이 올바르지 않습니다.");
    }

    if (
      !normalizedPhotoUrl.startsWith(storagePathPrefix) ||
      !new RegExp(`^${storagePathPrefix}[a-z0-9-]+/[a-z0-9-]+\\.[a-z0-9]+$`, "i").test(
        normalizedPhotoUrl,
      )
    ) {
      throw new BadRequestException("증거 사진 저장 경로가 올바르지 않습니다.");
    }

    const normalizedCodeHash = this.identificationCodeService.hash(normalizedCode);
    const isCodeCorrect = this.identificationCodeService.matches(
      normalizedCode,
      caseItem.identificationCodeHash,
    );
    const reportId = `report-${Date.now()}-${submissionCount + 1}`;
    let displayPhotoUrl: string | null = null;

    try {
      displayPhotoUrl = await this.evidencePhotoCorruptionService.createDisplayVariant(
        normalizedPhotoUrl,
        reportId,
      );
    } catch (error) {
      this.logger.warn(
        `열람용 오염 사본 생성에 실패했습니다. 원본만 저장합니다. (${normalizedPhotoUrl}) ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    }

    const report = new InvestigationReport({
      id: reportId,
      caseId: command.caseId,
      userId: command.userId,
      submittedCodeMask: this.identificationCodeService.mask(normalizedCode),
      normalizedCodeHash,
      photoUrl: normalizedPhotoUrl,
      displayPhotoUrl,
      isCodeCorrect,
      reviewStatus: "pending",
      rejectionReason: null,
      submittedAt: now,
      reviewedAt: null,
    });

    try {
      await this.reportRepository.create(report);
    } catch (error) {
      await this.evidencePhotoCorruptionService.removeDisplayVariant(displayPhotoUrl);
      throw error;
    }

    return {
      isCodeCorrect,
      reviewStatus: report.reviewStatus,
      message: "제보가 접수되었습니다. 검토가 끝나면 기록 상태가 갱신됩니다.",
    };
  }
}
