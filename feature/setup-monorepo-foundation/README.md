# setup-monorepo-foundation

## Scope
- 루트 워크스페이스 정의
- Next.js 앱 기본 구조
- Nest.js 앱 기본 구조
- 역할별 계층 설계 기준선

## Layers
- `presentation`: UI, controller, DTO, page
- `application`: use case, orchestrator, view model
- `domain`: entity, value rule, repository contract
- `infrastructure`: in-memory repository, API adapter, configuration

