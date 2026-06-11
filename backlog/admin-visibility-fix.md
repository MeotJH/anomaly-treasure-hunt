# Admin Visibility Fix Backlog

## Scope Summary
- Make the web app recognize admin accounts with the same rule set as the API.
- Ensure the admin tab appears for configured admin emails without relying on a single fragile public env value.

## Priority
1. Centralize web-side admin email parsing.
2. Support comma-separated admin email configuration.
3. Reuse the parser in the auth context that drives navigation.
4. Verify the admin tab and admin gate behave consistently.

## Acceptance Criteria
- `businesskim93@gmail.com` is treated as admin when included in configured admin emails.
- The admin tab appears in the main navigation for admin accounts.
- Non-admin accounts do not see the admin tab.
