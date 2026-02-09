import { useCallback, useState } from "react"
import { IProAthlete } from "../../../../types/athletes";
import { IFixture } from "../../../../types/games";
import { FixtureVotingCard } from "../../../pickem/voting/FixtureVotingCard";
import PlayerProfileModal from "../../../player/PlayerProfileModal";
import SeasonStandingsTable from "../../../seasons/SeasonStandingsTable";
import FixtureSeasonLeaders from "../cards/FixtureSeasonLeaders";
import FixtureTeamStats from "../cards/FixtureTeamStats";
import PastMatchupsCard from "../cards/PastMatchupsCard";

type Props = {
    fixture: IFixture
}

export default function FixtureH2HTab({ fixture }: Props) {

    const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();

    const handleClickSeasonLeader = useCallback((player: IProAthlete) => {
        setSelectedPlayer(player);
    }, []);

    const handleClosePlayerProfile = () => {
        setSelectedPlayer(undefined);
    }

    return (
        <div className="px-4 flex flex-col gap-4" >


            <FixtureTeamStats
                fixture={fixture}
            />

            <PastMatchupsCard
                fixture={fixture}
            />


            <FixtureVotingCard
                fixture={fixture}
            />

            <SeasonStandingsTable
                seasonId={fixture.league_id}
                filterTeamIds={[fixture.team?.athstat_id ?? "", fixture.opposition_team?.athstat_id ?? ""]}
            />

            <FixtureSeasonLeaders
                fixture={fixture}
                onPlayerClick={handleClickSeasonLeader}
            />

            {selectedPlayer && <PlayerProfileModal
                player={selectedPlayer}
                isOpen={Boolean(selectedPlayer)}
                onClose={handleClosePlayerProfile}
            />}

        </div>
    )
}
