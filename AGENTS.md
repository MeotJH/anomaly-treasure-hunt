# AGENTS

## Project
- Build the MVP described in [anomaly-treasure-hunt-prd.md](anomaly-treasure-hunt-prd.md).
- Product identity: an anomaly-investigation experience with a reward draw, not a generic giveaway event.

## Core Loop
- User reads a case file.
- User infers the real-world location.
- User uploads an evidence photo and enters an identification code.
- Admin reviews the report.
- Approved reports enter the winner draw.

## MVP Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Cloudflare Turnstile
- Vercel

## Hard Guardrails
- Keep manual photo review in MVP.
- Keep Google OAuth as the default MVP auth provider.
- Do not add excluded features unless the user explicitly changes scope:
  - GPS verification
  - AI photo judging
  - real-time tracking
  - paid hints
  - ranking or player-vs-player systems
  - cash payout or point exchange
  - automated bulk gifticon delivery
- Do not design flows that encourage unsafe visits, private-property access, or panic/urgency behavior.
- Never expose answer locations or plaintext identification codes in client-visible paths.

## Delivery Priorities
1. User flow: home, case detail, report submission, result/history.
2. Backend rules: schema, auth, report validation, review, draw.
3. Admin flow: case management, report review, winner selection.
4. Ops and QA hardening: env, storage, abuse controls, test coverage.

## Role Map
- PO: [agents/po/AGENTS.md](agents/po/AGENTS.md)
- Designer: [agents/designer/AGENTS.md](agents/designer/AGENTS.md)
- Frontend: [agents/front/AGENTS.md](agents/front/AGENTS.md)
- Backend: [agents/back/AGENTS.md](agents/back/AGENTS.md)
- DevOps: [agents/devops/AGENTS.md](agents/devops/AGENTS.md)
- QA: [agents/qa/AGENTS.md](agents/qa/AGENTS.md)

## Skills
- PO: [skills/anomaly-mvp-po/SKILL.md](skills/anomaly-mvp-po/SKILL.md)
- Designer: [skills/anomaly-mvp-designer/SKILL.md](skills/anomaly-mvp-designer/SKILL.md)
- Frontend: [skills/anomaly-mvp-front/SKILL.md](skills/anomaly-mvp-front/SKILL.md)
- Backend: [skills/anomaly-mvp-back/SKILL.md](skills/anomaly-mvp-back/SKILL.md)
- DevOps: [skills/anomaly-mvp-devops/SKILL.md](skills/anomaly-mvp-devops/SKILL.md)
- QA: [skills/anomaly-mvp-qa/SKILL.md](skills/anomaly-mvp-qa/SKILL.md)
