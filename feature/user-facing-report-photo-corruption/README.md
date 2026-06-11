# User-Facing Report Photo Corruption Feature

## Goal
- Make uploaded evidence feel misrecorded inside the world of the site without damaging the reviewable original.

## Functional Slice
- Storage keeps the original report image path and a nullable display-variant path.
- Submission flow triggers analysis-based artifact rendering on the backend.
- User-facing report pages prefer the display variant.
- Admin-facing report pages continue to inspect the original.

## Artifact Rules
- Use subtle record-loss effects such as partial line dropout, boundary melt, and local echo repetition.
- Favor edge zones and high-contrast rows/columns discovered during lightweight image analysis.
- Avoid large hands, faces, or centered overlays that would read as cheap horror decoration.

## Verification
- `npm run build --workspace api`
- `npm run build --workspace web`
- `npm run prisma:db:push --workspace api`
