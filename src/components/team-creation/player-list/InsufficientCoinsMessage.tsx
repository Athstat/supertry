import { Info } from "lucide-react"
import { twMerge } from "tailwind-merge"

type Props = {
    className?: string
}

/** Renders message to display to the user when the number of 
 * of coins they have left in their budget is not enough to afford
 * any player
 */
export default function InsufficientCoinsState({ className }: Props) {

    const message = `No players available within your current budget. Free up some coins and try again.`

    return (
        <div className={twMerge(
            "flex flex-row p-5 items-center justify-center text-start text-red-700 dark:text-red-200 bg-red-200 dark:bg-red-700/50 rounded-xl",
            "gap-3",
            className
        )} >
            <div>
                <Info />
            </div>
            {message}
        </div>
    )
}
