import { IsDateString, IsIn, IsOptional, IsString } from "class-validator";

export class UpdateAdminCaseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  accessLevel?: string;

  @IsOptional()
  @IsIn(["draft", "published", "closed", "announced"])
  status?: "draft" | "published" | "closed" | "announced";

  @IsOptional()
  @IsString()
  rewardName?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  reportBody?: string;

  @IsOptional()
  @IsString()
  safetyNotice?: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsDateString()
  announcedAt?: string;

  @IsOptional()
  @IsString()
  answerLocation?: string;

  @IsOptional()
  @IsString()
  identificationCode?: string;

  @IsOptional()
  @IsString()
  completionMessage?: string;
}

