# Status Driven Case Availability Feature

## Goal
- Make submission availability, current case selection, and result access follow case status instead of timestamps.

## Functional Slice
- Replace `isReportOpen` and result-open checks with status-based rules.
- Update API detail mapping so `canSubmitReport` and `reportAvailability` cannot disagree with the badge state.
- Keep current-case lookup aligned with the highest-priority visible `published` case.
