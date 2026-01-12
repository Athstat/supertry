/* eslint-disable @typescript-eslint/no-explicit-any */

import { twMerge } from "tailwind-merge";

type Props = {
    message?: string,
    icon?: any,
    className?: string,
    messageClassName?: string
}

/** Renders a card that shows a message when there is no content */
export default function NoContentCard({ message, icon, className, messageClassName}: Props) {

    const Icon = icon;
    const iconClassName = 'text-2xl';

    return (
        <div className={twMerge(
            "w-full h-full text-slate-500 dark:text-slate-400 text-sm p-4 py-6 flex flex-col gap-2 items-center justify-center ",
            className
        )} >
            
            {icon ? <Icon className={iconClassName} /> : null}
            
            <p className={twMerge(
                "w-2/3 text-center",
                messageClassName
            )} >{message}</p>
        </div>
    )
}
