import { twMerge } from "tailwind-merge";
import { IProAthlete } from "../../../types/athletes";
import { SportAction, SportActionDefinition } from "../../../types/sports_actions";
import usePlayerStats from "../../player/profile-modal-components/usePlayerStats";
import PlayerCompareSeasonPicker from "./PlayerCompareSeasonPicker";
import PlayerCompareItemHeader from "./PlayerCompareItemHeader";
import { useEffect, useMemo, useTransition } from "react";
import { useAtom } from "jotai";
import { comparePlayersAtom, comparePlayersStarRatingsAtom, comparePlayersStatsAtom, statCategoriesCollapsedAtom } from "../../../state/comparePlayers.atoms";
import PlayerIconsRow from "./PlayerIconsRow";
import useSWR from "swr";
import { swrFetchKeys } from "../../../utils/swrKeys";
import { sportActionsService } from "../../../services/sportActionsService";

type Props = {
    player: IProAthlete;
};

export default function PlayersCompareItem({ player }: Props) {

    const [comparePlayers] = useAtom(comparePlayersAtom);
    const [comparePlayersStats, setComparePlayersStats] = useAtom(comparePlayersStatsAtom);
    const [comparePlayersStarRatings, setComparePlayerRatings] = useAtom(comparePlayersStarRatingsAtom);
    const [statCategoriesCollapsed, setStatCategoriesCollapsed] = useAtom(statCategoriesCollapsedAtom);

    const [_, startTransition] = useTransition();

    const defintionFetchKey = swrFetchKeys.getSportActionsDefinitions()
    const { data: fetchedDefintions, isLoading: loadingDeffs } = useSWR(defintionFetchKey, () => sportActionsService.getDefinitionList());

    const sportActions = fetchedDefintions ?? [];

    const categories: string[] = useMemo(() => {
        const seen: Set<string> = new Set();
        sportActions.forEach((sa) => {
            if (sa.category && !seen.has(sa.category)) {
                seen.add(sa.category);
            }
        })

        return [...seen].sort((a, b) => a.localeCompare(b))
    }, [sportActions]);

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

    const isLoading = loadingActions || loadingDeffs;

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

            {/* Player Icons Row */}
            {!isLoading && starRatings && actions && currSeason && (
                <PlayerIconsRow
                    player={player}
                    season={currSeason}
                    size="sm"
                />
            )}

            {!isLoading && <div className="flex flex-col gap-4" >

                {categories.map((c, index) => {
                    return (
                        <StatCategory
                            title={c}
                            onToggle={() => { }}
                            categoryKey={c}
                            stats={actions}
                            key={index}
                            statDefinitions={sportActions}
                        />
                    )
                })}

            </div>}

            {isLoading && <div className="w-full h-screen rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>}
        </div>
    );
}



type StatCategoryProps = {
    title: string;
    categoryKey?: string;
    icon?: React.ReactNode;
    mainScore?: number;
    isMainBest?: boolean;
    isCollapsed?: boolean;
    onToggle: () => void;
    stats: SportAction[];
    statDefinitions: SportActionDefinition[]
};

function StatCategory({ title, icon, isMainBest, isCollapsed, onToggle, stats, categoryKey, statDefinitions }: StatCategoryProps) {

    const categoryStatDefinitions = statDefinitions.filter((s) => {
        return s.category === categoryKey
    });

    const getActionCount = (action_name: string) => {
        return stats.find((s) => {
            return s.definition?.action_name === action_name
        })?.action_count
    }

    const statsContent = (
        <div className="flex flex-col gap-1 mt-2">
            {categoryStatDefinitions.map((stat, index) => {

                if (!stat.show_on_ui || !stat.display_name) return;

                return (
                    <StatLabel
                        key={index}
                        label={stat?.display_name}
                        value={getActionCount(stat.action_name)}
                        isGreen={false}
                    />
                )
            })}
        </div>
    );

    return (
        <div className="bg-slate-300 border border-slate-300 dark:border-slate-600 dark:bg-slate-800/40 p-1 rounded-md">
            <div
                onClick={onToggle}
                className={twMerge(
                    "w-full cursor-pointer px-2 py-2 flex flex-row items-center justify-between rounded-md bg-slate-100 dark:bg-slate-700/60",
                    isMainBest && "bg-gradient-to-r from-blue-700 to-blue-600 border border-blue-700 text-white"
                )}
            >
                <div className="flex flex-row items-center gap-1">
                    {icon}
                    <span className="text-xs font-bold dark:text-white uppercase">{title}</span>
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
                : "bg-slate-100 dark:bg-slate-700/40 border-slate-100 dark:border-slate-600"
        )}>
            <span className={twMerge(
                "text-xs font-medium text-slate-600 dark:text-slate-300",
                isGreen && " text-white dark:text-white"
            )}>
                {label}
            </span>
            <span className={twMerge(
                "text-sm font-bold text-slate-600 dark:text-white",
                isGreen && "text-white"
            )}>
                {hasVal ? valueFixed?.endsWith(".0") ? value : valueFixed : "-"}
            </span>
        </div>
    )
}
