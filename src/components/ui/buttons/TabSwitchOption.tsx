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
                isCurrent && "bg-blue-500 dark:bg-blue-600 text-white dark:text-white",
                className
            )}
            onClick={handleOnClick}
        >
            <p className="">{label}</p>
            {icon}
        </div>
    )
}
