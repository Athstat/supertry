import { twMerge } from "tailwind-merge";
import { IProAthlete } from "../../../types/athletes";
import { getPlayerAggregatedStat } from "../../../types/sports_actions";
import usePlayerStats from "../../player/profile-modal-components/usePlayerStats";
import SecondaryText from "../../shared/SecondaryText";
import PlayerCompareSeasonPicker from "./PlayerCompareSeasonPicker";
import PlayerCompareItemHeader from "./PlayerCompareItemHeader";
import { useEffect, useTransition } from "react";
import { useAtom, useAtomValue } from "jotai";
import { comparePlayersAtom, comparePlayersStarRatingsAtom, comparePlayersStatsAtom } from "../../../state/comparePlayers.atoms";
import { isStatActionBest, isStarRatingBest, isPowerRatingBest } from "../../../utils/athleteUtils";

type Props = {
    player: IProAthlete;
    onRemove?: (player: IProAthlete) => void;
};

export default function PlayersCompareItem({ player, onRemove }: Props) {

    const comparePlayers = useAtomValue(comparePlayersAtom);
    const [comparePlayersStats, setComparePlayersStats] = useAtom(comparePlayersStatsAtom);
    const [comparePlayersStarRatings, setComparePlayerRatings] = useAtom(comparePlayersStarRatingsAtom);

    const [_, startTransition] = useTransition();

    const handleRemove = () => {
        if (onRemove) {
            onRemove(player);
        }
    };

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
        <div className="flex flex-col gap-2">

            <PlayerCompareItemHeader
                player={player}
                onRemove={handleRemove}
            />

            {seasons && <PlayerCompareSeasonPicker
                seasons={seasons}
                setCurrSeason={setCurrSeason}
                currSeason={currSeason}
            />}

            {!isLoading && <div className="flex flex-col gap-1" >

                <SecondaryText className="mt-2" >General</SecondaryText>

                <StatLabel
                    label="Power Rating"
                    value={player.power_rank_rating}
                    isGreen={isPowerRatingBest(player, comparePlayers)}
                />

                <StatLabel
                    label="Minutes Played"
                    value={minutesPlayed}
                    isGreen={isStatActionBest(player, minutesPlayed, "MinutesPlayed", comparePlayersStats)}
                />

                <SecondaryText className="mt-2" >Attacking</SecondaryText>

                <StatLabel
                    label="Attacking Rating"
                    value={starRatings?.attacking}
                    isGreen={isStarRatingBest(player, starRatings?.attacking, "attacking", comparePlayersStarRatings)}
                />

                <StatLabel
                    label="Scoring"
                    value={starRatings?.scoring}
                    isGreen={isStarRatingBest(player, starRatings?.scoring, "scoring", comparePlayersStarRatings)}
                />

                <StatLabel
                    label="Tries"
                    value={tries}
                    isGreen={isStatActionBest(player, tries, "Tries", comparePlayersStats)}
                />

                <StatLabel
                    label="Assists"
                    value={assits}
                    isGreen={isStatActionBest(player, assits, "Assists", comparePlayersStats)}
                />

                <StatLabel
                    label="Turnovers"
                    value={turnovers}
                    isGreen={isStatActionBest(player, turnovers, "TurnoversConceded", comparePlayersStats)}
                />

                <StatLabel
                    label="Passes"
                    value={passes}
                    isGreen={isStatActionBest(player, passes, "Passes", comparePlayersStats)}
                />

                {/* <StatLabel
          label="Ball Carying"
          value={player.ball_carrying}

        /> */}


                <SecondaryText className="mt-2" >Defense</SecondaryText>

                <StatLabel
                    label="Defence"
                    value={starRatings?.defence}
                    isGreen={isStarRatingBest(player, starRatings?.defence, "defence", comparePlayersStarRatings)}
                />

                {/* <StatLabel
          label="Strength"
          value={player.strength}

        /> */}

                <StatLabel
                    label="Tackles Made"
                    value={tacklesMade}
                    isGreen={isStatActionBest(player, tacklesMade, "TacklesMade", comparePlayersStats)}
                />

                <StatLabel
                    label="Tackles Sucess"
                    value={tackleSuccess ? (tackleSuccess * 100) : undefined}
                    isGreen={isStatActionBest(player, tackleSuccess ? (tackleSuccess * 100) : undefined, "TackleSuccess", comparePlayersStats)}
                />

                <StatLabel
                    label="Turnovers Won"
                    value={turnoversWon}
                    isGreen={isStatActionBest(player, turnoversWon, "TurnoversWon", comparePlayersStats)}
                />

                <SecondaryText className="mt-2" >Kicking</SecondaryText>

                <StatLabel
                    label="Kicking"
                    value={starRatings?.kicking}
                    isGreen={isStarRatingBest(player, starRatings?.kicking, "kicking", comparePlayersStarRatings)}
                />

                <StatLabel
                    label="Kicks From Hand"
                    value={kicksFromHand}
                    isGreen={isStatActionBest(player, kicksFromHand, "KicksFromHand", comparePlayersStats)}
                />

                <StatLabel
                    label="Metres"
                    value={kicksFromHandMetres}
                    isGreen={isStatActionBest(player, kicksFromHandMetres, "KicksFromHandMetres", comparePlayersStats)}
                />

                <StatLabel
                    label="Points Kicking"
                    value={starRatings?.points_kicking}
                    isGreen={isStarRatingBest(player, starRatings?.points_kicking, "points_kicking", comparePlayersStarRatings)}
                />

                <StatLabel
                    label="Infield Kicking"
                    value={starRatings?.infield_kicking}
                    isGreen={isStarRatingBest(player, starRatings?.infield_kicking, "infield_kicking", comparePlayersStarRatings)}
                />
            </div>}

            {isLoading && <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 animate-pulse"></div>}
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
        <div className="flex flex-row items-center gap-1" >
            <div className={twMerge(
                "bg-slate-200 flex-[3] py-1 border border-slate-300 dark:border-slate-700 dark:bg-slate-700/40 rounded-md text-[12px] px-2 sm:text-sm",
            )} >
                {label}
            </div>
            <div className={twMerge(
                "bg-slate-300 flex-1 py-1 text-center items-center dark:bg-slate-700 border border-slate-400 dark:border-slate-600 rounded-md text-[12px] sm:text-sm px-1",
                isGreen && "from-primary-500 bg-gradient-to-r to-blue-700 text-white border-blue-600 dark:border-blue-600"
            )} >{hasVal ? valueFixed?.endsWith(".0") ? value : valueFixed : "-"}</div>
        </div>
    )
}
