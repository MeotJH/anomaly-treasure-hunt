import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";

const HASH_PATTERN = /^[a-f0-9]{64}$/i;

@Injectable()
export class IdentificationCodeService {
  normalize(code: string) {
    return code.trim().toUpperCase().replace(/\s+/g, "");
  }

  hash(code: string) {
    const normalizedCode = this.normalize(code);
    return createHash("sha256").update(normalizedCode).digest("hex");
  }

  isHash(value: string) {
    return HASH_PATTERN.test(value);
  }

  matches(rawCode: string, storedHashOrLegacyCode: string) {
    if (this.isHash(storedHashOrLegacyCode)) {
      return this.hash(rawCode) === storedHashOrLegacyCode;
    }

    return this.normalize(rawCode) === this.normalize(storedHashOrLegacyCode);
  }

  mask(code: string) {
    const normalizedCode = this.normalize(code);

    if (normalizedCode.length <= 4) {
      return "*".repeat(normalizedCode.length);
    }

    return `${normalizedCode.slice(0, 2)}${"*".repeat(normalizedCode.length - 4)}${normalizedCode.slice(-2)}`;
  }
}
