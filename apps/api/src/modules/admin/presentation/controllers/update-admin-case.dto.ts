import { Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class AdminCaseClueDto {
  @Type(() => Number)
  @IsNumber()
  order!: number;

  @IsString()
  title!: string;

  @IsString()
  content!: string;
}

class AdminMissionDto {
  @IsString()
  instruction!: string;

  @IsString()
  photoRequirement!: string;

  @IsString()
  caution!: string;
}

export class UpdateAdminCaseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsIn(["F", "E", "D", "C", "B", "A", "S"])
  difficultyGrade?: "F" | "E" | "D" | "C" | "B" | "A" | "S";

  @IsOptional()
  @IsString()
  representativeImageUrl?: string;

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
  @IsString()
  answerLocation?: string;

  @IsOptional()
  @IsString()
  identificationCode?: string;

  @IsOptional()
  @IsString()
  completionMessage?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminCaseClueDto)
  clues?: AdminCaseClueDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => AdminMissionDto)
  mission?: AdminMissionDto;
}
