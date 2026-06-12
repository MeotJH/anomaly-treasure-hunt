import { Prisma } from "@prisma/client";
import { Inject, Injectable } from "@nestjs/common";
import {
  InvestigationCase,
  InvestigationCaseProps,
} from "../../domain/entities/case.entity";
import { CaseRepository } from "../../domain/repositories/case.repository";
import {
  deserializeDate,
  deserializeJson,
  serializeDate,
  serializeJson,
} from "../../../shared/infrastructure/prisma-persistence.util";
import { PrismaService } from "../../../shared/infrastructure/prisma.service";
import { compareCaseListOrder } from "./case-list-order";

type PrismaCaseRecord = Prisma.CaseGetPayload<Record<string, never>>;

@Injectable()
export class PrismaCaseRepository implements CaseRepository {
  constructor(@Inject(PrismaService) private readonly prismaService: PrismaService) {}

  async findCurrent() {
    const current = (await this.findVisible()).find((caseItem) => caseItem.isCurrentCase());
    return current ?? null;
  }

  async findVisible() {
    const rows = await this.prismaService.case.findMany({
      where: {
        status: {
          not: "draft",
        },
      },
      orderBy: {
        episodeNo: "desc",
      },
    });

    return rows.sort(compareCaseListOrder).map((row) => this.mapRow(row));
  }

  async findAll() {
    const rows = await this.prismaService.case.findMany({
      orderBy: {
        episodeNo: "desc",
      },
    });

    return rows.map((row) => this.mapRow(row));
  }

  async findById(caseId: string) {
    const row = await this.prismaService.case.findUnique({
      where: { id: caseId },
    });

    return row ? this.mapRow(row) : null;
  }

  async create(caseItem: InvestigationCase) {
    const snapshot = caseItem.toSnapshot();
    await this.prismaService.case.create({
      data: this.toPersistenceInput(snapshot),
    });
  }

  async update(
    caseId: string,
    next: Partial<ReturnType<InvestigationCase["toSnapshot"]>>,
  ) {
    const current = await this.findById(caseId);

    if (!current) {
      throw new Error(`Case ${caseId} was not found.`);
    }

    const snapshot = { ...current.toSnapshot(), ...next };

    const updated = await this.prismaService.case.update({
      where: { id: caseId },
      data: this.toPersistenceInput(snapshot),
    });

    return this.mapRow(updated);
  }

  private toPersistenceInput(snapshot: InvestigationCaseProps): Prisma.CaseUncheckedCreateInput {
    return {
      id: snapshot.id,
      fileNo: snapshot.fileNo,
      title: snapshot.title,
      episodeNo: snapshot.episodeNo,
      difficultyGrade: snapshot.difficultyGrade,
      representativeImageUrl: snapshot.representativeImageUrl,
      accessLevel: snapshot.accessLevel,
      status: snapshot.status,
      rewardName: snapshot.rewardName,
      summary: snapshot.summary,
      reportBody: snapshot.reportBody,
      safetyNotice: snapshot.safetyNotice,
      startsAt: serializeDate(snapshot.startsAt),
      endsAt: serializeDate(snapshot.endsAt),
      announcedAt: serializeDate(snapshot.announcedAt),
      answerLocation: snapshot.answerLocation,
      identificationCode: snapshot.identificationCodeHash,
      completionMessage: snapshot.completionMessage,
      cluesJson: serializeJson(snapshot.clues),
      missionInstruction: snapshot.mission.instruction,
      missionPhotoRequirement: snapshot.mission.photoRequirement,
      missionCaution: snapshot.mission.caution,
    };
  }

  private mapRow(row: PrismaCaseRecord) {
    return new InvestigationCase({
      id: row.id,
      fileNo: row.fileNo,
      title: row.title,
      episodeNo: row.episodeNo,
      difficultyGrade: row.difficultyGrade as InvestigationCaseProps["difficultyGrade"],
      representativeImageUrl: row.representativeImageUrl,
      accessLevel: row.accessLevel,
      status: row.status as InvestigationCaseProps["status"],
      rewardName: row.rewardName,
      summary: row.summary,
      reportBody: row.reportBody,
      safetyNotice: row.safetyNotice,
      startsAt: deserializeDate(row.startsAt),
      endsAt: deserializeDate(row.endsAt),
      announcedAt: deserializeDate(row.announcedAt),
      answerLocation: row.answerLocation,
      identificationCodeHash: row.identificationCode,
      completionMessage: row.completionMessage,
      clues: deserializeJson<InvestigationCaseProps["clues"]>(row.cluesJson),
      mission: {
        instruction: row.missionInstruction,
        photoRequirement: row.missionPhotoRequirement,
        caution: row.missionCaution,
      },
    });
  }
}
