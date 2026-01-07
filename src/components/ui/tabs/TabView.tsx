import { ReactNode, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { atom, useAtom } from 'jotai';
import { ScopeProvider } from 'jotai-scope';
import { TabButton } from '../buttons/TabButton';
import { useLocation } from 'react-router-dom';

export const currentTabAtom = atom<string>();

export function useTabView() {
  const [currentTabKey, setTabKey] = useAtom(currentTabAtom);

  const navigate = (key: string) => {
    setTabKey(key);
  };

  return { currentTabKey, navigate };
}

type Props = {
  tabKeySearchParam?: string;
  initialTabKey?: string;
  children?: ReactNode;
  tabHeaderItems: TabViewHeaderItem[];
  className?: string;
};

export default function TabView({
  tabKeySearchParam = 'tabKey',
  initialTabKey,
  children,
  tabHeaderItems,
  className,
}: Props) {
  return (
    <ScopeProvider atoms={[currentTabAtom]}>
      <TabViewInner
        className={className}
        tabKeySearchParam={tabKeySearchParam}
        initialTabKey={initialTabKey}
        tabHeaderItems={tabHeaderItems}
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
  initialTabKey,
}: TabInnerProps) {

  const { currentTabKey, navigate } = useTabView();
  const location = useLocation();

  const enabledTabs = tabHeaderItems.filter(th => {
    return th.disabled !== true;
  });

  useEffect(() => {
    if (currentTabKey === undefined) {
      
      // Try to get tab from URL
      // const params = new URLSearchParams(location.search);
      // const tabFromUrl = params.get(tabKeySearchParam);
      // const tabExists = enabledTabs.some(tab => tab.tabKey === tabFromUrl);

      if (initialTabKey) {
        navigate(initialTabKey);
      } else {
        const firstTab = enabledTabs.length > 0 ? enabledTabs[0] : undefined;
        if (firstTab) {
          navigate(firstTab.tabKey);
        }
      }

    }
  }, [location.search, initialTabKey, currentTabKey, navigate, enabledTabs]);

  return (
    <div className={twMerge('w-full flex flex-col gap-5', className)}>
      {/* Header */}
      <div className="flex flex-row no-scrollbar w-full h-fit border border-slate-200 dark:border-slate-700  bg-white shadow-md dark:bg-slate-800/40 overflow-x-auto">
        {enabledTabs.map((item, index) => {
          return (
            <TabViewButton
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

type TabViewPageProps = {
  children?: ReactNode;
  tabKey: string;
  className?: string;
};

export function TabViewPage({ children, tabKey, className }: TabViewPageProps) {
  const { currentTabKey } = useTabView();
  const isCurrent = currentTabKey === tabKey;

  return (
    <div className={twMerge('flex flex-col', className, !isCurrent && 'hidden')}>
      {/* {currentTabKey} === {tabKey} */}
      {children}
    </div>
  );
}

export type TabViewHeaderItem = {
  label?: string;
  tabKey: string;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  onClick?: () => void;
  isHinted?: boolean,
  hintText?: string
};

function TabViewButton({ label, tabKey, disabled = false, className }: TabViewHeaderItem) {
  const { currentTabKey, navigate } = useTabView();

  const handleTabClick = (newKey: string) => {
    navigate(newKey);
  };

  if (disabled) return <></>;

  return (
    <>
      <TabButton
        active={currentTabKey === tabKey}
        onClick={() => handleTabClick(tabKey)}
        className={className}
      >
        {label}
      </TabButton>
    </>
  );
}
