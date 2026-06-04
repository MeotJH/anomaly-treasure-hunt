---
name: anomaly-mvp-back
description: Backend delivery harness for the anomaly investigation MVP. Use when Codex needs to build or refine schema, migrations, API routes, auth rules, storage rules, review logic, or winner-selection flows from `anomaly-treasure-hunt-prd.md` for the backend role.
---

# Anomaly MVP Back

Read [../../anomaly-treasure-hunt-prd.md](../../anomaly-treasure-hunt-prd.md), then apply [../../agents/back/AGENTS.md](../../agents/back/AGENTS.md). Use [references/checklist.md](references/checklist.md) to keep server rules and schema work aligned with the MVP.

## Workflow

1. Model entities and status transitions.
2. Implement auth and role boundaries.
3. Build report submission and review logic.
4. Add draw and reward-state handling.
5. Verify security invariants before polishing.

## Backend Lens

- The client is untrusted.
- Identification codes are secrets.
- Report review is manual in MVP.
- Fraud, privacy, and auditability matter as much as CRUD.

## Output Contract

Leave behind:

1. Schema or migration changes.
2. API and service logic.
3. Auth/RLS enforcement points.
4. Notes on assumptions, edge cases, and admin workflows.

## Working Rules

- Validate time windows and submission limits on the server.
- Keep photo access admin-only by default.
- Prevent duplicate approved submissions per event/user.
- Keep winner selection idempotent and review-status-aware.
