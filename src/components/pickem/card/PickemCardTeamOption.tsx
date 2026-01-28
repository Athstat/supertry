import { Loader } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useGameVotes } from "../../../hooks/useGameVotes";
import { gamesService } from "../../../services/gamesService";
import { IFixture } from "../../../types/fixtures"
import { IProTeam } from "../../../types/team"
import { fixtureSummary } from "../../../utils/fixtureUtils";
import TeamLogo from "../../team/TeamLogo";

type Props = {
    team?: IProTeam,
    fixture: IFixture,
    fetchGameVotes?: boolean
}

export default function PickemCardTeamOption({ team, fixture, fetchGameVotes }: Props) {

    const { userVote, mutate } = useGameVotes(fixture, fetchGameVotes);
    const [isVoting, setIsVoting] = useState(false);

    const [clickedButton, setClickedButton] = useState<'home_team' | 'away_team' | 'draw' | null>(
        null
    );

    const { gameKickedOff } = fixtureSummary(fixture);
    const isLocked = gameKickedOff;

    const votedHomeTeam = userVote?.vote_for === 'home_team';
    const votedAwayTeam = userVote?.vote_for === 'away_team';

    const isHomeTeam = fixture.team?.athstat_id === team?.athstat_id;
    const votedForTeam = isHomeTeam ? votedHomeTeam : votedAwayTeam;

    const handleVote = async () => {
        if (isLocked || isVoting) return;

        const voteFor = isHomeTeam ? "home_team" : "away_team";
        setIsVoting(true);
        setClickedButton(voteFor);

        try {
            if (!userVote) {
                await gamesService.postGameVote(fixture.game_id, voteFor);
            } else {
                await gamesService.putGameVote(fixture.game_id, voteFor);
            }

            // Refresh the votes data
            await mutate();
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
            setClickedButton(null);
        }
    };

    const disabled = isLocked || isVoting;

    return (
        <button
            onClick={handleVote}
            disabled={disabled}
            className={twMerge(
                'flex flex-col items-center gap-3 p-3 rounded-xl transition-all duration-200 max-w-[120px] justify-self-start',
                !isLocked && 'hover:bg-slate-100 dark:hover:bg-slate-700/50 active:scale-95 cursor-pointer',
                votedForTeam && !isLocked && 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 shadow-lg',
                disabled && 'cursor-not-allowed opacity-60',
                !isHomeTeam && 'justify-self-end'
            )}
        >
            <div className="relative">
                {clickedButton === 'home_team' && isVoting ? (
                    <div className="w-14 h-14 flex items-center justify-center">
                        <Loader className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <TeamLogo
                        url={team?.image_url}
                        teamName={team?.athstat_name}
                        className={twMerge(
                            'w-14 h-14 transition-transform duration-200',
                            votedHomeTeam && !isLocked && 'scale-110'
                        )}
                    />
                )}
            </div>
            <p className="text-xs text-center font-medium text-slate-700 dark:text-slate-200 line-clamp-2">
                {team?.athstat_name}
            </p>
        </button>
    )
}
