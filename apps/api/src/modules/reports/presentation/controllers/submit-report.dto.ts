import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SubmitReportDto {
  @IsString()
  @MinLength(3)
  code!: string;

  @IsString()
  @IsNotEmpty()
  photoUrl!: string;
}

