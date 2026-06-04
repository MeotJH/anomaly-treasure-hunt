import { Module } from "@nestjs/common";
import { AdminModule } from "./modules/admin/admin.module";
import { CasesModule } from "./modules/cases/cases.module";
import { ReportsModule } from "./modules/reports/reports.module";

@Module({
  imports: [CasesModule, ReportsModule, AdminModule],
})
export class AppModule {}

