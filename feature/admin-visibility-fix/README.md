# Admin Visibility Fix Feature

## Goal
- Align web-side admin recognition with the API so configured admin accounts reliably see the admin surface.

## Functional Slice
- Parse admin emails from env as a normalized set.
- Use the set when building the server auth context.
- Keep admin navigation and admin route gating consistent.
