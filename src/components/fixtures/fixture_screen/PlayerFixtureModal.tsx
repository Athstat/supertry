import { Activity, useCallback, useMemo } from "react"
import { IProAthlete } from "../../../types/athletes"
import { IFixture } from "../../../types/games"
import BottomSheetView from "../../ui/BottomSheetView"
import CircleButton from "../../shared/buttons/BackButton"
import { Binoculars, X } from "lucide-react"
import SmartPlayerMugshot from "../../player/SmartPlayerMugshot"
import MatchPrCard from "../../rankings/MatchPrCard"
import { useAthleteMatchPr } from "../../../hooks/athletes/useAthleteMatchPr"
import SecondaryText from "../../shared/SecondaryText"
import { StatCard } from "../../shared/StatCard"
import { swrFetchKeys } from "../../../utils/swrKeys"
import useSWR from "swr"
import { gamesService } from "../../../services/gamesService"
import { LoadingState } from "../../ui/LoadingState"
import { GameSportAction } from "../../../types/boxScore"
import { getStatUnit, sanitizeStat } from "../../../utils/stringUtils"

type Props = {
    fixture: IFixture,
    player: IProAthlete,
    onClose?: () => void,
    isOpen?: boolean
}

export default function PlayerFixtureModal({ fixture, player, onClose, isOpen }: Props) {

    const { pr, isLoading: loadingPr } = useAthleteMatchPr(player.tracking_id, fixture.game_id);

    const key = swrFetchKeys.getAthleteFixtureSportsActions(fixture.game_id, player.tracking_id)
    const { data, isLoading: loadingSportsActions } = useSWR(key, () => gamesService.getAthleteFixtureSportsActions(fixture.game_id, player.tracking_id));

    const sportActions = useMemo(() => {
        return data ?? [];
    }, [data]);

    const isLoading = loadingPr || loadingSportsActions;

    const hasActions = sportActions.length > 0;

    const handleClose = () => {
        if (onClose) {
            onClose()
        }
    }

    const getAction = useCallback((...actionNames: string[]) => {
        return sportActions.find((s) => {
            return actionNames.includes(s.action);
        })
    }, [sportActions]);

    console.log("Actions ", sportActions);

    if (isLoading) {
        return (
            <BottomSheetView
                className="min-h-[80vh] max-h-[900px] py-2 px-4 flex flex-col items-center justify-center gap-2"
                hideHandle
            >
                <LoadingState />
            </BottomSheetView>
        )
    }

    const minutesPlayed = getAction("minutes_played_total", "MinutesPlayedTotal");
    const pointsScored = getAction("points", "Points");

    return (
        <Activity mode={isOpen ? "visible" : "hidden"} >
            <BottomSheetView
                className="min-h-[80vh] max-h-[900px] py-2 px-4 flex flex-col gap-2"
            >
                <div className="flex flex-row items-center justify-between " >

                    <div className="flex flex-row items-center gap-2" >
                        <Binoculars />
                        <p>Match Performance Overview</p>
                    </div>

                    <div>
                        <CircleButton
                            onClick={handleClose}
                        >
                            <X className="w-4 h-4" />
                        </CircleButton>
                    </div>
                </div>


                <div className="flex mt-2 flex-row items-center justify-between" >

                    <div className="flex flex-row items-center gap-2" >

                        <div>
                            <SmartPlayerMugshot
                                url={player.image_url}
                                teamId={player.team_id}
                                playerImageClassName="w-16 h-16"
                                jerseyClassName="min-w-16 min-h-16"
                                jerseyConClassName="min-w-16 min-h-16"
                            />
                        </div>

                        <div className="flex flex-col gap-0.5" >
                            <p>{player.player_name}</p>
                            <SecondaryText>{player.team?.athstat_name}</SecondaryText>
                        </div>
                    </div>

                    <div className="flex flex-col items-end justify-center gap-2" >

                        {pr && <MatchPrCard
                            pr={pr.updated_power_ranking}
                        />}

                        <SecondaryText className="text-wrap text-center text-xs" >Match Rating</SecondaryText>
                    </div>
                </div>

                <Activity mode={hasActions ? "visible" : "hidden"} >
                    <div className="flex flex-col gap-4 mt-4" >

                        <div className="flex flex-row items-center gap-2" >
                            <StatCard
                                label="Minutes Played"
                                value={sanitizeStat(minutesPlayed?.action_count) + `${getStatUnit("Minutes Played") || ''}`}
                                className="flex-1"
                            />

                            <StatCard
                                label="Total Points"
                                value={pointsScored?.action_count}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <StatsGroup
                        groupTitle="General"
                        sportActions={sportActions}
                        actionNames={[
                            ["minutes_played_total", "MinutesPlayedTotal"],
                            ["minutes_played_first_half", "	MinutesPlayedFirstHalf"],
                            ["minutes_played_second_half", "MinutesPlayedSecondHalf"],
                        ]}
                    />

                    <StatsGroup
                        groupTitle="Attacking"
                        sportActions={sportActions}
                        actionNames={[
                            ["tries", "Tries"],
                            ["points", "Points"],
                            ["passes", "Passes"],
                            ["defenders_beaten", "DefendersBeaten"],
                            ["try_assit", "TryAssit"],
                            ["offload", "Offload"],
                            ["turnovers_conceded", "TurnoversConceded"],
                            ["ruck_arrival_attack", "RuckArrivalAttack"],
                        ]}
                    />

                    <StatsGroup
                        groupTitle="Ball Carrying"
                        sportActions={sportActions}
                        actionNames={[
                            ["carries_metres", "CarriesMetres"],
                            ["post_contact_metres", "PostContactMetres"],
                            ["carry_dominant", "CarryDominant"],
                            ["carries_opp_half", "CarriesOppHalf"],
                            ["carries_own_half", "CarriesOwnHalf"],
                            ["clean_breaks", "CleanBreaks"],
                        ]}
                    />

                    <StatsGroup
                        groupTitle="Defense"
                        sportActions={sportActions}
                        actionNames={[
                            ["tackles", "Tackles"],
                            ["missed_tackles", "MissedTackles"],
                            ["rucks_lost", "RucksLost"],
                            ["collection_loose_ball", "CollectionLooseBall"],
                            ["dominant_tackles", "DominantTackles"],
                            ["turnover_won", "TurnoverWon"],
                            ["tackle_try_saver", "TacklesTrySaver"],
                        ]}
                    />

                    <StatsGroup
                        groupTitle="Kicking"
                        sportActions={sportActions}
                        actionNames={[
                            ["conversion_goals", "ConversionGoals"],
                            ["missed_conversion_goals", "MissedConversionGoals"],
                            ["kick_penalty_good", "KickPenaltyGood"],
                            ["kick_penalty_bad", "KickPenaltyBad"],
                            ["drop_goals_converted", "DropGoalsConverted"],
                            ["try_kicks", "TryKicks"],
                        ]}
                    />

                    <StatsGroup
                        groupTitle="Discipline"
                        sportActions={sportActions}
                        actionNames={[
                            ["red_cards", "RedCards"],
                            ["yellow_cards", "YellowCards"],
                            ["penalties_conceded", "PenaltiesConceded"],
                        ]}
                    />

                </Activity>

                <Activity mode={!hasActions ? "visible" : "hidden"} >
                    <div className="flex flex-col items-center justify-center px-[15%] h-[200px] text-center" >
                        <SecondaryText>Match Statisitics for <strong>{player.player_name}</strong> are not available</SecondaryText>
                    </div>
                </Activity>

            </BottomSheetView>
        </Activity>
    )
}

type StatGroupProps = {
    actionNames: string[][],
    sportActions: GameSportAction[],
    groupTitle?: string,
}

function StatsGroup({ actionNames, sportActions, groupTitle }: StatGroupProps) {

    const sanitizeStat = (actionCount?: number) => {
        if (!actionCount || actionCount === undefined || actionCount === null) {
            return '-';
        }


        const [, decimal] = actionCount.toString().split(".");

        if (Number(decimal) > 0) {
            return Number(actionCount.toString()).toFixed(1);
        }

        return Math.floor(actionCount);
    }

    const getStatUnit = (actionDisplayName?: string) => {
        if (!actionDisplayName) {
            return undefined;
        }

        if (actionDisplayName.includes("Minute")) {
            return "'"
        }

        if (actionDisplayName.includes("Metres")) {
            return "m"
        }
        return undefined;
    }

    return (
        <div className="border-t dark:border-slate-700 p-2 flex flex-col gap-2" >
            <div>
                <SecondaryText className="text-sm font-semibold" >{groupTitle}</SecondaryText>
            </div>

            <div className="flex flex-col gap-2" >
                {actionNames.map((a) => {

                    const sportAction = sportActions.find((s) => {
                        return a.includes(s.action);
                    });


                    if (!sportAction) {
                        return null;
                    }

                    return (
                        <div className="flex flex-row items-center gap-2 justify-between" >
                            <div>
                                <p className="text-sm" >{sportAction.definition?.display_name}</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold" >{sanitizeStat(sportAction.action_count)}{getStatUnit(sportAction.definition?.display_name)}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}