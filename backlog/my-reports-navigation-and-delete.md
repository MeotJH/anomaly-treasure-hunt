# My Reports Navigation And Delete Backlog

## Scope Summary
- Make the `내 제보` navigation always return to the list view from a report detail route.
- Add a delete action for a user's own report history entry.

## Priority
1. Make the `내 제보` navigation target a list-specific URL.
2. Ensure navigation helpers compare paths correctly when query strings are present.
3. Add a delete API for owned reports.
4. Add a delete action in the report detail UI with a safe pending state.

## Acceptance Criteria
- Tapping `내 제보` from `/me/reports/[reportId]` returns to the list page.
- Users can delete their own reports from the detail screen.
- Approved reports are not deletable.
- Deleted reports disappear from the list after navigation.
