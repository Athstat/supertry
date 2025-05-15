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
                "w-8 h-8 text-slate-400 dark:text-slate-400",
                className
            )} />
        </>
    )
}
