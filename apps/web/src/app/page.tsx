import { getHomePageData } from "@/modules/home/application/get-home-page-data";
import { CaseCard } from "@/modules/cases/presentation/components/case-card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { currentCase, archivedCases } = await getHomePageData();

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">
            Current Investigation
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-50">
            Anomaly Investigation MVP
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
            This build treats the user as an investigator rather than a quiz participant.
            The main loop is reading a case file, inferring a real location, and submitting
            an identification code with supporting evidence.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">MVP Notes</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
            <li>Next.js App Router plus Nest.js TypeScript workspace</li>
            <li>Layered Architecture: presentation / application / domain / infrastructure</li>
            <li>Current scaffold uses demo headers and in-memory repositories</li>
            <li>Infrastructure boundaries are separated for Supabase/Auth/Storage later</li>
          </ul>
        </div>
      </section>

      {currentCase ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">New File</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Active File</h2>
          </div>
          <CaseCard caseItem={currentCase} href={`/cases/${currentCase.id}`} />
        </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Archive</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Archived Files</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {archivedCases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} href={`/cases/${caseItem.id}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
