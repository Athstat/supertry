import { Users } from "lucide-react";
import { IFantasyLeagueRound, IFantasyLeagueTeam } from "../../types/fantasyLeague";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import FantasyRoundCard from "./fantasy_rounds/FantasyRoundCard";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";

type Props = {
    rounds: IFantasyLeagueRound[],
    handleCreateTeam: (round: IFantasyLeagueRound) => void,
    handleViewTeam: (team: IFantasyLeagueTeam, round: IFantasyLeagueRound) => void,
    handlePlayerClick: (player: IFantasyTeamAthlete) => void,
    refreshRounds: () => void
}

/** Renders a list of rounds */
export default function FantasyRoundsList({ rounds, handleCreateTeam, handleViewTeam, handlePlayerClick, refreshRounds }: Props) {

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start justify-start">
                <div className="flex flex-row items-center gap-2">
                    <Users />
                    <p className="font-bold text-xl">My Teams</p>
                </div>
                <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                    Choose a round to create or view your team
                </p>
            </div>

            <div className="">

                {rounds.map(round => (
                    <div key={round.id} className="py-3">
                        <FantasyRoundCard
                            round={round}
                            onCreateTeam={() => handleCreateTeam(round)}
                            onViewTeam={handleViewTeam}
                            onPlayerClick={handlePlayerClick}
                        />
                    </div>
                ))}

                {(rounds.length ?? 0) === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        No rounds available
                        <div className="mt-4 flex justify-center">
                            <PrimaryButton className="w-auto px-6" onClick={() => refreshRounds()}>
                                Refresh
                            </PrimaryButton>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );

}
