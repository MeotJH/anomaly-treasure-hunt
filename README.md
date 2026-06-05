# Anomaly Treasure Hunt MVP

TypeScript monorepo scaffold for the anomaly-investigation MVP.

## Structure
- `apps/web`: Next.js frontend
- `apps/api`: Nest.js backend
- `backlog/`: MVP work items
- `feature/`: feature slices mapped from backlog items

## Architecture
- Frontend and backend both separate `presentation`, `application`, `domain`, `infrastructure`
- Backend now persists local data with SQLite through repository implementations backed by Node's built-in `node:sqlite`
- Frontend currently uses API adapters and demo auth headers so transport concerns stay outside page components

## Local Run
1. `npm install`
2. `npm run dev:api`
3. `npm run dev:web`

## Local Start Scripts
- macOS / Linux: `bash ./local_start.sh`
- Windows: `local_start.bat`

Both scripts:
- create `.env` from `.env.example` when missing
- install dependencies when `node_modules` is missing
- create the local SQLite folder at `.local/`
- start backend on `http://localhost:4000`
- start frontend on `http://localhost:3000`

Note:
- On Windows in this environment, frontend dev mode uses `next dev --webpack` instead of Turbopack because native SWC bindings may be unavailable during flaky network installs.

## SQLite
- Default DB path from the API workspace: `apps/api/.local/anomaly-treasure-hunt.sqlite`
- Override path with `SQLITE_PATH`
- The backend auto-creates schema and seed case data on first boot

## Demo Headers
- User mode: `x-user-id=demo-user-1`, `x-user-role=user`
- Admin mode: `x-user-id=demo-admin-1`, `x-user-role=admin`

These are temporary MVP scaffold boundaries and should be replaced with Google OAuth/session handling in the next iteration.
