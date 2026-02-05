import { Loader } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { VoteIndicator } from "./VoteIndicator";
import { useGameVotes } from "../../hooks/useGameVotes";
import { IFixture, VoteForOption } from "../../types/games";
import { fixtureSummary } from "../../utils/fixtureUtils";
import { useInView } from "react-intersection-observer";

type Props = {
    fixture: IFixture,
    fetchGameVotes?: boolean,
    onVote?: (voteFor: VoteForOption) => void,
    disabled?: boolean,
    clickedButton?: VoteForOption | null,
    isVoting?: boolean
}

export default function PickemCardDrawOption({ fixture, fetchGameVotes, onVote, disabled, clickedButton, isVoting }: Props) {

    const { inView, ref } = useInView({ triggerOnce: true });

    const { userVote, percentages } = useGameVotes(
        fixture,
        fetchGameVotes && inView,
    );

    const { gameKickedOff } = fixtureSummary(fixture);
    const isLocked = gameKickedOff;

    const votedDraw = userVote?.vote_for === 'draw';

    const handleVote = () => {
        if (onVote) {
            onVote("draw");
        }
    };

    const votePerc = percentages.draw;
    const showVote = userVote !== undefined && votePerc !== undefined;

    return (
        <>
            <div ref={ref} ></div>
            
            <button
                onClick={handleVote}
                disabled={disabled}
                className={twMerge(
                    'flex flex-col relative items-center justify-between w-full gap-2 px-4 py-3 rounded-md h-full transition-all duration-200 justify-self-center',
                    'bg-[#F9FBFD] dark:bg-slate-800 shadow-[0px_0px_3px_rgba(0,0,0,0.25)]',
                    !isLocked && 'hover:bg-slate-100 dark:hover:bg-slate-700/50 active:scale-95 cursor-pointer',
                    votedDraw && !isLocked && 'bg-slate-200 dark:bg-slate-600 ring-2 ring-slate-500 shadow-lg',
                    disabled && 'cursor-not-allowed opacity-60',
                )}
            >

                <VoteIndicator isHighlighted={votedDraw} />

                <div className="relative">
                    {clickedButton === 'draw' && isVoting ? (
                        <Loader className="w-5 h-5 animate-spin text-slate-600 dark:text-slate-300" />
                    ) : (
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">DRAW  {showVote ? `(${votePerc}%)` : null}</span>
                    )}
                </div>
            </button>
        </>
    )
}