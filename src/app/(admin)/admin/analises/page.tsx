import { getAnalyticsBoardModel } from "@/features/admin/areas/analytics/services/analytics.service";
import { AdminAnalyticsView } from "@/features/admin/areas/analytics/views/pages/admin-analytics-view";

export default async function AdminAnalyticsPage() {
  const model = await getAnalyticsBoardModel();

  return <AdminAnalyticsView model={model} />;
}
