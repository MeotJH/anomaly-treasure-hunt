# Report Submission Interaction Lock Backlog

## Scope Summary
- Replace the current full-screen skeleton submission state with a lighter interaction lock.
- Keep the report form visually stable while clearly showing that submission is progressing.
- Disable other navigational and action affordances during submission so users cannot trigger conflicting flows.

## Priority
1. Remove the skeleton-heavy submission overlay.
2. Add explicit loading copy to the submit button.
3. Visually disable bottom navigation and nearby action links while submission is in flight.
4. Block real clicks on locked actions until submission completes or redirects.

## Acceptance Criteria
- Clicking the report submit button does not replace the page with a skeleton state.
- The submit button shows a clear in-progress state such as `...` or stage-aware loading text.
- Bottom tab navigation and nearby action links look disabled during submission and cannot be clicked.
- Report form fields are not editable during submission.
- The interaction lock is released on failure and remains active through redirect on success.
