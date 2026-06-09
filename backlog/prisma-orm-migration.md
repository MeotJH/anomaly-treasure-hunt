# Prisma ORM Migration Backlog

## Scope Summary
- Replace API-side direct SQL repositories with Prisma-based repositories.
- Keep the existing anomaly-investigation MVP behavior unchanged while changing persistence implementation.
- Preserve server-side code hashing, manual review, admin-only photo access, and winner draw rules.

## Priority
1. Add Prisma schema for `cases`, `reports`, and `winners`.
2. Replace shared SQLite bootstrap with a Prisma client service.
3. Refactor case/report repositories from raw SQL to Prisma queries.
4. Keep seed data and local developer startup path working after the migration.
5. Verify build stability and document required environment/runtime changes.

## Acceptance Criteria
- API no longer imports or uses `node:sqlite` for case/report persistence.
- Repository bindings resolve to Prisma-backed implementations.
- Existing use cases for case listing, report submission, review, and winner selection still compile without contract changes.
- Identification codes remain hashed server-side only and are never returned in client-facing payloads.
- A developer can generate Prisma client and build the API successfully.

## Risks And Notes
- Existing local SQLite data may need a one-time reset or migration path depending on Prisma provider choice.
- Seed content must continue to write hashed identification codes only.
- Winner uniqueness by case and duplicate submission checks must stay enforced in repository behavior.
