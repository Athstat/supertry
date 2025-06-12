import { twMerge } from "tailwind-merge";

type Props = {
    message?: string,
    icon?: any,
    className?: string,
}

/** Renders a card that shows a message when there is no content */
export default function NoContentCard({ message, icon, className}: Props) {

    const Icon = icon;
    const iconClassName = 'text-2xl';

    return (
        <div className={twMerge(
            "w-full h-full text-slate-500 dark:text-slate-400 text-sm p-4 py-6 flex flex-col gap-2 items-center justify-center ",
            className
        )} >
            
            {icon ? <Icon className={iconClassName} /> : null}
            
            <p className="w-2/3 text-center" >{message}</p>
        </div>
    )
}
