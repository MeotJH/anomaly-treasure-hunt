# Report Submission Loading Lock Feature

## Goal
- Prevent accidental double actions and make the report submission wait state feel intentional.

## Functional Slice
- The report form tracks staged submission progress.
- A fixed overlay blocks page interaction during upload and submit requests.
- The overlay presents loading copy plus skeleton placeholders aligned with the report page layout.
- Form controls remain disabled until the request finishes or redirects.

## UX Notes
- Use anomaly-archive language rather than generic spinner UI.
- Keep the main message short and the secondary message operational.
- Favor subtle skeleton blocks over heavy animation.

## Verification
- `npm run build --workspace web`
