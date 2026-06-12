# Remove Case Schedule Dependency Feature

## Goal
- Stop treating `startsAt`, `endsAt`, and `announcedAt` as runtime control fields for case behavior.

## Functional Slice
- Remove schedule-based branching from user-facing APIs and client rendering.
- Narrow transport contracts so clients do not need schedule values for behavior decisions.
- Define a compatibility path for existing stored records until schema cleanup is completed.
