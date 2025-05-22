import { ReactNode, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { atom, useAtom } from "jotai";
import { ScopeProvider } from "jotai-scope";
import { TabButton } from "../TabButton";

const currentTabAtom = atom<string>();

export function useTabView() {

    const [currentTabKey, setTabKey] = useAtom(currentTabAtom);

    const navigate = (key: string) => {
        setTabKey(key);
    }

    return { currentTabKey, navigate }
}

type Props = {
    tabKeySearchParam?: string,
    children?: ReactNode,
    tabHeaderItems: TabViewHeaderItem[]
}

export default function TabView({ tabKeySearchParam = "tabKey", children, tabHeaderItems }: Props) {


    return (
        <ScopeProvider atoms={[currentTabAtom]}>
            <TabViewInner tabKeySearchParam={tabKeySearchParam} tabHeaderItems={tabHeaderItems}>
                {children}
            </TabViewInner>
        </ScopeProvider>
    )
}

type TabInnerProps = Props;

function TabViewInner({ tabHeaderItems, children }: TabInnerProps) {

    const {currentTabKey, navigate} = useTabView();
    
    const enabledTabs = tabHeaderItems.filter((th) => {
        return th.disabled !== true;
    });

    useEffect(() => {

        if (currentTabKey === undefined) {
            const firstTab = enabledTabs.length > 0 ? enabledTabs[0] : undefined;
            
            if (firstTab) {
                navigate(firstTab.tabKey);
            }
        }

    }, []);

    return (
        <div className="w-full flex flex-col gap-5" >

            {/* Header */}
            <div className="flex flex-row w-full h-10">
                {enabledTabs.map((item, index) => {
                    return (
                        <TabViewButton className={item.className} label={item.label} disabled={item.disabled} tabKey={item.tabKey} key={index} />
                    )
                })}
            </div>

            <div>
                {children}
            </div>

        </div>
    )
}

type TabViewPageProps = {
    children?: ReactNode,
    tabKey: string,
    className?: string
}

export function TabViewPage({ children, tabKey, className }: TabViewPageProps) {

    const { currentTabKey } = useTabView();

    if (currentTabKey === tabKey) {

        return (
            <div className={twMerge("flex flex-col", className)} >
                {children}
            </div>
        )
    }

    return <></>

}

export type TabViewHeaderItem = {
    label?: string,
    tabKey: string,
    disabled?: boolean,
    className?: string
}

function TabViewButton({ label, tabKey, disabled = false, className }: TabViewHeaderItem) {

    const { currentTabKey, navigate } = useTabView();

    const handleTabClick = (newKey: string) => {
        navigate(newKey);
    }

    if (disabled) return <></>

    return (
        <TabButton
            active={currentTabKey === tabKey}
            onClick={() => handleTabClick(tabKey)}
            className={className}
        >
            {label}
        </TabButton>
    )
}