# Report Submission Loading Lock Backlog

## Scope Summary
- Make report submission feel explicitly in-progress instead of just swapping the submit button text.
- Block all other click interactions on the report submission page while upload and submit requests are running.
- Show a world-consistent loading overlay with skeleton placeholders during submission.

## Priority
1. Add a dedicated submission-loading overlay for the report page.
2. Expose staged loading copy for upload, report submission, and final redirect.
3. Lock report-form controls and intercept all page clicks while the request is active.
4. Keep the existing success and error handling behavior unchanged.
5. Verify the submission page still builds and remains usable on mobile.

## Acceptance Criteria
- Pressing the report submit button immediately shows a visible loading state.
- The user cannot click guide links, back buttons, or other page actions while submission is in flight.
- The loading UI includes skeleton placeholders rather than only a text label.
- The loading state clears on failure and transitions to navigation on success.
- The implementation stays limited to the report submission flow and does not change unrelated pages.
