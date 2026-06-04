import { IsIn, IsOptional, IsString } from "class-validator";

export class ReviewReportDto {
  @IsIn(["approved", "rejected"])
  reviewStatus!: "approved" | "rejected";

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

