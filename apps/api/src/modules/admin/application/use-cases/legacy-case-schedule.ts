import { InvestigationCaseProps } from "../../../cases/domain/entities/case.entity";

const LEGACY_PAST_DATE = new Date("2000-01-01T00:00:00.000Z");
const LEGACY_FUTURE_DATE = new Date("9999-12-31T23:59:59.999Z");

export function buildLegacyScheduleForStatus(
  status: InvestigationCaseProps["status"],
) {
  switch (status) {
    case "published":
      return {
        startsAt: LEGACY_PAST_DATE,
        endsAt: LEGACY_FUTURE_DATE,
        announcedAt: LEGACY_FUTURE_DATE,
      };
    case "announced":
      return {
        startsAt: LEGACY_PAST_DATE,
        endsAt: LEGACY_PAST_DATE,
        announcedAt: LEGACY_PAST_DATE,
      };
    case "closed":
      return {
        startsAt: LEGACY_PAST_DATE,
        endsAt: LEGACY_PAST_DATE,
        announcedAt: LEGACY_FUTURE_DATE,
      };
    default:
      return {
        startsAt: LEGACY_FUTURE_DATE,
        endsAt: LEGACY_FUTURE_DATE,
        announcedAt: LEGACY_FUTURE_DATE,
      };
  }
}
