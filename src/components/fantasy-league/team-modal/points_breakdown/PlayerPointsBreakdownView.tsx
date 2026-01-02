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
import { ReactNode } from "react"
import NoContentCard from "../../../shared/NoContentMessage"
import { AvailabilityText } from "../../../players/availability/AvailabilityIcon"
import { IFixture } from "../../../../types/games"

type Props = {
    athlete: IProAthlete | IFantasyTeamAthlete,
    team?: IFantasyLeagueTeam | FantasyLeagueTeamWithAthletes,
    round?: IFantasyLeagueRound,
    game?: IFixture
    onClose?: () => void,

    /** React Node to render on the header title area */
    headerTitle?: ReactNode,
    hideSubtitle?: boolean
}

export default function PlayerPointsBreakdownView({ athlete, round: leagueRound, game, headerTitle, hideSubtitle }: Props) {

    const roundNumber = leagueRound?.start_round || game?.round || 0;
    const seasonId = leagueRound?.season_id || leagueRound?.official_league_id || game?.league_id || ''
    
    const { pointItems, totalPoints, isLoading: loadingPointsBreakdown } = useAthletePointsBreakdown(
        athlete, roundNumber, seasonId
    );

    const isLoading = loadingPointsBreakdown;

    return (
        <div className="flex flex-col gap-4 dark:text-white" >
            <div className="flex flex-row truncate items-center gap-2" >


                {headerTitle ? (
                    <>{headerTitle}</>
                ) : (
                    <DefaultHeaderTitle
                        athlete={athlete}
                    />
                )}

                <div className="flex flex-row  font-bold flex-1 items-center justify-end" >
                    {!isLoading && totalPoints && (
                        <div className="flex flex-col items-end justify-end" >
                            <p className="text-lg" >{totalPoints?.toFixed(1)}</p>
                            <SecondaryText className="text-xs font-semibold" >Total Points</SecondaryText>
                        </div>
                    )}
                    {isLoading && (
                        <RoundedCard
                            className="h-[30px] w-[60px] animate-pulse border-none rounded-xl"
                        />
                    )}
                </div>

            </div>

            <AvailabilityText
                athlete={athlete}
            />

            {!hideSubtitle && <div>
                <p className="font-semibold text-lg dark:text-white" >Points Breakdown</p>
            </div>}

            {isLoading && (
                <div className="flex flex-col gap-2" >

                    <RoundedCard
                        className="h-[45px] animate-pulse border-none rounded-xl w-full"
                    />

                    <RoundedCard
                        className="h-[45px] animate-pulse border-none rounded-xl w-full"
                    />

                    <RoundedCard
                        className="h-[45px] animate-pulse border-none rounded-xl w-full"
                    />

                    <RoundedCard
                        className="h-[45px] animate-pulse border-none rounded-xl w-full"
                    />

                    <RoundedCard
                        className="h-[45px] animate-pulse border-none rounded-xl w-full"
                    />

                    <RoundedCard
                        className="h-[45px] animate-pulse border-none rounded-xl w-full"
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
                            message={`${athlete.player_name} has not scored points in ${roundNumber ? `Week ${roundNumber}` : "this round"} yet`}
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

type HeaderProps = {
    athlete: IProAthlete | IFantasyTeamAthlete
}

function DefaultHeaderTitle({ athlete }: HeaderProps) {
    return (
        <div className="flex flex-row items-center gap-2" >
            {<PlayerMugshot
                playerPr={athlete.power_rank_rating}
                url={athlete.image_url}
                showPrBackground
                className="w-14 h-14"
            />}

            <div>
                <p className="font-semibold dark:text-white" >{athlete.player_name}</p>
                {athlete.position && athlete.position_class && (
                    <SecondaryText className="" >{formatPosition(athlete.position_class)} | {formatPosition(athlete.position)}</SecondaryText>
                )}
            </div>
        </div>
    )
}