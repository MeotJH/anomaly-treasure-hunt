# Supabase Auth Setup

This project expects Supabase Auth for social login and session handling.
The current default path is Google login only.

## What You Need To Prepare

- A Supabase project
- A Google Cloud project for Google OAuth
- The admin email: `businesskim93@gmail.com`

## 1. Fill Environment Variables

Put these into `.env` at the repository root.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
NEXT_PUBLIC_ADMIN_EMAIL=businesskim93@gmail.com
NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDERS=google

SUPABASE_URL=your_supabase_project_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
ADMIN_EMAILS=businesskim93@gmail.com

PORT=4000
SQLITE_PATH=.local/anomaly-treasure-hunt.sqlite
```

Where to find them:

- `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_URL`:
  Supabase Dashboard -> Project Settings -> Data API or API Keys -> Project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY`:
  Supabase Dashboard -> Project Settings -> API Keys -> Publishable key

## 2. Add Redirect URLs In Supabase

In Supabase Dashboard:

- Go to `Authentication`
- Open URL / Redirect settings
- Add these redirect URLs

Local:

```txt
http://localhost:3000/auth/callback
```

Production:

```txt
https://your-domain.com/auth/callback
```

If you use Vercel preview URLs, add them later as needed.

## 3. Enable Google Login

Official docs:

- https://supabase.com/docs/guides/auth/social-login/auth-google

Steps:

1. Open Google Cloud Console.
2. Create or select a project.
3. Go to `Google Auth Platform` or `APIs & Services`.
4. Configure the OAuth consent screen.
5. Create `OAuth Client ID`.
6. Choose `Web application`.
7. Add authorized redirect URIs:

```txt
https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
```

8. Copy:
   - Client ID
   - Client Secret
9. In Supabase Dashboard:
   - `Authentication`
   - `Providers`
   - `Google`
   - Enable it
   - Paste Client ID and Client Secret
   - Save

## 4. Make Admin Access Work

This code grants admin access only when the signed-in user's email exactly matches:

```txt
businesskim93@gmail.com
```

That rule is enforced in both:

- web route protection
- API admin authorization

So after Google login:

- `businesskim93@gmail.com` can open `/admin`
- any other account is redirected away or blocked by the API

## 5. Recommended Test Order

1. Start API

```bash
npm run dev:api
```

2. Start web

```bash
npm run dev:web
```

3. Open:

```txt
http://localhost:3000
```

4. Try Google login with a normal user account
5. Confirm:
   - case list loads
   - report page requires sign-in
   - my reports requires sign-in
6. Log out
7. Log in with `businesskim93@gmail.com`
8. Confirm `/admin` opens

## 6. Troubleshooting

- `로그인이 필요합니다.`
  The browser session cookie is missing or not refreshed.

- `관리자 권한이 필요합니다.`
  The logged-in email is not `businesskim93@gmail.com`.

- Login redirects but returns to the app unsigned in
  Check:
  - Supabase redirect allow list
  - provider callback URL
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

- If you later want to enable more providers
  Update:
  - `NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDERS`
  Example:
  ```env
  NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDERS=google,kakao,custom:naver
  ```
