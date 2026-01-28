import { Loader } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useGameVotes } from "../../../hooks/useGameVotes";
import { IFixture, VoteForOption } from "../../../types/fixtures"
import { IProTeam } from "../../../types/team"
import { fixtureSummary } from "../../../utils/fixtureUtils";
import TeamLogo from "../../team/TeamLogo";
import { trimTeamName } from "../../../utils/stringUtils";

type Props = {
    team?: IProTeam,
    fixture: IFixture,
    fetchGameVotes?: boolean,
    onVote?: (voteFor: VoteForOption) => void,
    clickedButton?: VoteForOption | null,
    isVoting?: boolean,
    disabled?: boolean
}

export default function PickemCardTeamOption({ team, fixture, fetchGameVotes, onVote, clickedButton, isVoting, disabled }: Props) {

    const { userVote, percentages } = useGameVotes(fixture, fetchGameVotes);

    const { gameKickedOff } = fixtureSummary(fixture);
    const isLocked = gameKickedOff;

    const votedHomeTeam = userVote?.vote_for === 'home_team';
    const votedAwayTeam = userVote?.vote_for === 'away_team';

    const isHomeTeam = fixture.team?.athstat_id === team?.athstat_id;
    const votedForTeam = isHomeTeam ? votedHomeTeam : votedAwayTeam;

    const handleVote = async () => {
        const voteFor = isHomeTeam ? "home_team" : "away_team";

        if (onVote) {
            onVote(voteFor);
        }
    };

    const isVotingForTeam = isHomeTeam ? clickedButton === "home_team" && isVoting : clickedButton === "away_team" && isVoting
    const votePerc = isHomeTeam ? percentages?.home : percentages?.away;

    const teamName = trimTeamName(team?.athstat_name);

    return (
        <button
            onClick={handleVote}
            disabled={disabled}
            className={twMerge(
                'flex flex-row relative min-w-[145px] h-[100px] items-end gap-3 p-3 rounded-xl transition-all duration-200 max-w-[120px] justify-self-start',
                'bg-[#F9FBFD] dark:bg-slate-800 shadow-[0px_0px_3px_rgba(0,0,0,0.25)]',
                !isLocked && 'hover:bg-slate-100 dark:hover:bg-slate-700/50 active:scale-95 cursor-pointer',
                votedForTeam && !isLocked && 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 shadow-lg',
                disabled && 'cursor-not-allowed opacity-60',
                !isHomeTeam && 'justify-self-end justify-end'
            )}
        >

            {!isHomeTeam && <div className="top-0 left-0 flex flex-col items-center justify-center absolute w-10 h-10" >
                <VoteIndicator isHighlighted={votedForTeam} />
            </div>}

            <div className={twMerge(
                "relative flex flex-col items-start justify-start gap-2",
                !isHomeTeam && "justify-end items-end"
            )}>

                {isVotingForTeam && (
                    <div className="w-14 h-14 flex items-center justify-center">
                        <Loader className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                )}

                {!isVotingForTeam && (
                    <TeamLogo
                        url={team?.image_url}
                        teamName={team?.athstat_name}
                        className={twMerge(
                            'w-10 h-10 transition-transform duration-200',
                            votedHomeTeam && !isLocked && 'scale-110'
                        )}
                    />
                )}

                <div className={twMerge(
                    "text-xs text-center text-nowrap font-medium w-full text-slate-700 dark:text-slate-200 flex flex-row items-center gap-2",
                )} >
                    {!isHomeTeam && <p>{votePerc !== undefined ? `(${votePerc}%)` : ''}</p>}

                    <p className="">
                        {teamName}
                    </p>

                    {isHomeTeam && <p>{votePerc !== undefined ? `(${votePerc}%)` : ''}</p>}
                </div>
            </div>

            {isHomeTeam && <div className="top-0 right-0 flex flex-col items-center justify-center absolute w-10 h-10" >
                <VoteIndicator isHighlighted={votedForTeam} />
            </div>}
        </button>
    )
}

type VoteIndicatorProps = {
    isHighlighted?: boolean,
    className?: string
}

function VoteIndicator({ isHighlighted }: VoteIndicatorProps) {
    return (
        <div className="w-6 h-6 border-2 border-[#838383] flex flex-col items-center justify-center rounded-full" >
            {isHighlighted &&
                <div className="w-4 h-4 border bg-blue-600 rounded-full" ></div>
            }
        </div>
    )
}