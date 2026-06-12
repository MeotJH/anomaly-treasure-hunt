import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
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
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}

class AdminMissionDto {
  @IsString()
  @IsNotEmpty()
  instruction!: string;

  @IsString()
  @IsNotEmpty()
  photoRequirement!: string;

  @IsString()
  @IsNotEmpty()
  caution!: string;
}

export class CreateAdminCaseDto {
  @IsString()
  @IsNotEmpty()
  fileNo!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsIn(["F", "E", "D", "C", "B", "A", "S"])
  difficultyGrade!: "F" | "E" | "D" | "C" | "B" | "A" | "S";

  @IsOptional()
  @IsString()
  representativeImageUrl?: string;

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

  @IsString()
  @IsNotEmpty()
  answerLocation!: string;

  @IsString()
  @IsNotEmpty()
  identificationCode!: string;

  @IsString()
  @IsNotEmpty()
  completionMessage!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AdminCaseClueDto)
  clues!: AdminCaseClueDto[];

  @ValidateNested()
  @Type(() => AdminMissionDto)
  mission!: AdminMissionDto;
}
