import { useCallback } from "react";
import { GameSportAction } from "../../../types/boxScore";
import { sanitizeStat, getStatUnit } from "../../../utils/stringUtils";
import { StatCard } from "../../ui/cards/StatCard";
import SecondaryText from "../../ui/typography/SecondaryText";

type Props = {
    sportActions: GameSportAction[]
}

/** Renders a players stats for a specific fixture */
export default function PlayerFixtureStatsView({ sportActions }: Props) {

    const getAction = useCallback((...actionNames: string[]) => {
        return sportActions.find((s) => {
            return actionNames.includes(s.action);
        })
    }, [sportActions]);

    const minutesPlayed = getAction("minutes_played_total", "MinutesPlayedTotal");
    const pointsScored = getAction("points", "Points");


    return (
        <div className="flex flex-col gap-2" >
            <div className="flex flex-col gap-4 mt-4" >

                <div className="flex flex-row items-center gap-2" >
                    <StatCard
                        label="Minutes Played"
                        value={sanitizeStat(minutesPlayed?.action_count) + `${getStatUnit("Minutes Played") || ''}`}
                        className="flex-1"
                    />

                    <StatCard
                        label="Game Points"
                        value={sanitizeStat(pointsScored?.action_count)}
                        className="flex-1"
                    />
                </div>
            </div>

            <StatsGroup
                groupTitle="General"
                sportActions={sportActions}
                actionNames={[
                    ["minutes_played_total", "MinutesPlayedTotal"],
                    ["minutes_played_first_half", "MinutesPlayedFirstHalf"],
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

        </div>
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