import { useState } from 'react';
import { IFantasyLeagueRound } from '../../../types/fantasyLeague';
import { IFantasyTeamAthlete } from '../../../types/fantasyTeamAthlete';
import { FantasyTeamAthleteCard } from '../../team/FantasyTeamAthleteCard';
import { TeamFormation } from '../../team/TeamFormation';

type Props = {
    leagueRound: IFantasyLeagueRound,
    editableAthletesBySlot: Record<number, IFantasyTeamAthlete | undefined>
}

/** Renders my team pitch view */
export default function MyTeamPitchView({ leagueRound, editableAthletesBySlot }: Props) {

    const [selectedPlayer, setSelectedPlayer] = useState<IFantasyTeamAthlete>();

    const [showActionModal, setShowActionModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPointsModal, setShowPointsModal] = useState(false);

    const handlePlayerClick = (player: IFantasyTeamAthlete) => {
        setSelectedPlayer(player);
        setShowActionModal(true);
    }

    const starters = Object.values(editableAthletesBySlot)
        .filter((p): p is IFantasyTeamAthlete => Boolean(p))
        .map(p => ({ ...p!, is_starting: p!.slot !== 6 }));

    const superSub = Object.values(editableAthletesBySlot)
        .filter((player): player is IFantasyTeamAthlete => Boolean(player))
        .find(player => player.slot === 6);

    return (
        <div className="mt-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Team Formation
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide font-medium mb-4">
                    Greyed out players are not playing in this round's games
                </p>
                {leagueRound && starters.length > 0 && <TeamFormation
                    players={starters}
                    onPlayerClick={handlePlayerClick}

                    round={leagueRound}
                />}
            </div>

            {/* Super Substitute */}
            {leagueRound && Object.values(editableAthletesBySlot).some(p => p && p.slot === 6) && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                        <span>Super Substitute</span>
                        <span className="ml-2 text-orange-500 text-sm px-2 py-0.5 rounded-full">
                            Special
                        </span>
                    </h2>
                    <div className="rounded-xl p-4 w-40 pt-12">
                        {superSub &&
                            <FantasyTeamAthleteCard
                                player={superSub}
                                onPlayerClick={handlePlayerClick}
                                round={leagueRound}
                                pointsClassName='text-black dark:text-white'
                            />
                        }
                    </div>
                </div>
            )}
        </div>
    )
}
