import { Loader } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useGameVotes } from "../../../hooks/useGameVotes";
import { fixtureSummary } from "../../../utils/fixtureUtils";
import { IFixture, VoteForOption } from "../../../types/fixtures";

type Props = {
    fixture: IFixture,
    fetchGameVotes?: boolean,
    onVote?: (voteFor: VoteForOption) => void,
    disabled?: boolean,
    clickedButton?: VoteForOption | null,
    isVoting?: boolean
}

export default function PickemCardDrawOption({fixture, fetchGameVotes, onVote, disabled, clickedButton, isVoting} : Props) {

    const { userVote } = useGameVotes(
        fixture,
        fetchGameVotes
    );

    const { gameKickedOff } = fixtureSummary(fixture);
    const isLocked = gameKickedOff;

    const votedDraw = userVote?.vote_for === 'draw';

    const handleVote = () => {
        if (onVote) {
            onVote("draw");
        }
    };
    return (
        <button
            onClick={handleVote}
            disabled={disabled}
            className={twMerge(
                'flex flex-col items-center gap-2 px-4 py-3 rounded-full transition-all duration-200 max-w-[100px] justify-self-center',
                !isLocked && 'hover:bg-slate-100 dark:hover:bg-slate-700/50 active:scale-95 cursor-pointer',
                votedDraw && !isLocked && 'bg-slate-200 dark:bg-slate-600 ring-2 ring-slate-500 shadow-lg',
                disabled && 'cursor-not-allowed opacity-60',
                'border-2 border-slate-300 dark:border-slate-600'
            )}
        >
            <div className="relative">
                {clickedButton === 'draw' && isVoting ? (
                    <Loader className="w-5 h-5 animate-spin text-slate-600 dark:text-slate-300" />
                ) : (
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">DRAW</span>
                )}
            </div>
        </button>
    )
}
