const badgeTone = {
  published: "border-rose-400/30 bg-rose-500/10 text-rose-100",
  announced: "border-sky-400/30 bg-sky-400/10 text-sky-100",
  closed: "border-zinc-400/30 bg-zinc-500/10 text-zinc-200",
  pending: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  approved: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  rejected: "border-rose-500/30 bg-rose-500/10 text-rose-100",
  selected: "border-violet-400/30 bg-violet-500/10 text-violet-100",
  notified: "border-sky-400/30 bg-sky-400/10 text-sky-100",
  reward_sent: "border-cyan-400/30 bg-cyan-400/10 text-cyan-100",
  cancelled: "border-zinc-500/30 bg-zinc-500/10 text-zinc-200",
  draft: "border-zinc-500/30 bg-zinc-500/10 text-zinc-200",
} as const;

const badgeLabel: Record<string, string> = {
  published: "공개 중",
  announced: "발표 대기",
  closed: "종료",
  pending: "검토 대기",
  approved: "승인",
  rejected: "반려",
  selected: "당첨",
  notified: "안내 완료",
  reward_sent: "보상 지급",
  cancelled: "취소",
  draft: "초안",
};

export function StatusBadge({ label }: { label: string }) {
  const key = label as keyof typeof badgeTone;
  const tone = badgeTone[key] ?? "border-white/10 bg-white/5 text-zinc-200";

  return (
    <span
      className={`inline-flex rounded-md border px-3 py-1 text-xs font-medium tracking-[0.2em] ${tone}`}
    >
      {badgeLabel[label] ?? label}
    </span>
  );
}
