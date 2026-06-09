const steps = [
  {
    step: "01",
    title: "사건 문서 열람",
    description: "공개된 기록을 읽고 반복 문장, 누락된 이름, 현장 단서를 먼저 파악합니다.",
  },
  {
    step: "02",
    title: "장소 추리",
    description: "표식, 구조물, 안내판을 바탕으로 실제 위치를 좁혀 현장을 특정합니다.",
  },
  {
    step: "03",
    title: "증거 제출",
    description: "증거 사진과 식별 코드를 제출하면 운영진 검토 후 기록이 분류됩니다.",
  },
] as const;

export function ParticipationSteps() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">참여 방식</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-50">어떻게 참여하나요?</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((item) => (
          <article
            key={item.step}
            className="haunted-panel rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(19,12,15,0.92),rgba(8,10,14,0.92))] p-5"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-rose-300/70">{item.step}</p>
            <h3 className="mt-3 text-lg font-semibold text-zinc-50">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-300">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
