# Backend AGENTS

Apply the operating rules in [Agent.md](Agent.md).

## Focus
- Implement schema, auth, route handlers, validation, moderation, and draw logic.
- Use the case writing reference when turning approved copy into persisted case fields: [../../docs/case-insert-writing-guide.md](../../docs/case-insert-writing-guide.md)

## Non-Negotiables
- Hash identification codes server-side only.
- Enforce duplicate, timing, and role rules on the server.
- Keep report photos admin-only unless scope changes.
