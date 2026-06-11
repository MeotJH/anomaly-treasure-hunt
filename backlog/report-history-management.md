# Report History Management Backlog

## Scope Summary
- Preserve review integrity while giving users basic control over their personal report history.
- Keep report deletion limited to user-owned records and safe review states.

## Priority
1. Add repository support for deleting a report row.
2. Remove both original and display assets from storage during deletion.
3. Return a clear response message for success and protected states.
4. Surface deletion intent and failure feedback in the UI.

## Acceptance Criteria
- Deleting a pending or rejected owned report removes the DB row.
- Related storage assets are cleaned up best-effort.
- Attempting to delete an approved report returns a guarded error.
- The UI communicates success and failure clearly.
