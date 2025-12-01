import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
    pr?: number,
    className?: string
}

type TierColour = "purple" | "green" | "yellow" | "red" | "none";

/** Renders a match PR card */
export default function MatchPrCard({ pr}: Props) {

    const tier = useMemo<TierColour>(() => {
        
        if (!pr) {
            return "none";
        }

        if (pr >= 90) {
            return "purple";
        }

        if (pr >= 80) {
            return "green";
        }

        if (pr >= 60) {
            return "yellow"
        }

        if (pr <= 59) {
            return "red";
        }

        return "none";
    }, [pr]);

    if (!pr) {
        return;
    }



    return (
        <div className={twMerge(
            "w-8 h-8 rounded-md dark:bg-slate-600 flex flex-col items-center justify-center",
            tier === "purple" && "bg-purple-500 dark:bg-purple-500",
            tier === "green" && "bg-green-500 dark:bg-green-600",
            tier === "yellow" && "bg-yellow-500 dark:bg-yellow-600",
            tier === "red" && "bg-red-500 dark:bg-red-600",
        )} >
            <p className="text-sm" >{pr}</p>
        </div>
    )
}

/** Renders a match PR card */
export function SmallMatchPrCard({ pr, className }: Props) {

    const tier = useMemo<TierColour>(() => {
        
        if (!pr) {
            return "none";
        }

        if (pr >= 90) {
            return "purple";
        }

        if (pr >= 80) {
            return "green";
        }

        if (pr >= 60) {
            return "yellow"
        }

        if (pr <= 59) {
            return "red";
        }

        return "none";
    }, [pr]);

    if (!pr) {
        return;
    }



    return (
        <div className={twMerge(
            "w-6 h-6 rounded-md dark:bg-slate-600 flex flex-col items-center border-2 border-green-800 dark:border-green-800 justify-center",
            tier === "purple" && "bg-purple-500 dark:bg-purple-500 ",
            tier === "green" && "bg-green-500 dark:bg-green-600  ",
            tier === "yellow" && "bg-yellow-500 dark:bg-yellow-600 ",
            tier === "red" && "bg-red-500 dark:bg-red-600",
            className
        )} >
            <p className="text-xs font-semibold" >{pr}</p>
        </div>
    )
}
