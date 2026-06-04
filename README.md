# Anomaly Treasure Hunt MVP

TypeScript monorepo scaffold for the anomaly-investigation MVP.

## Structure
- `apps/web`: Next.js frontend
- `apps/api`: Nest.js backend
- `backlog/`: MVP work items
- `feature/`: feature slices mapped from backlog items

## Architecture
- Frontend and backend both separate `presentation`, `application`, `domain`, `infrastructure`
- Backend currently uses in-memory repositories so the domain/application boundaries are testable before Supabase wiring
- Frontend currently uses API adapters and demo auth headers so transport concerns stay outside page components

## Run
1. `npm install`
2. `npm run dev:api`
3. `npm run dev:web`

## Demo Headers
- User mode: `x-user-id=demo-user-1`, `x-user-role=user`
- Admin mode: `x-user-id=demo-admin-1`, `x-user-role=admin`

These are temporary MVP scaffold boundaries and should be replaced with Google OAuth/session handling in the next iteration.
