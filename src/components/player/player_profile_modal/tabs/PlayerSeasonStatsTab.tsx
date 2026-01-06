import { usePlayerData } from "../../../../providers/PlayerDataProvider";
import { IProAthlete } from "../../../../types/athletes"
import NoContentCard from "../../../ui/typography/NoContentMessage";
import PlayerSeasonStatsCard from "../../PlayerSeasonStatsCard";

type Props = {
    player: IProAthlete
}

export default function PlayerSeasonStatsTab({ player }: Props) {

    const { sortedSeasons } = usePlayerData();
    return (
        <div>
            {sortedSeasons.length === 0 && (
                <NoContentCard message={`Career stats for ${player.player_name} are not available`} />
            )}

            {sortedSeasons.length > 0 && (
                <div className="flex flex-col gap-4">
                    {sortedSeasons.map(s => {
                        return <PlayerSeasonStatsCard player={player} season={s} key={s.id} hideTitle />;
                    })}
                </div>
            )}
        </div>
    )
}
