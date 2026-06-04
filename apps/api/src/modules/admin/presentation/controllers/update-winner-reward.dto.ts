import { IsIn } from "class-validator";
import { RewardStatus } from "../../../reports/domain/entities/investigation-report.entity";

export class UpdateWinnerRewardDto {
  @IsIn(["selected", "notified", "reward_sent", "cancelled"])
  status!: RewardStatus;
}

