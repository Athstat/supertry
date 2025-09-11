import { IProAthlete } from "../../../../types/athletes"
import { FantasyLeagueTeamWithAthletes } from "../../../../types/fantasyLeague"
import { formatPosition } from "../../../../utils/athleteUtils"
import { PlayerGameCard } from "../../../player/PlayerGameCard"
import PlayerMugshot from "../../../shared/PlayerMugshot"
import RugbyPitch from "../../../shared/RugbyPitch"
import SecondaryText from "../../../shared/SecondaryText"

type TeamAthletesViewProps = {
    roundTeam: FantasyLeagueTeamWithAthletes,
    onClickPlayer?: (player: IProAthlete) => void
}

export function TeamAthletesGridView({ roundTeam, onClickPlayer }: TeamAthletesViewProps) {
    return (
        <div className="bg-green-600 overflow-clip min-h-[920px] max-h-[920px] relative rounded-xl" >
            <RugbyPitch count={6} />

            <div className="flex flex-row  min-h-[920px] max-h-[920px] items-center justify-center flex-wrap absolute top-0 left-0" >

                {roundTeam?.athletes?.map((a) => {

                    const handleClick = () => {
                        if (onClickPlayer) {
                            onClickPlayer(a.athlete);
                        }
                    }

                    return (
                        <div className="flex flex-col gap-2 items-center justify-center" >
                            <PlayerGameCard
                                player={a.athlete}
                                onClick={handleClick}
                                key={a.athlete.tracking_id}
                            />

                            <p className="font-bold text-white" >{Math.floor(a.score ?? 0)}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


export function TeamAthletesListView({ roundTeam }: TeamAthletesViewProps) {
    return (
        <div className="overflow-clip relative rounded-xl gap-2" >

            <div className="flex flex-col gap-2" >

                {roundTeam?.athletes.map((a) => {
                    return (
                        <div className="flex flex-row gap-2 items-center justify-between" >
                            <div className="flex flex-row items-center gap-2" >
                                <PlayerMugshot
                                    url={a.athlete.image_url}
                                />

                                <div>
                                    <p className="font-bold truncate text-xs" >{a.athlete.player_name}</p>
                                    <SecondaryText className="text-xs" >{a.athlete.position_class ? formatPosition(a.athlete.position_class) : '-'}</SecondaryText>
                                </div>
                            </div>

                            <p className="font-bold" >{Math.floor(a.score ?? 0)}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}