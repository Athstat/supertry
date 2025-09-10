import { X } from "lucide-react"
import RoundedCard from "../../shared/RoundedCard"
import { Video } from "lucide-react"
import { twMerge } from "tailwind-merge"

type Props = {
    className?: string
}

/** Renders a notifice to learn the basics of scrummy to a user */
export default function LearnScrummyNoticeCard({ className }: Props) {
    return (
        <RoundedCard className={twMerge(
            "flex flex-row items-center border-none gap-2 py-2 px-3 justify-between",
            className
        )} >

            <div className="flex flex-row items-center gap-2" >
                <button><X className="w-4 h-4 text-slate=700 dark:text-slate-400" /></button>


                <div>
                    <p className="text-sm" >New to SCRUMMY? Learn how the game works</p>
                </div>
            </div>

            <div>
                <Video />
            </div>
        </RoundedCard>
    )
}
