import { ReactNode, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { ScopeProvider } from 'jotai-scope';
import { useLocation } from 'react-router-dom';
import { currentTabAtom, useTabView } from './TabView';

type Props = {
  tabKeySearchParam?: string;
  initialTabKey?: string;
  children?: ReactNode;
  tabHeaderItems: TabViewHeaderItem[];
  className?: string;
  pillTabRowClassName?: string;
};

export default function PilledTabView({
  tabKeySearchParam = 'tabKey',
  initialTabKey,
  children,
  tabHeaderItems,
  className,
  pillTabRowClassName
}: Props) {
  return (
    <ScopeProvider atoms={[currentTabAtom]}>
      <TabViewInner
        className={className}
        tabKeySearchParam={tabKeySearchParam}
        initialTabKey={initialTabKey}
        tabHeaderItems={tabHeaderItems}
        pillTabRowClassName={pillTabRowClassName}
      >
        {children}
      </TabViewInner>
    </ScopeProvider>
  );
}

type TabInnerProps = Props;

function TabViewInner({
  tabHeaderItems,
  children,
  className,
  tabKeySearchParam = 'tabKey',
  initialTabKey,
  pillTabRowClassName
}: TabInnerProps) {
  
  const { currentTabKey, navigate } = useTabView();
  const location = useLocation();

  const enabledTabs = tabHeaderItems.filter(th => {
    return th.disabled !== true;
  });

  useEffect(() => {
    if (currentTabKey === undefined) {
      // Try to get tab from URL first
      const params = new URLSearchParams(location.search);
      const tabFromUrl = params.get(tabKeySearchParam);
      const tabExists = enabledTabs.some(tab => tab.tabKey === tabFromUrl);

      if (tabFromUrl && tabExists) {
        navigate(tabFromUrl);
      } else if (initialTabKey && enabledTabs.some(tab => tab.tabKey === initialTabKey)) {
        // Fallback to provided initial tab key if valid
        navigate(initialTabKey);
      } else {
        // Finally default to the first enabled tab
        const firstTab = enabledTabs.length > 0 ? enabledTabs[0] : undefined;
        if (firstTab) {
          navigate(firstTab.tabKey);
        }
      }
    }
  }, [location.search, initialTabKey, currentTabKey, tabKeySearchParam, enabledTabs, navigate]);

  return (
    <div className={twMerge('w-full flex flex-col gap-5', className)}>
      {/* Header */}
      <div className={twMerge("flex flex-row no-scrollbar gap-1 w-full h-fit overflow-x-auto", pillTabRowClassName)}>
        {enabledTabs.map((item, index) => {
          return (
            <PilledTabViewButton
              className={item.className}
              label={item.label}
              disabled={item.disabled}
              tabKey={item.tabKey}
              key={index}
            />
          );
        })}
      </div>

      <div>{children}</div>
    </div>
  );
}

export type TabViewHeaderItem = {
  label?: string;
  tabKey: string;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
};

function PilledTabViewButton({ label, tabKey, disabled = false, className }: TabViewHeaderItem) {
  const { currentTabKey, navigate } = useTabView();

  const handleTabClick = (newKey: string) => {
    navigate(newKey);
  };

  if (disabled) return <></>;

  return (
    <PilledTabButton
      active={currentTabKey === tabKey}
      onClick={() => handleTabClick(tabKey)}
      className={className}
    >
      {label}
    </PilledTabButton>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function PilledTabButton({ active, onClick, children, className }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        `px-4 py-1.5 border w-fit font-medium dark:border-slate-600 bg-slate-200 dark:bg-slate-700/40 text-nowrap dark:text-slate-200 rounded-xl text-xs md:text-sm lg:text-base ${
          active
            ? 'bg-blue-600 border-blue-500 dark:border-blue-500 dark:bg-blue-600 text-white dark:blue-blue-500 dark:text-white'
            : ' text-gray-600 hover:text-gray-900 '
        }`,
        className
      )}
      aria-label={`View ${children} tab`}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {children}
    </button>
  );
}
