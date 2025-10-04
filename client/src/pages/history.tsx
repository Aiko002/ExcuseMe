import { useQuery } from "@tanstack/react-query";
import TabBar from "@/components/tab-bar";
import { useStealthMode } from "@/components/stealth-mode-provider";
import type { Excuse } from "@shared/schema";

export default function HistoryPage() {
  const { getMaskedLabel } = useStealthMode();
  const { data: recentExcuses = [], isLoading, error } = useQuery<Excuse[]>({
    queryKey: ["/api/excuses/recent?limit=50"],
  });

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const excuseDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - excuseDate.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour ago`;
    return `${Math.floor(diffInMinutes / 1440)} day ago`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      work: getMaskedLabel("Work Emergency", "Work"),
      family: getMaskedLabel("Family Emergency", "Family"),
      health: getMaskedLabel("Health Concern", "Health"),
      transport: getMaskedLabel("Transport Issue", "Transport"),
    };
    return labels[category] || category;
  };

  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 min-h-screen relative pb-20">
      <header className="bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-semibold text-ios-dark dark:text-white">{getMaskedLabel("Excuse History", "Recent Items")}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{getMaskedLabel("Previously generated excuses", "Recent activity")}</p>
      </header>

      <main className="px-6 py-6 space-y-2">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">Unable to load {getMaskedLabel("excuses", "items")}.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : recentExcuses.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <i className="fas fa-history text-gray-400 dark:text-gray-500 text-2xl mb-2"></i>
            <p className="text-gray-600 dark:text-gray-400 text-sm">No {getMaskedLabel("recent excuses", "recent items")}</p>
          </div>
        ) : (
          recentExcuses.map((excuse) => (
            <div key={excuse.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {getCategoryLabel(excuse.category)} • {formatTimeAgo(excuse.createdAt || new Date())}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                "{excuse.content}"
              </p>
            </div>
          ))
        )}
      </main>

      <TabBar active="history" />
    </div>
  );
}
