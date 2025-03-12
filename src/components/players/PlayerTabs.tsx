type SortTab = "all" | "trending" | "top" | "new";

interface PlayerTabsProps {
  activeTab: SortTab;
  onTabChange: (tab: SortTab) => void;
}

export const PlayerTabs = ({ activeTab, onTabChange }: PlayerTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onTabChange("all")}
        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
          activeTab === "all"
            ? "bg-primary-600 text-white"
            : "bg-gray-100 dark:bg-dark-800/40 text-gray-600 dark:text-gray-300"
        }`}
      >
        All Players
      </button>
      <button
        onClick={() => onTabChange("trending")}
        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
          activeTab === "trending"
            ? "bg-primary-600 text-white"
            : "bg-gray-100 dark:bg-dark-800/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
        }`}
      >
        Trending
      </button>
      <button
        onClick={() => onTabChange("top")}
        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
          activeTab === "top"
            ? "bg-primary-600 text-white"
            : "bg-gray-100 dark:bg-dark-800/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
        }`}
      >
        Top Fantasy Performers
      </button>
      <button
        onClick={() => onTabChange("new")}
        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
          activeTab === "new"
            ? "bg-primary-600 text-white"
            : "bg-gray-100 dark:bg-dark-800/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
        }`}
      >
        New Players
      </button>
    </div>
  );
};
