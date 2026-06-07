# Supabase Auth Setup

This project expects Supabase Auth for social login and session handling.

## What You Need To Prepare

- A Supabase project
- A Google Cloud project for Google OAuth
- A Kakao Developers app for Kakao OAuth
- A Naver Developers app for Naver OAuth
- The admin email: `businesskim93@gmail.com`

## 1. Fill Environment Variables

Put these into `.env` at the repository root.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
NEXT_PUBLIC_ADMIN_EMAIL=businesskim93@gmail.com
NEXT_PUBLIC_SUPABASE_NAVER_PROVIDER_ID=custom:naver

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

## 4. Enable Kakao Login

Official docs:

- https://supabase.com/docs/guides/auth/social-login/auth-kakao/

Steps:

1. Open Kakao Developers.
2. Create an app.
3. Go to `App Settings` -> `Platform`.
4. Add your web site domain:

Local:

```txt
http://localhost:3000
```

Production:

```txt
https://your-domain.com
```

5. Go to `Kakao Login` and turn it on.
6. Set redirect URI:

```txt
https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
```

7. Copy:
   - REST API Key -> this becomes Client ID
   - Client Secret -> this becomes Client Secret
8. In `Consent Items`, enable at least:
   - `profile_nickname`
   - `profile_image`
   - `account_email`

Important:

- Kakao email consent may require Biz App setup.
- If you do not get email from Kakao, admin email matching cannot work for Kakao admin login.
- For this project, admin login should be done with Google on `businesskim93@gmail.com`.

9. In Supabase Dashboard:
   - `Authentication`
   - `Providers`
   - `Kakao`
   - Enable it
   - Paste Client ID and Client Secret
   - Save

## 5. Enable Naver Login As Custom Provider

Supabase does not provide Naver as a built-in provider in the standard provider list used here.
Use a custom OAuth provider.

Official docs:

- https://supabase.com/docs/guides/auth/custom-oauth-providers

### 5-1. Create Naver app

1. Open Naver Developers.
2. Create an application.
3. Add service URLs:

```txt
http://localhost:3000
https://your-domain.com
```

4. Add callback URL:

```txt
https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
```

5. Copy:
   - Client ID
   - Client Secret

### 5-2. Create custom provider in Supabase

In Supabase Dashboard:

1. Go to `Authentication`
2. Go to `Providers`
3. Click `New Provider`
4. Choose manual OAuth2 configuration
5. Set:

```txt
Identifier: custom:naver
Name: Naver
Authorization URL: https://nid.naver.com/oauth2.0/authorize
Token URL: https://nid.naver.com/oauth2.0/token
UserInfo URL: https://openapi.naver.com/v1/nid/me
Scopes: name,email,profile_image
```

6. Paste Client ID and Client Secret
7. Enable provider
8. Save

If you use a different identifier than `custom:naver`, update:

```env
NEXT_PUBLIC_SUPABASE_NAVER_PROVIDER_ID=your-custom-identifier
```

## 6. Make Admin Access Work

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

## 7. Recommended Test Order

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

## 8. Troubleshooting

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

- Google works but Kakao/Naver do not
  Usually one of these is wrong:
  - provider callback URL
  - provider client secret
  - provider domain / site URL registration
