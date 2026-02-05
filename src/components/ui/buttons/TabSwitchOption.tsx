import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type OptionProps = {
    label?: string,
    value?: string,
    current?: string,
    onSelect?: (val: string) => void,
    icon?: ReactNode,
    className?: string,
    dataTutorial?: string
}

export function TabSwitchOption({ label, current, value, onSelect, icon, className, dataTutorial }: OptionProps) {

    const isCurrent = current === value;

    const handleOnClick = () => {
        if (onSelect && value) {
            onSelect(value);
        }
    }

    return (
        <div
            className={twMerge(
                "flex-1 text-sm cursor-pointer h-full flex flex-row gap-1 text-slate-700 font-bold px-8 dark:text-slate-300 rounded-full items-center justify-center",
                // isCurrent && AppColours.BACKGROUND,
                'dark:hover:bg-slate-700/60',
                isCurrent && "bg-blue-600 dark:bg-blue-600 text-white dark:text-white dark:hover:bg-blue-700",

                className
            )}
            onClick={handleOnClick}
            data-tutorial={dataTutorial}
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
            "bg-slate-200 border-none dark:border-slate-700/50 dark:bg-black/80 overflow-clip p-[2px] w-full h-[40px] flex flex-row items-center justify-between rounded-full",
            className
        )} >
            {children}
        </div>
    )
}
