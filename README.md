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
- Frontend and backend now use Supabase Auth session tokens for user/admin boundaries

## Local Run
Prerequisite:
- Node.js `22.13.0+` (or `23.4.0+`) because the API uses the built-in `node:sqlite` module without experimental flags

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
- fail fast when the current Node.js runtime does not support `node:sqlite`
- start backend on `http://localhost:4000`
- start frontend on `http://localhost:3000`

Note:
- On Windows in this environment, frontend dev mode uses `next dev --webpack` instead of Turbopack because native SWC bindings may be unavailable during flaky network installs.

## SQLite
- Default DB path from the API workspace: `apps/api/.local/anomaly-treasure-hunt.sqlite`
- Override path with `SQLITE_PATH`
- The backend auto-creates schema and seed case data on first boot

## Auth Setup
- Configure Supabase Auth before using sign-in, report submission, or the admin room
- Required env vars are listed in `.env.example`
- Full setup steps: [docs/auth-setup.md](/Users/eldorado/WorkSpace/anomaly-treasure-hunt/docs/auth-setup.md)

## Deployment
- Backend deploy notes: [docs/deployment.md](/Users/eldorado/WorkSpace/anomaly-treasure-hunt/docs/deployment.md)
- Production API URL pattern is `https://anomaly.13.124.77.254.nip.io`
- Backend deploy scripts: `deploy.sh`, `deploy.bat`
