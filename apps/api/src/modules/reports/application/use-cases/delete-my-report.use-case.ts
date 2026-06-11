import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { INVESTIGATION_REPORT_REPOSITORY } from "../../reports.tokens";
import { InvestigationReportRepository } from "../../domain/repositories/investigation-report.repository";
import { EvidencePhotoCorruptionService } from "../services/evidence-photo-corruption.service";

@Injectable()
export class DeleteMyReportUseCase {
  constructor(
    @Inject(INVESTIGATION_REPORT_REPOSITORY)
    private readonly reportRepository: InvestigationReportRepository,
    @Inject(EvidencePhotoCorruptionService)
    private readonly evidencePhotoCorruptionService: EvidencePhotoCorruptionService,
  ) {}

  async execute(reportId: string, userId: string) {
    const report = await this.reportRepository.findById(reportId);

    if (!report || report.userId !== userId) {
      throw new NotFoundException("삭제할 제보 기록을 찾을 수 없습니다.");
    }

    if (report.reviewStatus === "approved") {
      throw new BadRequestException("승인된 제보는 삭제할 수 없습니다.");
    }

    await this.reportRepository.delete(reportId);
    await Promise.allSettled([
      this.evidencePhotoCorruptionService.removeDisplayVariant(report.photoUrl),
      this.evidencePhotoCorruptionService.removeDisplayVariant(report.displayPhotoUrl),
    ]);

    return {
      message: "제보 기록이 삭제되었습니다.",
    };
  }
}
