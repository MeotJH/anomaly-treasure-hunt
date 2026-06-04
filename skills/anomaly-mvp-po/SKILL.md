---
name: anomaly-mvp-po
description: Product ownership harness for the anomaly investigation MVP. Use when Codex needs to turn `anomaly-treasure-hunt-prd.md` into MVP scope, prioritized backlog, user stories, acceptance criteria, release decisions, or cross-functional tradeoffs for the PO role.
---

# Anomaly MVP PO

Read [../../anomaly-treasure-hunt-prd.md](../../anomaly-treasure-hunt-prd.md), then apply [../../agents/po/AGENTS.md](../../agents/po/AGENTS.md). Use [references/checklist.md](references/checklist.md) when turning the PRD into execution artifacts.

## Workflow

1. Extract the product core.
2. Confirm MVP include/exclude boundaries.
3. Break work into implementation slices.
4. Write acceptance criteria and cross-role handoffs.
5. Surface unresolved product risks before work starts.

## Core Product Lens

- The user is an investigator, not a quiz player.
- The MVP loop is case reading, location inference, evidence submission, admin review, and winner draw.
- Preserve safety, anti-abuse, and privacy rules even when cutting scope.

## Output Contract

Produce artifacts in this order unless the user asks otherwise:

1. Scope summary.
2. Prioritized backlog.
3. Acceptance criteria.
4. Risks, assumptions, and open questions.

## Working Rules

- Keep Google OAuth as the only auth provider unless scope changes explicitly.
- Keep photo review manual in MVP.
- Reject requests that drift into excluded features unless the user chooses a scope change.
- Translate atmosphere into clear release requirements, not just concept language.
