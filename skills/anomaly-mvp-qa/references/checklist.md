# QA Checklist

## Always Confirm
- Happy path, rejection path, duplicate path, and expired path are covered.
- User/admin permissions are checked directly.
- Winner draw uses only approved reports.
- Mobile readability and long-text behavior are tested.

## Default Outputs
- Findings with severity.
- Reproduction steps.
- Residual risks and missing coverage.

## Review Questions
- What can fail silently in auth, upload, or review flows?
- Which bugs would compromise trust, fairness, or privacy?
- What remains unverified because of missing tooling, seeds, or environment access?
