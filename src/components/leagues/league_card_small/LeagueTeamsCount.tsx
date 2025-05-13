import { Loader, Users } from "lucide-react"
import { useFetch } from "../../../hooks/useFetch"
import { leagueService } from "../../../services/leagueService"
import { IFantasyLeague } from "../../../types/fantasyLeague"

type Props = {
    league: IFantasyLeague
}

export default function LeagueTeamsCount({league} : Props) {

    const {data, isLoading} = useFetch(
        "participants",
        league.id,
        leagueService.fetchParticipatingTeams
    );

    const count = data?.length ?? 0;

    return (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users size={16} />
            <span>
                {isLoading ? (
                    <Loader size={12} className="animate-spin" />
                ) : (
                    `${count} teams joined`
                )}
            </span>
        </div>
    )
}
