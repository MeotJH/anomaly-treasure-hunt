import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  hashIdentificationCode,
  isIdentificationCodeHash,
  maskIdentificationCode,
} from "./identification-code.util";
import {
  serializeDate,
  serializeJson,
} from "./prisma-persistence.util";
import { createSeedCases } from "./sqlite-seed";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    this.ensureSqliteDirectory();
    await this.$connect();
    await this.$executeRawUnsafe("PRAGMA foreign_keys = ON;");
    await this.ensureSchemaReady();
    await this.migrateLegacySecrets();
    await this.syncSeedCases();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private ensureSqliteDirectory() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl || !databaseUrl.startsWith("file:")) {
      return;
    }

    const filePath = databaseUrl.slice("file:".length);
    const resolvedPath = resolve(process.cwd(), filePath);
    mkdirSync(dirname(resolvedPath), { recursive: true });
  }

  private async ensureSchemaReady() {
    try {
      await this.case.count();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2021") {
        throw new Error(
          "Prisma schema is not applied. Run `npm run prisma:db:push --workspace api` before starting the API.",
        );
      }

      throw error;
    }
  }

  private async syncSeedCases() {
    for (const seed of createSeedCases()) {
      await this.case.upsert({
        where: { id: seed.id },
        update: {
          fileNo: seed.fileNo,
          title: seed.title,
          episodeNo: seed.episodeNo,
          difficultyGrade: seed.difficultyGrade,
          representativeImageUrl: seed.representativeImageUrl,
          accessLevel: seed.accessLevel,
          status: seed.status,
          rewardName: seed.rewardName,
          summary: seed.summary,
          reportBody: seed.reportBody,
          safetyNotice: seed.safetyNotice,
          startsAt: serializeDate(seed.startsAt),
          endsAt: serializeDate(seed.endsAt),
          announcedAt: serializeDate(seed.announcedAt),
          answerLocation: seed.answerLocation,
          identificationCode: seed.identificationCodeHash,
          completionMessage: seed.completionMessage,
          cluesJson: serializeJson(seed.clues),
          missionInstruction: seed.mission.instruction,
          missionPhotoRequirement: seed.mission.photoRequirement,
          missionCaution: seed.mission.caution,
        },
        create: {
          id: seed.id,
          fileNo: seed.fileNo,
          title: seed.title,
          episodeNo: seed.episodeNo,
          difficultyGrade: seed.difficultyGrade,
          representativeImageUrl: seed.representativeImageUrl,
          accessLevel: seed.accessLevel,
          status: seed.status,
          rewardName: seed.rewardName,
          summary: seed.summary,
          reportBody: seed.reportBody,
          safetyNotice: seed.safetyNotice,
          startsAt: serializeDate(seed.startsAt),
          endsAt: serializeDate(seed.endsAt),
          announcedAt: serializeDate(seed.announcedAt),
          answerLocation: seed.answerLocation,
          identificationCode: seed.identificationCodeHash,
          completionMessage: seed.completionMessage,
          cluesJson: serializeJson(seed.clues),
          missionInstruction: seed.mission.instruction,
          missionPhotoRequirement: seed.mission.photoRequirement,
          missionCaution: seed.mission.caution,
        },
      });
    }
  }

  private async migrateLegacySecrets() {
    const cases = await this.case.findMany({
      select: {
        id: true,
        identificationCode: true,
      },
    });

    for (const caseItem of cases) {
      if (caseItem.identificationCode && !isIdentificationCodeHash(caseItem.identificationCode)) {
        await this.case.update({
          where: { id: caseItem.id },
          data: {
            identificationCode: hashIdentificationCode(caseItem.identificationCode),
          },
        });
      }
    }

    const reports = await this.report.findMany({
      select: {
        id: true,
        submittedCode: true,
        normalizedCode: true,
      },
    });

    for (const report of reports) {
      if (report.normalizedCode && !isIdentificationCodeHash(report.normalizedCode)) {
        await this.report.update({
          where: { id: report.id },
          data: {
            submittedCode: maskIdentificationCode(report.submittedCode || report.normalizedCode),
            normalizedCode: hashIdentificationCode(report.normalizedCode),
          },
        });
      }
    }
  }
}
