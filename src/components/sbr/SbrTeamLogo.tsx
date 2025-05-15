import { Shield } from "lucide-react"
import { twMerge } from "tailwind-merge"

type Props = {
    teamName?: string,
    className?: string
}

export default function SbrTeamLogo({ teamName, className }: Props) {

    

    return (
        <>
            <Shield className={twMerge(
                "w-7 h-7 text-slate-700 dark:text-slate-400",
                className
            )} />
        </>
    )
}
