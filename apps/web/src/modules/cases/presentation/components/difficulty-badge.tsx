import { DifficultyGrade, difficultyMeta } from "../../domain/difficulty";

export function DifficultyBadge({
  grade,
  compact = false,
}: {
  grade: DifficultyGrade;
  compact?: boolean;
}) {
  const meta = difficultyMeta[grade];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.22em] ${meta.tone}`}
      title={meta.summary}
    >
      {compact ? meta.label : `위험도 ${meta.label}`}
    </span>
  );
}
