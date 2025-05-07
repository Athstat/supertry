import { createContext, ReactNode, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { TabButton } from "../TabButton";

export type TabViewContextProps = {
    tabKeySearchParam: string
}

const TabViewContext = createContext<TabViewContextProps>({
    tabKeySearchParam: "tabKey"
});

export function useTabView(tabKeySearchParam?: string) {

    const context = useContext(TabViewContext);
    const paramKey = tabKeySearchParam ?? context.tabKeySearchParam;

    const [searchParams, replace] = useSearchParams();

    const currentTabKey = searchParams.get(paramKey);

    const changeTabKey = (tabKey: string) => {
        searchParams.set(paramKey, tabKey);
        replace(searchParams);
    }

    return { currentTabKey, changeTabKey }

}

type Props = {
    tabKeySearchParam?: string,
    children?: ReactNode,
    tabHeaderItems: TabViewHeaderItem[]
}

export default function TabView({ tabKeySearchParam = "tabKey", children, tabHeaderItems }: Props) {

    const [searchParams, replace] = useSearchParams();
    const enabledTabs = tabHeaderItems.filter(t => t.disabled === false);

    useEffect(() => {
        if (enabledTabs.length > 0 && !searchParams.has(tabKeySearchParam)) {
            const firstTab = enabledTabs[0];

            if (firstTab.disabled === false) {   
                searchParams.set(tabKeySearchParam, firstTab.tabKey);
                replace(searchParams);
            }

        }

    }, [tabHeaderItems]);

    return (
        <TabViewContext.Provider value={{ tabKeySearchParam: tabKeySearchParam }} >
            <div className="w-full flex flex-col" >

                {/* Header */}
                <div className="flex flex-row w-full h-10">
                    {enabledTabs.map((item, index) => {
                        return (
                            <TabViewButton label={item.label} disabled={item.disabled} tabKey={item.tabKey} key={index} />
                        )
                    })}
                </div>

                <div>
                    {children}
                </div>

            </div>
        </TabViewContext.Provider>
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
    disabled?: boolean
}

function TabViewButton({ label, tabKey, disabled = false }: TabViewHeaderItem) {

    const { currentTabKey, changeTabKey } = useTabView();

    const handleTabClick = (newKey: string) => {
        changeTabKey(newKey);
    }

    if (disabled) return <></>

    return (
        <TabButton
            active={currentTabKey === tabKey}
            onClick={() => handleTabClick(tabKey)}
        >
            {label}
        </TabButton>
    )
}