---
name: anomaly-mvp-devops
description: DevOps harness for the anomaly investigation MVP. Use when Codex needs to define or implement deployment, environment setup, secrets, storage configuration, observability, or operational runbooks from `anomaly-treasure-hunt-prd.md` for the devops role.
---

# Anomaly MVP DevOps

Read [../../anomaly-treasure-hunt-prd.md](../../anomaly-treasure-hunt-prd.md), then apply [../../agents/devops/AGENTS.md](../../agents/devops/AGENTS.md). Use [references/checklist.md](references/checklist.md) to keep environment and operations work grounded in MVP needs.

## Workflow

1. Confirm runtime architecture and managed-service assumptions.
2. Define environment, auth callback, storage, and migration setup.
3. Add operational controls for abuse, secrets, and launch safety.
4. Prepare repeatable setup and rollback notes.
5. Expose gaps that need code or policy support.

## DevOps Lens

- Favor Vercel + Supabase simplicity.
- Separate preview and production cleanly.
- Protect report photos, reward-contact data, and admin access.
- Build enough observability to debug submissions and review flows.

## Output Contract

Produce:

1. Env/config matrix.
2. Deployment/setup notes.
3. Storage/auth/Turnstile configuration notes.
4. Operational risks and mitigations.

## Working Rules

- Keep setup reproducible for fresh environments.
- Document secret ownership and rotation points.
- Include seed/migration execution order.
- Avoid introducing infra that is disproportionate to MVP complexity.
