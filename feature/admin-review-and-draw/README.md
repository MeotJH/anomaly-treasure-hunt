# admin-review-and-draw

## Scope
- 사건별 보고 목록 조회
- 승인/반려 처리
- 보상 대상자 추첨
- 보상 상태 갱신

## API Surface
- `GET /api/admin/cases/:id/reports`
- `PATCH /api/admin/reports/:id/review`
- `POST /api/admin/cases/:id/draw`
- `PATCH /api/admin/winners/:id/reward`

