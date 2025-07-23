import { twMerge } from "tailwind-merge";
import { IProAthlete } from "../../../types/athletes";
import { getPlayerAggregatedStat } from "../../../types/sports_actions";
import usePlayerStats from "../../player/profile-modal-components/usePlayerStats";
import PlayerCompareSeasonPicker from "./PlayerCompareSeasonPicker";
import PlayerCompareItemHeader from "./PlayerCompareItemHeader";
import { useEffect, useTransition } from "react";
import { useAtom } from "jotai";
import { comparePlayersStarRatingsAtom, comparePlayersStatsAtom } from "../../../state/comparePlayers.atoms";
import { isStatActionBest, isStarRatingBest } from "../../../utils/athleteUtils";
import {FaStar} from "react-icons/fa6";

type Props = {
    player: IProAthlete;
};

export default function PlayersCompareItem({ player }: Props) {

    const [comparePlayersStats, setComparePlayersStats] = useAtom(comparePlayersStatsAtom);
    const [comparePlayersStarRatings, setComparePlayerRatings] = useAtom(comparePlayersStarRatingsAtom);

    const [_, startTransition] = useTransition();

    const {
        seasonPlayerStats: actions,
        loadingPlayerStats: loadingActions,
        seasons,
        currSeason,
        setCurrSeason,
        starRatings,
        loadingStarRatings
    } = usePlayerStats(player);

    useEffect(() => {

        if (loadingActions || loadingStarRatings) return;

        startTransition(() => {
            const newStats = comparePlayersStats.filter((f) => {
                return !(f.athlete.tracking_id === player.tracking_id);
            });

            newStats.push({
                athlete: player,
                stats: actions
            });

            setComparePlayersStats(newStats);

            const newStarRatings = comparePlayersStarRatings.filter((s) => {
                return !(s.athlete.tracking_id === player.tracking_id);
            });

            if (starRatings) {
                newStarRatings.push({
                    athlete: player,
                    stats: starRatings
                });
            }

            setComparePlayerRatings(newStarRatings)
        })

        return () => { };

    }, [actions, starRatings]);

    const isLoading = loadingActions || loadingStarRatings;

    const tries = getPlayerAggregatedStat("Tries", actions)?.action_count;

    const assits = getPlayerAggregatedStat("Assists", actions)?.action_count;

    const passes = getPlayerAggregatedStat("Passes", actions)?.action_count;

    const tacklesMade = getPlayerAggregatedStat("TacklesMade", actions)?.action_count;

    const tackleSuccess = getPlayerAggregatedStat("TackleSuccess", actions)?.action_count;

    const turnoversWon = getPlayerAggregatedStat("TurnoversWon", actions)?.action_count;

    const turnovers = getPlayerAggregatedStat("TurnoversConceded", actions)?.action_count;

    const kicksFromHand = getPlayerAggregatedStat("KicksFromHand", actions)?.action_count;

    const kicksFromHandMetres = getPlayerAggregatedStat("KicksFromHandMetres", actions)?.action_count;

    const minutesPlayed = getPlayerAggregatedStat('MinutesPlayed', actions)?.action_count;

    return (
        <div className="flex flex-col gap-2 w-[calc(50%-0.25rem)] md:flex-1 md:min-w-[200px] md:max-w-[300px] flex-shrink-0">

            <PlayerCompareItemHeader
                player={player}
            />

            {seasons && <PlayerCompareSeasonPicker
                seasons={seasons}
                setCurrSeason={setCurrSeason}
                currSeason={currSeason}
            />}

            {!isLoading && <div className="flex flex-col gap-3" >

                {/* General Stats */}
                <div className="flex flex-row items-center justify-between py-2 px-3 bg-slate-700 dark:bg-slate-800 rounded">
                    <span className="text-xs font-medium text-slate-300">IGS</span>
                    <span className="text-sm font-bold text-white">{player.power_rank_rating || 0}</span>
                </div>
                
                <div className="flex flex-row items-center justify-between py-2 px-3 bg-slate-700 dark:bg-slate-800 rounded">
                    <span className="text-xs font-medium text-slate-300">Face Stats</span>
                    <span className="text-sm font-bold text-white">{minutesPlayed || 0}</span>
                </div>

                {/* ATTACKING Section */}
                <StatCategory
                    title="ATTACKING"
                    mainScore={starRatings?.attacking || 0}
                    isMainBest={isStarRatingBest(player, starRatings?.attacking, "attacking", comparePlayersStarRatings)}
                    stats={[
                        {
                            label: "Tries",
                            value: tries,
                            isGreen: isStatActionBest(player, tries, "Tries", comparePlayersStats)
                        },
                        {
                            label: "Assists", 
                            value: assits,
                            isGreen: isStatActionBest(player, assits, "Assists", comparePlayersStats)
                        },
                        {
                            label: "Passes",
                            value: passes,
                            isGreen: isStatActionBest(player, passes, "Passes", comparePlayersStats)
                        },
                        {
                            label: "Turnovers",
                            value: turnovers,
                            isGreen: isStatActionBest(player, turnovers, "TurnoversConceded", comparePlayersStats)
                        }
                    ]}
                />

                {/* DEFENDING Section */}
                <StatCategory
                    title="DEFENDING"
                    mainScore={starRatings?.defence || 0}
                    isMainBest={isStarRatingBest(player, starRatings?.defence, "defence", comparePlayersStarRatings)}
                    stats={[
                        {
                            label: "Strength",
                            value: starRatings?.strength,
                            isGreen: isStarRatingBest(player, starRatings?.strength, "strength", comparePlayersStarRatings)
                        },
                        {
                            label: "Tackles Made",
                            value: tacklesMade,
                            isGreen: isStatActionBest(player, tacklesMade, "TacklesMade", comparePlayersStats)
                        },
                        {
                            label: "Tackle Success",
                            value: tackleSuccess ? (tackleSuccess * 100) : undefined,
                            isGreen: isStatActionBest(player, tackleSuccess ? (tackleSuccess * 100) : undefined, "TackleSuccess", comparePlayersStats)
                        },
                        {
                            label: "Turnovers Won",
                            value: turnoversWon,
                            isGreen: isStatActionBest(player, turnoversWon, "TurnoversWon", comparePlayersStats)
                        }
                    ]}
                />

                {/* KICKING Section */}
                <StatCategory
                    title="KICKING"
                    mainScore={starRatings?.kicking || 0}
                    isMainBest={isStarRatingBest(player, starRatings?.kicking, "kicking", comparePlayersStarRatings)}
                    stats={[
                        {
                            label: "Kicks From Hand",
                            value: kicksFromHand,
                            isGreen: isStatActionBest(player, kicksFromHand, "KicksFromHand", comparePlayersStats)
                        },
                        {
                            label: "Metres",
                            value: kicksFromHandMetres,
                            isGreen: isStatActionBest(player, kicksFromHandMetres, "KicksFromHandMetres", comparePlayersStats)
                        },
                        {
                            label: "Points Kicking",
                            value: starRatings?.points_kicking,
                            isGreen: isStarRatingBest(player, starRatings?.points_kicking, "points_kicking", comparePlayersStarRatings)
                        },
                        {
                            label: "Infield Kicking",
                            value: starRatings?.infield_kicking,
                            isGreen: isStarRatingBest(player, starRatings?.infield_kicking, "infield_kicking", comparePlayersStarRatings)
                        }
                    ]}
                />

            </div>}

            {isLoading && <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 animate-pulse"></div>}
        </div>
    );
}



type StatCategoryProps = {
    title: string;
    mainScore: number;
    isMainBest?: boolean;
    stats: Array<{
        label: string;
        value?: number;
        isGreen?: boolean;
    }>;
};

function StatCategory({ title, mainScore, isMainBest, stats }: StatCategoryProps) {
    
    return (
        <div className="flex flex-col gap-2">

            <div className="flex flex-row items-center justify-between">
                <span className="text-xs font-bold text-white uppercase">{title}</span>
                
                <div className={twMerge(
                    "flex flex-row items-center gap-1 text-slate-700 dark:text-slate-300",
                    isMainBest && "text-yellow-500 dark:text-yellow-500"
                )} >
                    <FaStar className="w-4 h-4" />
                    <p className="font-bold text-sm" >{mainScore}</p>
                </div>
            </div>

            {/* Individual Stats */}
            <div className="flex flex-col gap-1">
                {stats.map((stat, index) => (
                    <StatLabel
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        isGreen={stat.isGreen}
                    />
                ))}
            </div>
        </div>
    );
}

type StatLabelProp = {
    label?: string;
    value?: number;
    isGreen?: boolean;
};

function StatLabel({ label, value, isGreen }: StatLabelProp) {
    const hasVal = value !== undefined;
    const valueFixed = value?.toFixed(1);

    return (
        <div className={twMerge(
            "flex flex-row items-center justify-between py-2 px-3 rounded",
            isGreen ? "bg-gradient-to-r from-blue-700 to-blue-600 border border-blue-700 text-white" : "bg-slate-700 dark:bg-slate-800"
        )}>
            <span className={twMerge(
                "text-xs font-medium",
                isGreen ? "text-white dark:text-white" : "text-slate-300"
            )}>
                {label}
            </span>
            <span className={twMerge(
                "text-sm font-bold",
                isGreen ? "text-white" : "text-white"
            )}>
                {hasVal ? valueFixed?.endsWith(".0") ? value : valueFixed : "-"}
            </span>
        </div>
    )
}
