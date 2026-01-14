import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type OptionProps = {
    label?: string,
    value?: string,
    current?: string,
    onSelect?: (val: string) => void,
    icon?: ReactNode,
    className?: string
}

export function TabSwitchOption({ label, current, value, onSelect, icon, className }: OptionProps) {

    const isCurrent = current === value;

    const handleOnClick = () => {
        if (onSelect && value) {
            onSelect(value);
        }
    }

    return (
        <div
            className={twMerge(
                "flex-1 text-xs cursor-pointer h-full flex flex-row gap-1 text-slate-700 dark:text-slate-300 rounded-xl items-center justify-center",
                // isCurrent && AppColours.BACKGROUND,
                isCurrent && "bg-blue-600 text-white dark:text-white",
                className
            )}
            onClick={handleOnClick}
        >
            <p className="">{label}</p>
            {icon}
        </div>
    )
}


type TabSwitchContainerProps = {
    children?: ReactNode,
    className?: string
}

/** Renders a tab switch container object */
export function TabSwitchContainer({children, className} : TabSwitchContainerProps) {
    return (
        <div className={twMerge(
            "bg-slate-200 border dark:border-slate-700/50 dark:bg-slate-800 overflow-clip p-1 w-full h-[45px] rounded-xl flex flex-row items-center justify-between",
            className
        )} >
            {children}
        </div>
    )
}