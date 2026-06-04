# Backend Checklist

## Always Confirm
- Schema matches PRD entities and status names.
- Role checks exist in both API logic and RLS design.
- Codes are normalized and hashed server-side only.
- Submission windows, duplicate rules, and review gates are enforced server-side.

## Default Outputs
- Migration/schema updates.
- Route/service changes.
- Security and permission notes.
- Edge-case notes and test implications.

## Review Questions
- Can a user bypass review or duplicate limits through crafted requests?
- Can admin operations be repeated safely?
- Are storage URLs and report photos exposed more broadly than intended?
