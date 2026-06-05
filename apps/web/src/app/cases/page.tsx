import { getCasesListView } from "@/modules/cases/application/get-cases-list-view";
import { CaseListView } from "@/modules/cases/presentation/components/case-list-view";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const cases = await getCasesListView();
  return <CaseListView cases={cases} />;
}

