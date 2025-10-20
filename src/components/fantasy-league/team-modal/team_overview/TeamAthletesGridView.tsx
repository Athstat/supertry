import { useMemo } from "react"
import { useLeagueRoundStandingsFilter } from "../../../../hooks/fantasy/useLeagueRoundStandingsFilter"
import { useFantasyLeagueGroup } from "../../../../hooks/leagues/useFantasyLeagueGroup"
import { useAthleteRoundScore } from "../../../../hooks/useAthletePointsBreakdown"
import { IProAthlete } from "../../../../types/athletes"
import { FantasyLeagueTeamWithAthletes, IDetailedFantasyAthlete } from "../../../../types/fantasyLeague"
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
                    return (
                        <GridItem
                            a={a}
                            onClickPlayer={onClickPlayer}
                        />
                    )
                })}
            </div>
        </div>
    )
}

type GridItemProps = {
    onClickPlayer?: (p: IProAthlete) => void,
    a: IDetailedFantasyAthlete
}

function GridItem({ onClickPlayer, a }: GridItemProps) {

    const { currentRound, rounds } = useFantasyLeagueGroup();
    const { roundFilterId } = useLeagueRoundStandingsFilter();

    const filteredRound = useMemo(() => {
        if (roundFilterId === "overall" || roundFilterId === undefined) {
            return currentRound;
        }

        const fRound = rounds.find((r) => {
            return r.id.toString() === roundFilterId;
        });

        return fRound || currentRound;
    }, [roundFilterId, currentRound, rounds]);

    const { score, isLoading } = useAthleteRoundScore(a.athlete.tracking_id ?? "", filteredRound?.season_id ?? "", filteredRound?.start_round ?? "");

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

            {!isLoading && <p className="font-bold text-white" >{Math.floor(score ?? 0)}</p>}
            {isLoading && (
                <div className="font-bold text-white w-4 h-4 rounded-full bg-white/50 animate-pulse " >
                </div>
            )}
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