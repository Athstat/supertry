import { User, Check, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { ISbrTeam } from "../../../types/sbrTeam";

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
                "w-full hover:bg-slate-100 dark:hover:bg-slate-800/80 px-3 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer text-xs",
                className
            )}
            onClick={handleClick}
        >

            <div className="w-full flex text-sm text-slate-500 dark:text-slate-400 flex-row items-center justify-between" >
                <p className="text-[10px]" >{title}</p>
                <p className="text-[10px]" >Vote{voteCount > 0 ? "s" : ""} {voteCount}</p>
            </div>

            <div className="flex flex-row gap-1 rounded-xl w-[100%]">
                {/* Voting Circle */}
                <div className={twMerge(
                    "w-4 h-4 border rounded-xl border-slate-400 dark:border-slate-500",
                    (hasUserVoted) && "border-none",
                    !hasUserVoted && ""
                )} >

                    {hasUserVoted && (
                        <div className={twMerge(
                            "w-full h-full flex flex-col items-center justify-center bg-gradient-to-r text-white bg-blue-500 rounded-xl ",
                            isGreen && "bg-green-400",
                            isRed && "bg-red-400"
                        )} >
                            <User className="w-2 h-2" />
                        </div>
                    )}

                </div>

                <div
                    style={{
                        width: `${votePercentage}%`
                    }}
                    className={twMerge(
                        "rounded-xl h-4 text-slate-700  dark:text-slate-400 text-[9px] lg:text-[10px] text-center flex flex-row items-center justify-center bg-slate-300 dark:bg-slate-700",
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

type ResultsProps = {
    votedAwayTeam?: boolean,
    votedHomeTeam?: boolean,
    hasScores: boolean,
    homeTeamWon?: boolean,
    awayTeamWon?: boolean,
    homeVotes?: number,
    awayVotes?: number,  
    homeTeam: string,
    awayTeam: string,
    homeScore?: number,
    awayScore?: number
}

export function VotingOptionsResults({hasScores, votedAwayTeam, votedHomeTeam, awayTeamWon, homeTeamWon, homeVotes = 0, awayVotes = 0, homeTeam, awayTeam, homeScore, awayScore}: ResultsProps) {
    return (
        <div className="flex flex-col w-full text-xs md:text-sm  gap-2 items-center justify-center text-slate-700 dark:text-slate-200" >
            <p>{hasScores ? 'Results' : 'Predictions'}</p>

            <button className={twMerge(
                "border dark:border-slate-700 w-full px-4 rounded-xl py-1.5 flex items-center justify-between",
                hasScores ? (
                    homeTeamWon ? "bg-green-200 dark:bg-green-900/40 dark:border-green-900" :
                        awayTeamWon ? "bg-slate-200 dark:bg-slate-700/40 dark:border-slate-500/60" :
                            "bg-slate-200 dark:bg-slate-800"
                ) : "bg-slate-200 dark:bg-slate-800"
            )} >
                <span className="flex-1 text-left text-[10px]">{homeTeam} Win - {homeVotes} Votes</span>
                <span className="flex items-center gap-1">
                    {votedHomeTeam && <span className="text-[8px] lg:text-sm bg-blue-500 text-white px-2 py-0.5 rounded-full">Your Pick</span>}
                    {hasScores && homeTeamWon && '✓'}
                </span>
            </button>

            <button className={twMerge(
                "border dark:border-slate-700 w-full px-4 rounded-xl py-1.5 flex items-center justify-between",
                hasScores ? (
                    awayTeamWon ? "bg-green-200 dark:bg-green-900/40 dark:border-green-900" :
                        homeTeamWon ? "bg-slate-200 dark:bg-slate-700/40 dark:border-slate-500/60" :
                            "bg-slate-200 dark:bg-slate-800"
                ) : "bg-slate-200 dark:bg-slate-800"
            )} >
                <span className="flex-1 text-left text-[10px]">{awayTeam} Win - {awayVotes} Votes</span>
                <span className="flex items-center gap-1">
                    {votedAwayTeam && <span className="text-[8px] lg:text-sm bg-blue-500 text-white px-2 py-0.5 rounded-full">Your Pick</span>}
                    {hasScores && awayTeamWon && '✓'}
                </span>
            </button>

            {hasScores && (
                <p className="text-[8px] lg:text-xs mt-1">
                    {homeTeamWon ? `${homeTeam} won ${homeScore}-${awayScore}` :
                        awayTeamWon ? `${awayTeam} won ${awayScore}-${homeScore}` :
                            `Match drawn ${hasScores}-${awayScore}`}
                </p>
            )}
        </div>
    )
}