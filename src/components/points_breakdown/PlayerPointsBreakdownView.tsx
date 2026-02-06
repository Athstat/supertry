import { IProAthlete } from "../../types/athletes"
import { FantasyLeagueTeamWithAthletes, IFantasyLeagueTeam } from "../../types/fantasyLeague"
import { formatPosition } from "../../utils/athletes/athleteUtils"
import PlayerMugshot from "../player/PlayerMugshot"
import SecondaryText from "../ui/typography/SecondaryText"
import { useAthletePointsBreakdown } from "../../hooks/fantasy/useAthletePointsBreakdown"
import { FantasyAthletePointsBreakdownItem, IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete"
import { twMerge } from "tailwind-merge"
import { ReactNode } from "react"
import NoContentCard from "../ui/typography/NoContentMessage"
import { AvailabilityText } from "../players/availability/AvailabilityIcon"
import { IFixture } from "../../types/games"
import RoundedCard from "../ui/cards/RoundedCard"
import { useSportActions } from "../../hooks/useSportActions"
import { ISeasonRound } from "../../types/fantasy/fantasySeason"

type Props = {
    athlete: IProAthlete,
    team?: IFantasyLeagueTeam | FantasyLeagueTeamWithAthletes,
    round?: ISeasonRound,
    game?: IFixture
    onClose?: () => void,

    /** React Node to render on the header title area */
    headerTitle?: ReactNode,
    hideSubtitle?: boolean,
    multiplier?: number,
    multiplierDesc?: string
}

export default function PlayerPointsBreakdownView({ athlete, round: leagueRound, game, headerTitle, hideSubtitle, team, multiplier, multiplierDesc }: Props) {

    const roundNumber = leagueRound?.round_number || game?.round || 0;
    const seasonId = leagueRound?.season || game?.league_id || ''

    const { pointItems, totalPoints: rawPoints, isLoading: loadingPointsBreakdown } = useAthletePointsBreakdown(
        athlete, roundNumber, seasonId
    );

    const finalScore = team?.athletes.find((a) => {
        return a.athlete?.tracking_id === athlete.tracking_id
    })?.score ?? rawPoints;

    const multiplierScore = finalScore - rawPoints;

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

                    {!isLoading && rawPoints && (
                        <div className="flex flex-col items-end justify-end" >
                            <p className="text-lg" >{finalScore?.toFixed(1)}</p>
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
                <p className="font-semibold text-base lg:text-lg dark:text-white" >Fantasy Points Breakdown</p>
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

                    {<MultiplierCard
                        multipliyer={multiplier}
                        description={multiplierDesc}
                        bonus={multiplierScore}
                    />}

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
                            {finalScore?.toFixed(1)}
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
                teamId={athlete.team_id}
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

type MultiplyerCardProps = {
    multipliyer?: number,
    description?: string,
    bonus?: number
}

function MultiplierCard({ multipliyer, description, bonus }: MultiplyerCardProps) {

    if (!bonus || !multipliyer || !description) {
        return null;
    }

    const isLoss = bonus < 0;

    return (
        <div className={twMerge(
            "flex flex-row rounded-2xl px-3 items-center justify-between p-2 bg-blue-500 text-white dark:text-white",
            isLoss && "bg-red-500 dark:bg-red-600"
        )} >
            <div className="flex flex-row gap-2" >
                
                <SecondaryText className="dark:text-white font-medium" >{description} (x{multipliyer})</SecondaryText>
            </div>

            <div className={twMerge(
                "font-bold text-white",
                (bonus ?? 0) < 0 && 'text-white'
            )} >
                {bonus?.toFixed(1)}
            </div>
        </div>
    )
}