import { Injectable } from "@nestjs/common";
import {
  hashIdentificationCode,
  isIdentificationCodeHash,
  maskIdentificationCode,
  matchesIdentificationCode,
  normalizeIdentificationCode,
} from "../../../shared/infrastructure/identification-code.util";

@Injectable()
export class IdentificationCodeService {
  normalize(code: string) {
    return normalizeIdentificationCode(code);
  }

  hash(code: string) {
    return hashIdentificationCode(code);
  }

  isHash(value: string) {
    return isIdentificationCodeHash(value);
  }

  matches(rawCode: string, storedHashOrLegacyCode: string) {
    return matchesIdentificationCode(rawCode, storedHashOrLegacyCode);
  }

  mask(code: string) {
    return maskIdentificationCode(code);
  }
}
