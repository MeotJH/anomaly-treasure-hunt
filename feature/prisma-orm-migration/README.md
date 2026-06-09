# Prisma ORM Migration

## Goal
- Move the backend repository layer from direct SQL execution to Prisma ORM.
- Keep the current MVP contracts and investigation flow intact.

## Status
- Implemented

## Delivered Changes
- Added Prisma dependencies, client generation, and `db push` scripts in `apps/api`.
- Added Prisma schema and seed entrypoints for `Case`, `Report`, and `Winner`.
- Replaced `sqlite` runtime wiring with a shared `PrismaService`.
- Replaced raw SQL case/report repositories with Prisma-backed repositories.
- Preserved existing repository contracts and domain entity mapping.
- Kept identification code hashing, masking, and legacy-secret migration on the server side.
- Updated local start scripts to sync Prisma schema before boot.

## Verification
- `npm run prisma:generate --workspace api`
- `npm run prisma:db:push --workspace api`
- `npm run build --workspace api`
- Prisma client query against local SQLite confirmed case data is readable.

## Remaining Follow-up
- DevOps: review deployment/runtime packaging for Prisma engine files.
- QA: regression-test report submission, admin review, draw, and local startup flows.
