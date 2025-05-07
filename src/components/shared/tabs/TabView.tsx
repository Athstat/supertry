import { createContext, ReactNode, useContext } from "react";
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
    tabHeaderItems: TabViewButtonProps[]
}

export default function TabView({ tabKeySearchParam = "tabKey", children, tabHeaderItems }: Props) {


    return (
        <TabViewContext.Provider value={{ tabKeySearchParam: tabKeySearchParam }} >
            <div className="w-full flex flex-col" >

                {/* Header */}
                <div className="flex flex-row w-full h-10">
                    {tabHeaderItems.map((item, index) => {
                        return (
                            <TabViewButton label={item.label} tabKey={item.tabKey} key={index}  />
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

type TabViewButtonProps = {
    label?: string,
    tabKey: string
}

function TabViewButton({label, tabKey} : TabViewButtonProps) {

    const {currentTabKey, changeTabKey} = useTabView();

    const handleTabClick = (newKey: string) => {
        changeTabKey(newKey);
    }

    return (
        <TabButton
            active={currentTabKey === tabKey}
            onClick={() => handleTabClick(tabKey)}
        >
            {label}
        </TabButton>
    )
}