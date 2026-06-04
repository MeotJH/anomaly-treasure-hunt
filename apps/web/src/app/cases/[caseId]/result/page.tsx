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
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{result.fileNo}</p>
      <h2 className="mt-3 text-3xl font-semibold text-zinc-50">보상 대상자 발표</h2>
      <p className="mt-4 text-sm leading-7 text-zinc-300">
        {result.resultOpen
          ? "발표가 열린 상태입니다."
          : "아직 발표 전입니다. 발표 일정 이후 다시 확인하세요."}
      </p>
      {result.winner ? (
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-zinc-300">사용자: {result.winner.userId}</p>
          <div className="mt-3">
            <StatusBadge label={result.winner.status} />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-zinc-400">아직 선정된 보상 대상자가 없습니다.</p>
      )}
    </div>
  );
}

