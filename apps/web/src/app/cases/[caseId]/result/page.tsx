import { fetchCaseResult } from "@/modules/cases/infrastructure/case-api";
import { StatusBadge } from "@/modules/shared/presentation/components/status-badge";

export const dynamic = "force-dynamic";

export default async function CaseResultPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const result = await fetchCaseResult(caseId);

  return (
    <div className="space-y-6">
      <section className="haunted-panel rounded-[2rem] border border-rose-950/40 bg-[linear-gradient(145deg,rgba(32,11,14,0.88),rgba(10,11,16,0.92))] p-8">
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{result.fileNo}</p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-50">
            <span className="glitch-text" data-text={result.title}>
              {result.title}
            </span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            {result.resultOpen
              ? "발표 구역이 열렸습니다. 조사 결과와 보상 대상 기록을 아래에서 확인할 수 있습니다."
              : "아직 발표 시각 전입니다. 공지된 발표 시각 이후 다시 확인해 주세요."}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/20 p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">조사 완료 메모</p>
        <p className="mt-3 text-sm leading-7 text-zinc-200">{result.completionMessage}</p>
      </section>

      {result.winner ? (
        <section className="rounded-3xl border border-rose-950/40 bg-[linear-gradient(180deg,rgba(24,11,14,0.94),rgba(10,11,15,0.92))] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">선정 기록</p>
          <p className="mt-3 text-sm text-zinc-200">선정된 제보자: {result.winner.userId}</p>
          <div className="mt-3">
            <StatusBadge label={result.winner.status} />
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
          아직 공개된 보상 대상 기록이 없습니다.
        </section>
      )}
    </div>
  );
}
