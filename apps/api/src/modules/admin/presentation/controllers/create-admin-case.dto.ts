import { IsDateString, IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateAdminCaseDto {
  @IsString()
  @IsNotEmpty()
  fileNo!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  accessLevel!: string;

  @IsIn(["draft", "published", "closed", "announced"])
  status!: "draft" | "published" | "closed" | "announced";

  @IsString()
  @IsNotEmpty()
  rewardName!: string;

  @IsString()
  @IsNotEmpty()
  summary!: string;

  @IsString()
  @IsNotEmpty()
  reportBody!: string;

  @IsString()
  @IsNotEmpty()
  safetyNotice!: string;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsDateString()
  announcedAt!: string;

  @IsString()
  @IsNotEmpty()
  answerLocation!: string;

  @IsString()
  @IsNotEmpty()
  identificationCode!: string;

  @IsString()
  @IsNotEmpty()
  completionMessage!: string;
}

