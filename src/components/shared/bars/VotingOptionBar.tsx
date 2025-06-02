import { User, Check, X } from "lucide-react";
import { twMerge } from "tailwind-merge";

type Props = {
    isGreen?: boolean,
    isRed?: boolean,
    title?: string,
    voteCount?: number,
    hasUserVoted?: boolean,
    votePercentage?: number,
    onClick?: () => void,
    className?: string,
    disable?: boolean
}

export function VotingOptionBar({ isGreen, isRed, title, voteCount = 0, disable, hasUserVoted, votePercentage, onClick, className }: Props) {

    const handleClick = () => {
        if (onClick && !disable) {
            onClick();
        }
    }

    return (
        <div
            className={twMerge(
                "w-full hover:bg-slate-100 dark:hover:bg-slate-800/80 px-3 py-2 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer",
                className
            )}
            onClick={handleClick}
        >

            <div className="w-full flex text-slate-500 dark:text-slate-400 flex-row items-center justify-between" >
                <p className="text-xs" >{title}</p>
                <p className="text-xs " >Vote{voteCount > 0 ? "s" : ""} {voteCount}</p>
            </div>

            <div className="flex flex-row gap-1 rounded-xl w-[100%]">
                {/* Voting Circle */}
                <div className={twMerge(
                    "w-5 h-5 border rounded-xl border-slate-400 dark:border-slate-500",
                    (hasUserVoted) && "border-none",
                    !hasUserVoted && ""
                )} >

                    {hasUserVoted && (
                        <div className={twMerge(
                            "w-full h-full flex flex-col items-center justify-center bg-gradient-to-r text-white bg-blue-500 rounded-xl ",
                            isGreen && "bg-green-400",
                            isRed && "bg-red-400"
                        )} >
                            <User className="w-3 h-3" />
                        </div>
                    )}

                </div>

                <div
                    style={{
                        width: `${votePercentage}%`
                    }}
                    className={twMerge(
                        "rounded-xl h-5 text-slate-700  dark:text-slate-400 text-[9px] lg:text-[10px] text-center flex flex-row items-center justify-center bg-slate-300 dark:bg-slate-700",
                        hasUserVoted && "bg-gradient-to-r text-white dark:text-white from-blue-600 to-blue-700",
                        isGreen && "bg-gradient-to-r from-green-400 to-green-400",
                        isRed && "bg-gradient-to-r from-red-400 to-red-400 ",
                    )}
                >
                    {/* <p className="truncate" >{voteCount} Votes</p> */}
                </div>

                <div className=" h-5  flex flex-row items-center justify-center" >
                    {isGreen && <Check className="w-3 h-3" />}
                    {isRed && <X className="w-3 h-3" />}
                </div>
            </div>
        </div>
    )
}