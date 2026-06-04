import { Injectable } from "@nestjs/common";

@Injectable()
export class IdentificationCodeService {
  normalize(code: string) {
    return code.trim().toUpperCase().replace(/\s+/g, "");
  }
}

