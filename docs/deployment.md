# Deployment Notes

This MVP is deployed with a split runtime:

- Backend API on a direct EC2/Lightsail host with Docker
- Frontend on Vercel
- Auth / Storage on Supabase

Keep the environments separate:

- The backend server owns the runtime `.env` file for `apps/api`.
- Vercel owns frontend environment variables for `apps/web`.
- Supabase owns OAuth provider config, storage access, and related secrets.

## Production URLs

- Backend API: `https://anomaly.13.124.77.254.nip.io`
- Backend health check: `https://anomaly.13.124.77.254.nip.io/api/cases`

The backend URL follows the same `nip.io` pattern already used by CafeMap on the shared EC2 host.

## 1. Combined Deployment

The repository includes a root deploy script:

```bash
bash ./deploy.sh
```

On Windows:

```bat
deploy.bat
```

Default behavior:

1. Deploy backend to EC2/Lightsail
2. Deploy frontend to Vercel

Optional modes:

```bash
bash ./deploy.sh --back
bash ./deploy.sh --front
```

Defaults:

- SSH key: `../cafemap/LightsailDefaultKey-ap-northeast-2.pem`
- Remote host: `13.124.77.254`
- Remote dir: `/home/ec2-user/anomaly-treasure-hunt-api`
- Remote git branch: `master`
- Container port mapping: `2028:4000`
- Public URL: `https://anomaly.13.124.77.254.nip.io`
- Frontend project dir: `apps/web`
- Frontend public URL: `https://anomaly-treasure-hunt.vercel.app`

What it does:

1. Type-checks the API locally.
2. Connects to the Lightsail host.
3. Bootstraps the remote directory as a Git clone if needed.
4. Runs `git pull --ff-only origin master` on the server.
5. Optionally uploads the local root `.env`.
6. Ensures a Caddy route exists on the EC2 host.
7. Rebuilds and restarts the Docker container.
8. Verifies `GET /api/cases`.
9. Builds the web app locally.
10. Runs `vercel deploy --prod --yes` from `apps/web`.

Important:

- The current backend deploy flow now uses the server's Git checkout as the source of truth.
- After the first bootstrap clone, deployment uses `origin/master` on the server instead of `rsync`.
- Runtime data is still preserved because `.env` and `apps/api/.local` are kept outside the Git-tracked lifecycle.
- Do not treat the root local `.env` as a frontend deployment artifact. It is a backend server runtime file in this setup.

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

- `NEXT_PUBLIC_API_BASE_URL` is not required on the backend server.
- `CORS_ALLOWED_ORIGINS` should include the exact Vercel production domain.
- Add `http://localhost:3000` only if local frontend testing should keep working against production API.
- The SQLite file stays inside the mounted remote directory, not inside the disposable container layer.
- The `NEXT_PUBLIC_SUPABASE_*` values are still needed on the backend because some shared auth and storage flows read them as fallbacks.

## 2. Vercel Frontend Setup

Deploy the repo to Vercel as a Next.js project.

Recommended project settings:

- Framework: `Next.js`
- Root: `apps/web`
- Install command: `npm install`
- Build command: `npm run build --workspace web`

Frontend environment variables for Vercel:

```env
NEXT_PUBLIC_API_BASE_URL=https://anomaly.13.124.77.254.nip.io

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=evidence-photos
NEXT_PUBLIC_ADMIN_EMAIL=businesskim93@gmail.com
NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDERS=google
```

Notes:

- The web app reads `NEXT_PUBLIC_API_BASE_URL` for both browser and server-side API calls.
- Vercel does not need the backend-only `PORT`, `SQLITE_PATH`, `CORS_ALLOWED_ORIGINS`, or `SUPABASE_SERVICE_ROLE_KEY` values.
- Keep production and preview values separate inside Vercel.
- Supabase is used by the frontend for auth, session handling, and direct evidence-photo upload.

## 3. Supabase Redirects

Add these redirect URLs in Supabase Auth:

- `http://localhost:3000/auth/callback`
- `https://your-vercel-domain.vercel.app/auth/callback`

If you attach a custom frontend domain in Vercel, add that callback URL too.

Google OAuth must keep using the Supabase callback URL from the provider setup flow.

## 4. Branch Note

This repository currently uses `master` as the local default branch, not `main`.
If Vercel production should track `main`, create or push a `main` branch from the current release commit before connecting the project.

## 5. Practical Ownership

- Backend deploy script pulls code from `origin/master` on the server and restarts Docker there.
- Backend secrets live only on the server `.env`.
- Frontend secrets and public runtime values live in the Vercel project settings, not in the server `.env`.
- Supabase dashboard settings must stay aligned with the chosen Vercel production URL and any preview URLs you allow.
