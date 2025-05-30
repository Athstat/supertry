type SortTab = "all" | "trending" | "top" | "new";

interface PlayerTabsProps {
  activeTab: SortTab;
  onTabChange: (tab: SortTab) => void;
}

export const PlayerScreenTabs = ({ activeTab, onTabChange }: PlayerTabsProps) => {

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">

      <TabBarItem
        label="All Players"
        tabKey="all"
        onClick={onTabChange}
        isActive={activeTab === "all"}
      />

      <TabBarItem
        label="Trending"
        tabKey="trending"
        onClick={onTabChange}
        isActive={activeTab === "trending"}
      />

    </div>
  );
};

type ItemProps = {
  onClick?: (tabName: SortTab) => void,
  tabKey: SortTab,
  label: string,
  isActive?: boolean
}

function TabBarItem({ onClick, tabKey, label, isActive }: ItemProps) {

  const handleClick = () => {
    if (onClick) {
      onClick(tabKey);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${isActive
        ? "bg-gradient-to-r from-primary-500 to-blue-600 text-white"
        : "bg-gray-100 dark:bg-dark-800/40 text-gray-600 dark:text-gray-300"
        }`}
    >
      {label}
    </button>
  )
}