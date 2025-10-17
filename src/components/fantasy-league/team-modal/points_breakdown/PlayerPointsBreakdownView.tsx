import { IProAthlete } from "../../../../types/athletes"
import { FantasyLeagueTeamWithAthletes, IFantasyLeagueRound, IFantasyLeagueTeam } from "../../../../types/fantasyLeague"
import { formatPosition } from "../../../../utils/athleteUtils"
import PlayerMugshot from "../../../shared/PlayerMugshot"
import SecondaryText from "../../../shared/SecondaryText"
import { useAthletePointsBreakdown } from "../../../../hooks/fantasy/useAthletePointsBreakdown"
import RoundedCard from "../../../shared/RoundedCard"
import { FantasyAthletePointsBreakdownItem, IFantasyTeamAthlete } from "../../../../types/fantasyTeamAthlete"
import { useSportActions } from "../../../stats/SportActionsDefinitionsProvider"
import { twMerge } from "tailwind-merge"
import { ChevronLeft } from "lucide-react"
import { useEffect, useRef } from "react"
import NoContentCard from "../../../shared/NoContentMessage"
import { athleteAnalytics } from "../../../../services/analytics/athleteAnalytics"
import { AvailabilityText } from "../../../players/availability/AvailabilityIcon"

type Props = {
    athlete: IProAthlete | IFantasyTeamAthlete,
    team: IFantasyLeagueTeam | FantasyLeagueTeamWithAthletes,
    round: IFantasyLeagueRound,
    onClose?: () => void
}

export default function PlayerPointsBreakdownView({ athlete, round, onClose }: Props) {

    const { pointItems, totalPoints, isLoading: loadingPointsBreakdown } = useAthletePointsBreakdown(
        athlete,
        round.start_round ?? 0,
        round.season_id
    );

    const isLoading = loadingPointsBreakdown;

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {

        athleteAnalytics.trackPointsBreakdownViewed(
            athlete.tracking_id,
            round.official_league_id,
            round.start_round ?? 0
        );

    }, [athlete, round]);

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({
                behavior: 'instant'
            });
        }
    }, [athlete]);

    return (
        <div className="flex flex-col gap-4" ref={ref} >
            <div className="flex flex-row truncate items-center gap-2" >

                {onClose && <div>
                    <button onClick={onClose} className="w-8 h-8 flex flex-col rounded-full items-center justify-center hover:bg-slate-200 hover:dark:bg-slate-700/60" >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                </div>}

                <PlayerMugshot
                    playerPr={athlete.power_rank_rating}
                    url={athlete.image_url}
                    showPrBackground
                    className="w-14 h-14"
                />

                <div>
                    <p className="font-semibold" >{athlete.player_name}</p>
                    {athlete.position && athlete.position_class && (
                        <SecondaryText className="" >{formatPosition(athlete.position_class)} | {formatPosition(athlete.position)}</SecondaryText>
                    )}
                </div>

                <div className="flex flex-row font-bold flex-1 items-center justify-end" >
                    {!isLoading && totalPoints && <p className="text-lg" >{totalPoints?.toFixed(1)}</p>}
                    {isLoading && (
                        <RoundedCard
                            className="h-[20px] w-[80px] animate-pulse border-none rounded-xl"
                        />
                    )}
                </div>

            </div>

            <AvailabilityText
                athlete={athlete}
            />

            <div>
                <p className="font-semibold text-lg" >Points Breakdown</p>
            </div>

            {isLoading && (
                <div className="flex flex-col gap-2" >

                    <RoundedCard
                        className="h-[30px] animate-pulse border-none rounded-xl w-full"
                    />

                    <RoundedCard
                        className="h-[30px] animate-pulse border-none rounded-xl w-full"
                    />

                    <RoundedCard
                        className="h-[30px] animate-pulse border-none rounded-xl w-full"
                    />

                    <RoundedCard
                        className="h-[30px] animate-pulse border-none rounded-xl w-full"
                    />

                    <RoundedCard
                        className="h-[30px] animate-pulse border-none rounded-xl w-full"
                    />

                    <RoundedCard
                        className="h-[30px] animate-pulse border-none rounded-xl w-full"
                    />

                </div>
            )}


            {!isLoading && pointItems !== undefined && (
                <div className="flex flex-col gap-2" >
                    {pointItems.map((p, index) => {
                        return (
                            <PlayerPointBreakdownItem
                                pointItem={p}
                                key={index}
                            />
                        )
                    })}

                    {pointItems.length === 0 && (
                        <NoContentCard
                            message={`${athlete.player_name} has not scored points in ${round.title} yet`}
                        />
                    )}

                    <RoundedCard className="border-none shadow-none bg-transparent dark:bg-transparent hover:bg-transparent hover:dark:bg-transparent flex py-2 px-4 flex-row items-center justify-between" >
                        <div>
                            <p className="font-bold" >
                                Total
                            </p>
                        </div>

                        <div className="font-bold " >
                            {totalPoints.toFixed(1)}
                        </div>
                    </RoundedCard>
                </div>
            )}
        </div>
    )
}

type BreakdownItemProps = {
    pointItem: FantasyAthletePointsBreakdownItem
}

function PlayerPointBreakdownItem({ pointItem }: BreakdownItemProps) {

    const { defintions } = useSportActions();
    const deff = defintions.find((d) => {
        return d.action_name === pointItem.action;
    })

    if (pointItem.action_count === 0) return;



    const score = pointItem.score ?? 0;
    const displayName = deff ? deff.display_name : formatPosition(pointItem.action);

    return (
        <RoundedCard className="border-none hover:shadow-none bg-slate-100 shadow-none flex py-2 px-4 flex-row items-center justify-between" >
            <div>
                <SecondaryText>
                    {displayName} ({pointItem.action_count})
                </SecondaryText>
            </div>

            <div className={twMerge(
                "font-bold text-green-500",
                (score ?? 0) < 0 && 'text-red-500'
            )} >
                {score.toFixed(1)}
            </div>
        </RoundedCard>
    )
}