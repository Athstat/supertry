import useSWR from "swr"
import { IProAthlete } from "../../../types/athletes"
import { swrFetchKeys } from "../../../utils/swrKeys"
import { djangoAthleteService } from "../../../services/athletes/djangoAthletesService"
import { Users } from "lucide-react"
import SecondaryText from "../../shared/SecondaryText"
import RoundedCard from "../../shared/RoundedCard"
import PlayerMugshot from "../../shared/PlayerMugshot"
import TeamLogo from "../../team/TeamLogo"

type Props = {
    player: IProAthlete
}
export default function RelatedPlayersList({ player }: Props) {

    const teamMatesKey = swrFetchKeys.getAthleteTeamMates(player.tracking_id);
    const { data: teamMates, isLoading } = useSWR(teamMatesKey, () => djangoAthleteService.getAthleteTeamMates(player.tracking_id));

    if (isLoading) {
        return (
            <div>
                <RoundedCard
                    className="border-none w-15 h-15 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
                />

                <RoundedCard
                    className="border-none w-15 h-15 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
                />

                <RoundedCard
                    className="border-none w-15 h-15 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
                />

                <RoundedCard
                    className="border-none w-15 h-15 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
                />
            </div>
        )
    }

    if (!teamMates || teamMates.length === 0) return;

    return (
        <div className="flex flex-col gap-4" >
            <SecondaryText className="flex flex-row items-center gap-2" >
                <Users className="w-4 h-4" />
                <p>{player.team.athstat_name} Team Mates</p>
            </SecondaryText>

            <div className="flex flex-row overflow-x-auto gap-2" >

                <TeamLogo
                    teamName={player.team.athstat_name}
                    url={player.team.image_url}
                    className="w-20 h-20 flex-shrink-0"
                    key={player.team.athstat_id}
                />

                {teamMates.map((t) => {
                    return (
                        <div className="flex flex-col items-center justify-center" >
                            <PlayerMugshot
                                url={t.image_url}
                                showPrBackground
                                playerPr={t.power_rank_rating}
                                className="w-20 h-20"
                                key={t.tracking_id}
                            />

                            {player.athstat_firstname && player.athstat_lastname && <SecondaryText className="text-xs text-center truncate" >{t.athstat_lastname}</SecondaryText>}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
