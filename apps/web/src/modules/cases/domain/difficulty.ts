export type DifficultyGrade = "F" | "E" | "D" | "C" | "B" | "A" | "S";

export const difficultyMeta: Record<
  DifficultyGrade,
  {
    label: string;
    shortLabel: string;
    summary: string;
    tone: string;
  }
> = {
  F: {
    label: "F급",
    shortLabel: "F",
    summary: "비교적 안전한 초급 관측 등급",
    tone: "border-zinc-300/20 bg-zinc-400/10 text-zinc-100",
  },
  E: {
    label: "E급",
    shortLabel: "E",
    summary: "기초 관측 장비로 접근 가능한 등급",
    tone: "border-lime-300/20 bg-lime-400/10 text-lime-100",
  },
  D: {
    label: "D급",
    shortLabel: "D",
    summary: "일반적인 탐사 대상이 되는 관측 등급",
    tone: "border-sky-300/20 bg-sky-400/10 text-sky-100",
  },
  C: {
    label: "C급",
    shortLabel: "C",
    summary: "반복 패턴 분석이 필요한 중급 등급",
    tone: "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
  },
  B: {
    label: "B급",
    shortLabel: "B",
    summary: "위험 징후가 뚜렷한 고난도 관측 등급",
    tone: "border-amber-300/20 bg-amber-400/10 text-amber-100",
  },
  A: {
    label: "A급",
    shortLabel: "A",
    summary: "베테랑 탐사자 수준의 대응이 필요한 등급",
    tone: "border-orange-300/20 bg-orange-400/10 text-orange-100",
  },
  S: {
    label: "S급",
    shortLabel: "S",
    summary: "규칙 위반 시 치명적 결과를 초래할 수 있는 최고 위험 등급",
    tone: "border-rose-300/25 bg-rose-500/12 text-rose-50",
  },
};
