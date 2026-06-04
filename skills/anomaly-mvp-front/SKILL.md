---
name: anomaly-mvp-front
description: Frontend delivery harness for the anomaly investigation MVP. Use when Codex needs to build or refine Next.js App Router pages, components, styling, user flows, or admin screens from `anomaly-treasure-hunt-prd.md` for the frontend role.
---

# Anomaly MVP Front

Read [../../anomaly-treasure-hunt-prd.md](../../anomaly-treasure-hunt-prd.md), then apply [../../agents/front/AGENTS.md](../../agents/front/AGENTS.md). Use [references/checklist.md](references/checklist.md) to stay aligned with routing, states, and implementation priorities.

## Workflow

1. Confirm the route and component scope.
2. Implement user flow before admin extras.
3. Add edge-state coverage for each page.
4. Connect forms and status views to backend contracts.
5. Verify responsive behavior and readability.

## Frontend Lens

- Prioritize the case reading and report submission loop.
- Preserve the archive feel with disciplined UI, not gimmicks.
- Keep server-first rendering and simple state unless interactivity requires more.

## Output Contract

When doing implementation work, leave behind:

1. Route/page changes.
2. Component changes.
3. Form and state handling.
4. Notes about API assumptions or blockers.

## Working Rules

- Never expose answer locations or code secrets in the client.
- Implement failure states explicitly.
- Keep admin and user views separated cleanly.
- Prefer composable sections from the PRD component list where practical.
