import { twMerge } from "tailwind-merge";
import { IProAthlete } from "../../../types/athletes";
import { getPlayerAggregatedStat } from "../../../types/sports_actions";
import usePlayerStats from "../../player/profile-modal-components/usePlayerStats";
import PlayerCompareSeasonPicker from "./PlayerCompareSeasonPicker";
import PlayerCompareItemHeader from "./PlayerCompareItemHeader";
import { useEffect, useTransition } from "react";
import { useAtom } from "jotai";
import { comparePlayersAtom, comparePlayersStarRatingsAtom, comparePlayersStatsAtom, statCategoriesCollapsedAtom } from "../../../state/comparePlayers.atoms";
import { isStatActionBest, isStarRatingBest, isPowerRatingBest } from "../../../utils/athleteUtils";
import { Crosshair, Shield, Zap, Star } from "lucide-react";

type Props = {
    player: IProAthlete;
};

export default function PlayersCompareItem({ player }: Props) {

    const [comparePlayers] = useAtom(comparePlayersAtom);
    const [comparePlayersStats, setComparePlayersStats] = useAtom(comparePlayersStatsAtom);
    const [comparePlayersStarRatings, setComparePlayerRatings] = useAtom(comparePlayersStarRatingsAtom);
    const [statCategoriesCollapsed, setStatCategoriesCollapsed] = useAtom(statCategoriesCollapsedAtom);

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

            {!isLoading && <div className="flex mt-6 flex-col gap-4" >

                {/* OVERALLS Section */}
                <StatCategory
                    title="OVERALLS"
                    categoryKey="overalls"
                    icon={<Star className="w-4 h-4" />}
                    mainScore={player.power_rank_rating || 0}
                    isCollapsed={statCategoriesCollapsed.overalls}
                    onToggle={() => setStatCategoriesCollapsed(prev => ({ ...prev, overalls: !prev.overalls }))}
                    stats={[
                        {
                            label: "Power Ranking",
                            value: player.power_rank_rating,
                            isGreen: isPowerRatingBest(player, comparePlayers)
                        },
                        {
                            label: "Minutes Played", 
                            value: minutesPlayed,
                            isGreen: isStatActionBest(player, minutesPlayed, "MinutesPlayed", comparePlayersStats)
                        },
                        {
                            label: "Attacking Rating",
                            value: starRatings?.scoring,
                            isGreen: isStarRatingBest(player, starRatings?.scoring, "scoring", comparePlayersStarRatings)
                        },
                        {
                            label: "Scoring Rating",
                            value: starRatings?.scoring,
                            isGreen: isStarRatingBest(player, starRatings?.scoring, "scoring", comparePlayersStarRatings)
                        },
                        {
                            label: "Defensive Rating",
                            value: starRatings?.defence,
                            isGreen: isStarRatingBest(player, starRatings?.defence, "defence", comparePlayersStarRatings)
                        },
                        {
                            label: "Kicking Rating",
                            value: starRatings?.kicking,
                            isGreen: isStarRatingBest(player, starRatings?.kicking, "kicking", comparePlayersStarRatings)
                        }
                    ]}
                />

                {/* ATTACKING Section */}
                <StatCategory
                    title="ATTACKING"
                    categoryKey="attacking"
                    icon={<Zap className="w-4 h-4" />}
                    mainScore={starRatings?.scoring || 0}
                    isMainBest={isStarRatingBest(player, starRatings?.scoring, "scoring", comparePlayersStarRatings)}
                    isCollapsed={statCategoriesCollapsed.attacking}
                    onToggle={() => setStatCategoriesCollapsed(prev => ({ ...prev, attacking: !prev.attacking }))}
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
                    categoryKey="defending"
                    icon={<Shield className="w-4 h-4" />}
                    mainScore={starRatings?.defence || 0}
                    isMainBest={isStarRatingBest(player, starRatings?.defence, "defence", comparePlayersStarRatings)}
                    isCollapsed={statCategoriesCollapsed.defending}
                    onToggle={() => setStatCategoriesCollapsed(prev => ({ ...prev, defending: !prev.defending }))}
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
                    categoryKey="kicking"
                    icon={<Crosshair className="w-4 h-4" />}
                    mainScore={starRatings?.kicking || 0}
                    isMainBest={isStarRatingBest(player, starRatings?.kicking, "kicking", comparePlayersStarRatings)}
                    isCollapsed={statCategoriesCollapsed.kicking}
                    onToggle={() => setStatCategoriesCollapsed(prev => ({ ...prev, kicking: !prev.kicking }))}
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

            {isLoading && <div className="w-full h-screen mt-6 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>}
        </div>
    );
}



type StatCategoryProps = {
    title: string;
    categoryKey: string;
    icon: React.ReactNode;
    mainScore?: number;
    isMainBest?: boolean;
    isCollapsed: boolean;
    onToggle: () => void;
    stats: Array<{
        label: string;
        value?: number;
        isGreen?: boolean;
    }>;
};

function StatCategory({ title, icon, isMainBest, isCollapsed, onToggle, stats }: StatCategoryProps) {
    
    const statsContent = (
        <div className="flex flex-col gap-1 mt-2">
            {stats.map((stat, index) => (
                <StatLabel
                    key={index}
                    label={stat.label}
                    value={stat.value}
                    isGreen={stat.isGreen}
                />
            ))}
        </div>
    );
    
    return (
        <div className="bg-slate-300 border border-slate-100 dark:border-slate-600 dark:bg-slate-800/40 p-1 rounded-md">
            <div 
                onClick={onToggle} 
                className={twMerge(
                    "w-full cursor-pointer px-2 py-2 flex flex-row items-center justify-between rounded-md bg-slate-100 dark:bg-slate-700/60",
                   isMainBest &&  "bg-gradient-to-r from-blue-700 to-blue-600 border border-blue-700 text-white"
                )}
            >
                <div className="flex flex-row items-center gap-1">
                    {icon}
                    <span className="text-xs font-bold text-white uppercase">{title}</span>
                </div>
                
                <div className="flex flex-row items-center gap-2">
                    
                    {!isCollapsed ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </div>
            </div>

            {!isCollapsed && statsContent}
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
            isGreen ? "bg-gradient-to-r from-blue-700 to-blue-600 border border-blue-700 text-white" 
            : "bg-slate-200 dark:bg-slate-700/40 border-slate-100 dark:border-slate-600" 
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
