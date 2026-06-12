# Case Status Driven Availability Backlog

## Scope Summary
- Remove case scheduling as the runtime source of truth for user-facing availability.
- Drive case visibility, submission availability, result access, and current-case selection from the case `status` flag only.
- Eliminate `startsAt`, `endsAt`, and `announcedAt` from UI/runtime decision logic so admins cannot create contradictory states.

## Product Rules
- `draft`: hidden from normal user lists and not submittable.
- `published`: visible to users, eligible for current case, and submittable.
- `closed`: visible to users, not submittable, result page remains locked.
- `announced`: visible to users, not submittable, result page open.

## Priority
1. Replace domain and API availability rules with status-based decisions.
2. Remove schedule field dependence from admin case management and persistence contracts.
3. Clean up client rendering so status badges, submission banners, and result access always agree.

## Acceptance Criteria
- A case marked `published` always appears as actively open for report submission.
- A case marked `closed` never allows report submission and does not claim to be open.
- A case marked `announced` exposes results without requiring any date comparison.
- `current case` selection is derived from the highest-priority visible `published` case.
- User list ordering remains `published -> announced -> closed`, with `episodeNo DESC` inside each status group.
- No user-facing page depends on `startsAt`, `endsAt`, or `announcedAt` to decide whether submission or result access is available.

## Risks
- Existing admin forms and storage schema still include schedule fields, so the transition needs a compatibility path.
- Historical copy that references a submission window may become misleading unless UI text is normalized.
