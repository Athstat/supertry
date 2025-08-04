import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode } from "react"

type Props = {
    icon?: ReactNode,
    label?: string,
    children?: ReactNode,
    open?: boolean,
    toggle?: () => void
}

export default function Collapsable({ icon, label, children, open, toggle }: Props) {

    const handleToggle = () => {
        if (toggle) {
            toggle();
        }
    }

    return (
        <div className="bg-slate-300 border border-slate-100 dark:border-slate-600  dark:bg-slate-700/60 p-1 rounded-md" >
            <div onClick={handleToggle} className="w-full cursor-pointer px-2 py-1 flex flex-row items-center justify-between rounded-md bg-slate-200 dark:bg-slate-800" >
                <div className="flex flex-row items-center gap-1" >
                    {icon}
                    <p className="text-sm" >{label}</p>
                </div>

                <div>
                    {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" /> }
                </div>
            </div>

            {open ? children : undefined}
        </div>
    )
}
