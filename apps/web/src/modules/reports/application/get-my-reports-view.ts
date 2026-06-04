import { fetchMyReports } from "../infrastructure/report-api";

export async function getMyReportsView() {
  return fetchMyReports();
}

