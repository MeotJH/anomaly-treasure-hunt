# Deployment Notes

This MVP is split across:

- Backend API on EC2 + Docker
- Frontend on Vercel
- Auth / DB / Storage on Supabase

## Production URLs

- Backend API: `https://anomaly.13.124.77.254.nip.io`
- Backend health check: `https://anomaly.13.124.77.254.nip.io/api/cases`

The backend URL follows the same `nip.io` pattern already used by CafeMap on the shared EC2 host.

## 1. Backend Deployment

The repository includes a root deploy script:

```bash
bash ./deploy.sh
```

On Windows:

```bat
deploy.bat
```

Defaults:

- SSH key: `../chickenmap/LightsailDefaultKey-ap-northeast-2.pem`
- Remote host: `13.124.77.254`
- Remote dir: `/home/ec2-user/anomaly-treasure-hunt-api`
- Remote git branch: `master`
- Container port mapping: `2028:4000`
- Public URL: `https://anomaly.13.124.77.254.nip.io`

What it does:

1. Type-checks the API locally.
2. Connects to the Lightsail host.
3. Bootstraps the remote directory as a Git clone if needed.
4. Runs `git pull --ff-only origin master` on the server.
5. Optionally uploads the local root `.env`.
6. Ensures a Caddy route exists on the EC2 host.
7. Rebuilds and restarts the Docker container.
8. Verifies `GET /api/cases`.

Important:

- The current backend deploy flow now uses the server's Git checkout as the source of truth.
- After the first bootstrap clone, deployment uses `origin/master` on the server instead of `rsync`.
- Runtime data is still preserved because `.env` and `apps/api/.local` are kept outside the Git-tracked lifecycle.

### Backend Required Environment

Put these in the remote `${BACKEND_REMOTE_DIR}/.env`:

```env
PORT=4000
SQLITE_PATH=.local/anomaly-treasure-hunt.sqlite
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-vercel-domain.vercel.app

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=evidence-photos
NEXT_PUBLIC_ADMIN_EMAIL=businesskim93@gmail.com
NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDERS=google

SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_STORAGE_BUCKET=evidence-photos
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=businesskim93@gmail.com
```

Notes:

- `CORS_ALLOWED_ORIGINS` should include the exact Vercel production domain.
- Add `http://localhost:3000` only if local frontend testing should keep working against production API.
- The SQLite file stays inside the mounted remote directory, not inside the disposable container layer.

## 2. Vercel Frontend Setup

Deploy the repo to Vercel as a Next.js project.

Recommended project settings:

- Framework: `Next.js`
- Root: `apps/web`
- Install command: `npm install`
- Build command: `npm run build`

Environment variables for Vercel:

```env
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://anomaly.13.124.77.254.nip.io

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=evidence-photos
NEXT_PUBLIC_ADMIN_EMAIL=businesskim93@gmail.com
NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDERS=google

SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=evidence-photos
ADMIN_EMAILS=businesskim93@gmail.com
```

The web app reads `NEXT_PUBLIC_API_BASE_URL` for all browser and server-side API calls.
Supabase is used for auth, report-photo storage, and related protected assets.

## 3. Supabase Redirects

Add these redirect URLs in Supabase Auth:

- `http://localhost:3000/auth/callback`
- `https://your-vercel-domain.vercel.app/auth/callback`

Google OAuth must keep using the Supabase callback URL from the provider setup flow.

## 4. Branch Note

This repository currently uses `master` as the local default branch, not `main`.
If Vercel production should track `main`, create or push a `main` branch from the current release commit before connecting the project.
