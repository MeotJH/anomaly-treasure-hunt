import "../src/load-env";
import { PrismaClient } from "@prisma/client";
import { createSeedCases } from "../src/modules/shared/infrastructure/sqlite-seed";
import {
  serializeDate,
  serializeJson,
} from "../src/modules/shared/infrastructure/prisma-persistence.util";

const prisma = new PrismaClient();

async function main() {
  for (const seed of createSeedCases()) {
    await prisma.case.upsert({
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

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
