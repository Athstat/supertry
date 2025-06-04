import React from 'react';

interface TabsNavigationProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`
              flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 relative
              ${activeTab === index
                ? 'text-primary-600 dark:text-primary-500 border-primary-600 dark:border-primary-500'
                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'}
            `}
            onClick={() => onTabChange(index)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsNavigation;
