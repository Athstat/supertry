interface LeagueTabsProps {
  value: 'my' | 'discover' | 'code';
  onChange: (val: 'my' | 'discover' | 'code') => void;
  className?: string;
}

const tabMeta: { key: LeagueTabsProps['value']; label: string }[] = [
  { key: 'my', label: 'My Leagues' },
  { key: 'discover', label: 'Discover' },
  { key: 'code', label: 'Join by Code' },
];

export default function LeagueTabs({ value, onChange, className = '' }: LeagueTabsProps) {
  return (
    <div className={`w-full bg-white dark:bg-gray-900 rounded-xl p-1 border border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="grid grid-cols-3 gap-1">
        {tabMeta.map(tab => {
          const isActive = value === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={
                `text-sm sm:text-base px-3 py-2 rounded-lg font-medium transition-colors truncate ` +
                (isActive
                  ? 'bg-primary-600 text-white shadow'
                  : 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800')
              }
              aria-pressed={isActive}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
