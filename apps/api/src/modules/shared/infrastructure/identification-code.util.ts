import { createHash } from "node:crypto";

const HASH_PATTERN = /^[a-f0-9]{64}$/i;

export function normalizeIdentificationCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export function hashIdentificationCode(code: string) {
  return createHash("sha256").update(normalizeIdentificationCode(code)).digest("hex");
}

export function isIdentificationCodeHash(value: string) {
  return HASH_PATTERN.test(value);
}

export function maskIdentificationCode(code: string) {
  const normalizedCode = normalizeIdentificationCode(code);

  if (normalizedCode.length <= 4) {
    return "*".repeat(normalizedCode.length);
  }

  return `${normalizedCode.slice(0, 2)}${"*".repeat(normalizedCode.length - 4)}${normalizedCode.slice(-2)}`;
}

export function matchesIdentificationCode(rawCode: string, storedHashOrLegacyCode: string) {
  if (isIdentificationCodeHash(storedHashOrLegacyCode)) {
    return hashIdentificationCode(rawCode) === storedHashOrLegacyCode;
  }

  return normalizeIdentificationCode(rawCode) === normalizeIdentificationCode(storedHashOrLegacyCode);
}
