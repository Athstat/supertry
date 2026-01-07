import { Calendar } from "lucide-react"
import { IFantasyLeagueRound } from "../../../types/fantasyLeague"
import { swrFetchKeys } from "../../../utils/swrKeys"
import useSWR from "swr"
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService"
import SmallFixtureCard from "../../fixture/SmallFixtureCard"

type Props = {
    leagueRound: IFantasyLeagueRound
}

export default function LeagueRoundFixturesOverview({ leagueRound }: Props) {

    const key = swrFetchKeys.getGroupRoundGames(leagueRound.fantasy_league_group_id, leagueRound.id);
    const { data: fetchedGames } = useSWR(key, () =>
        fantasyLeagueGroupsService.getGroupRoundGames(leagueRound.fantasy_league_group_id, leagueRound.id)
    );

    const games = (fetchedGames ?? []);

    return (
        <div className="flex flex-col gap-4" >
            <div className="flex flex-row items-center gap-2" >
                <Calendar className="" />
                <p className="font-bold text-lg" >Fixtures</p>
            </div>

            <div className="flex flex-col gap-2" >
                {games.map((g) => {
                    return (
                        <div>
                            <SmallFixtureCard fixture={g} />
                        </div>
                    )
                })}
            </div>

        </div>
    )
}
