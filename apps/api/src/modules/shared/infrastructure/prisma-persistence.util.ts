export function serializeDate(value: Date) {
  return value.toISOString();
}

export function deserializeDate(value: string) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? new Date(timestamp) : new Date(value);
}

export function serializeJson(value: unknown) {
  return JSON.stringify(value);
}

export function deserializeJson<T>(value: string) {
  return JSON.parse(value) as T;
}

export function serializeBoolean(value: boolean) {
  return value ? 1 : 0;
}

export function deserializeBoolean(value: number) {
  return value === 1;
}
