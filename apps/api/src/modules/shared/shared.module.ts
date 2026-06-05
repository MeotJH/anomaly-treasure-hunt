import { Global, Module } from "@nestjs/common";
import { SqliteDatabase } from "./infrastructure/sqlite-database";

@Global()
@Module({
  providers: [SqliteDatabase],
  exports: [SqliteDatabase],
})
export class SharedModule {}

