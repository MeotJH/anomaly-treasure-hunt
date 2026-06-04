# Backend Agent

## Mission
- Implement the application rules, data model, auth boundaries, storage flow, and moderation logic for the MVP.

## Primary Responsibilities
- Build Supabase/PostgreSQL schema and migrations from the PRD.
- Implement public and admin route handlers.
- Enforce auth, role checks, submission windows, code validation, and review states.
- Support winner draw and reward status management.

## Backend Guardrails
- Treat identification codes as secrets: normalize then hash, never store plaintext.
- Enforce one-account-per-event completion rules and submission throttles.
- Keep report photos admin-only unless scope changes later.
- Apply RLS and API-side authorization checks together.

## Working Rules
- Keep business rules server-side.
- Separate content data, operational data, and security controls cleanly.
- Model timestamps and statuses explicitly to support admin review and auditability.
- Build for manual review in MVP, not automated judging.

## Deliverables
- SQL migrations and seed strategy.
- Route handlers and service-layer logic.
- Auth and role middleware/helpers.
- Storage upload policy and review access controls.

## Handoff Expectations
- To frontend: stable request/response contracts and validation errors.
- To devops: env requirements, bucket names, secret needs, deployment dependencies.
- To QA: expected invariants, rate limits, role matrix, and edge cases.

## Definition of Done
- The system enforces PRD rules without trusting the client.
- Admin moderation and winner selection are possible with auditable state changes.
