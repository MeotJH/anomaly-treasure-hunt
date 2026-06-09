import { CaseSummary } from "../../domain/case";

const thumbnailTheme = {
  "FILE-001": {
    background:
      "linear-gradient(180deg, rgba(16,22,18,0.2), rgba(10,12,16,0.82)), radial-gradient(circle at 20% 20%, rgba(94,234,212,0.16), transparent 28%), radial-gradient(circle at 75% 28%, rgba(244,63,94,0.18), transparent 24%), linear-gradient(135deg, #20352b 0%, #0f1719 45%, #201217 100%)",
    accent: "from-emerald-300/70 via-cyan-300/30 to-rose-300/50",
    label: "공원 기록 교란",
  },
  "FILE-002": {
    background:
      "linear-gradient(180deg, rgba(25,22,18,0.12), rgba(9,11,15,0.84)), radial-gradient(circle at 70% 24%, rgba(251,191,36,0.14), transparent 22%), radial-gradient(circle at 24% 72%, rgba(125,211,252,0.15), transparent 26%), linear-gradient(135deg, #2d2c33 0%, #10131b 42%, #231b19 100%)",
    accent: "from-amber-300/70 via-zinc-200/20 to-sky-300/50",
    label: "산업 시설 잔향",
  },
  "FILE-003": {
    background:
      "linear-gradient(180deg, rgba(18,20,25,0.14), rgba(8,10,14,0.84)), radial-gradient(circle at 30% 22%, rgba(167,243,208,0.16), transparent 20%), radial-gradient(circle at 72% 78%, rgba(56,189,248,0.16), transparent 22%), linear-gradient(135deg, #20333f 0%, #0f161d 42%, #1b2320 100%)",
    accent: "from-teal-300/70 via-sky-300/30 to-lime-300/45",
    label: "수면 패턴 붕괴",
  },
} as const satisfies Record<string, { background: string; accent: string; label: string }>;

type Variant = "featured" | "compact";

const fallbackImageCount = 4;

function resolveFallbackImage() {
  const randomIndex = Math.floor(Math.random() * fallbackImageCount) + 1;
  return `/anormal_pic${randomIndex}.png`;
}

export function CaseThumbnail({
  caseItem,
  variant = "featured",
}: {
  caseItem: Pick<CaseSummary, "fileNo" | "title" | "representativeImageUrl">;
  variant?: Variant;
}) {
  const theme = thumbnailTheme[caseItem.fileNo as keyof typeof thumbnailTheme] ?? {
    background:
      "linear-gradient(180deg, rgba(18,18,20,0.16), rgba(8,10,14,0.84)), linear-gradient(135deg, #28212a 0%, #111318 50%, #1c1418 100%)",
    accent: "from-rose-300/60 via-sky-300/25 to-zinc-200/35",
    label: "기록 보관 이미지",
  };
  const imageSrc = caseItem.representativeImageUrl?.trim() || resolveFallbackImage();

  const sizeClass = variant === "featured" ? "aspect-[4/3] lg:aspect-[5/4]" : "aspect-[4/3]";

  return (
    <div
      className={`relative overflow-hidden rounded-[1.35rem] border border-white/10 ${sizeClass}`}
      style={{ background: theme.background }}
    >
      <img
        src={imageSrc}
        alt={`${caseItem.title} 대표 이미지`}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(7,8,12,0.18)_68%,rgba(7,8,12,0.46)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,12,0.28)_0%,transparent_18%,transparent_72%,rgba(7,8,12,0.54)_100%),linear-gradient(90deg,rgba(7,8,12,0.4)_0%,transparent_14%,transparent_86%,rgba(7,8,12,0.4)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,10,14,0.08),rgba(8,10,14,0.18)_35%,rgba(0,0,0,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_32%,rgba(0,0,0,0.35)_100%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_4px)] opacity-20" />
      <div className={`absolute left-4 top-4 h-px w-24 bg-gradient-to-r ${theme.accent}`} />
      <div className="absolute left-4 top-7 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.58rem] uppercase tracking-[0.28em] text-zinc-200">
        {caseItem.fileNo}
      </div>
      <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-zinc-300">
        anomaly trace
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[0.63rem] uppercase tracking-[0.32em] text-zinc-300">{theme.label}</p>
      </div>
    </div>
  );
}
