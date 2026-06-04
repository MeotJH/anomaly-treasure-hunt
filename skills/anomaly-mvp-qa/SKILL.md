---
name: anomaly-mvp-qa
description: QA harness for the anomaly investigation MVP. Use when Codex needs to derive tests, review implementation against `anomaly-treasure-hunt-prd.md`, find regressions, assess release risk, or validate user/admin flows for the QA role.
---

# Anomaly MVP QA

Read [../../anomaly-treasure-hunt-prd.md](../../anomaly-treasure-hunt-prd.md), then apply [../../agents/qa/AGENTS.md](../../agents/qa/AGENTS.md). Use [references/checklist.md](references/checklist.md) to derive coverage and report risks consistently.

## Workflow

1. Map acceptance criteria to flows and states.
2. Check user, admin, and security boundaries.
3. Stress duplicate, expired, malformed, and rejected scenarios.
4. Review release readiness and missing observability.
5. Report findings by severity with evidence.

## QA Lens

- Submission correctness and review correctness come first.
- Permission leaks and privacy failures are blockers.
- Mobile readability matters because the product is text-heavy.
- Excluded features should not appear accidentally through partial implementations.

## Output Contract

Produce:

1. Findings first.
2. Open questions or assumptions second.
3. Brief change/risk summary last.

## Working Rules

- Include route, role, and timing context in each finding.
- Prefer reproducible steps over generic concerns.
- Call out missing seed data or testability gaps explicitly.
- If no findings are present, state that and mention residual risks.
