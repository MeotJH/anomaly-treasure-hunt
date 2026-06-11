# User-Facing Report Photo Corruption Backlog

## Scope Summary
- Keep uploaded evidence originals unchanged for admin review and audit.
- Generate a separate corrupted display variant after report submission.
- Show the corrupted variant only on user-facing report history and report detail surfaces.
- Preserve the anomaly-investigation tone through record-loss artifacts instead of obvious horror stickers.

## Priority
1. Extend report persistence with a nullable display-variant storage path.
2. Add an API-side corruption pipeline that downloads the uploaded original, analyzes the frame, and uploads a derived variant.
3. Return signed URLs for both original and display variant paths.
4. Switch user-facing report screens to prefer the display variant while leaving admin review on originals.
5. Document the feature slice and verify schema sync plus build stability.

## Acceptance Criteria
- Report submission still stores the original `photoUrl`.
- A successful submission attempts to create a `displayPhotoUrl` derived asset under Supabase Storage.
- User report history and user report detail show `displayPhotoUrl` when available.
- Admin report review keeps using the original image.
- If display-variant generation fails, report submission still succeeds and falls back to the original image.

## Risks And Notes
- Display-variant generation must never hide or overwrite the original evidence used for manual review.
- Corruption overlays should stay away from the center of the frame as much as possible to reduce review confusion.
- The artifact language should feel like record degradation or misclassification, not a direct monster reveal.
