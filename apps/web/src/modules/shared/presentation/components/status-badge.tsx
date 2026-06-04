const badgeTone = {
  published: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  announced: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  closed: "border-zinc-400/30 bg-zinc-400/10 text-zinc-200",
  pending: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  rejected: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  selected: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  notified: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  reward_sent: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  cancelled: "border-rose-400/30 bg-rose-400/10 text-rose-200",
} as const;

export function StatusBadge({ label }: { label: string }) {
  const key = label as keyof typeof badgeTone;
  const tone = badgeTone[key] ?? "border-white/10 bg-white/5 text-zinc-200";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${tone}`}>
      {label}
    </span>
  );
}

