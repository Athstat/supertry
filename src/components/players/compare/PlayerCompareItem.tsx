import { IProAthlete } from '../../../types/athletes';
import usePlayerStats from '../../player/player_profile_modal/usePlayerStats';
import PlayerCompareSeasonPicker from './PlayerCompareSeasonPicker';
import PlayerCompareItemHeader from './PlayerCompareItemHeader';
import { useEffect, useTransition } from 'react';
import { useAtom } from 'jotai';
import {
  comparePlayersStarRatingsAtom,
  comparePlayersStatsAtom,
} from '../../../state/comparePlayers.atoms';
import PlayerIconsRow from './PlayerIconsRow';

import PlayerSeasonStatsTray from '../../stats/PlayerSeasonStatsTray';

type Props = {
  player: IProAthlete;
};

export default function PlayersCompareItem({ player }: Props) {
  const [comparePlayersStats, setComparePlayersStats] = useAtom(comparePlayersStatsAtom);
  const [comparePlayersStarRatings, setComparePlayerRatings] = useAtom(
    comparePlayersStarRatingsAtom
  );

  const [_, startTransition] = useTransition();

  const {
    seasonPlayerStats: actions,
    loadingPlayerStats: loadingActions,
    seasons,
    currSeason,
    setCurrSeason,
    starRatings,
    loadingStarRatings,
  } = usePlayerStats(player);

  useEffect(() => {
    if (loadingActions || loadingStarRatings) return;

    if (!actions || actions.length === 0) return;

    startTransition(() => {
      const newStats = comparePlayersStats.filter(f => {
        return !(f.athlete.tracking_id === player.tracking_id);
      });

      newStats.push({
        athlete: player,
        stats: actions,
      });

      setComparePlayersStats(newStats);

      const newStarRatings = comparePlayersStarRatings.filter(s => {
        return !(s.athlete.tracking_id === player.tracking_id);
      });

      if (starRatings) {
        newStarRatings.push({
          athlete: player,
          stats: starRatings,
        });
      }

      setComparePlayerRatings(newStarRatings);
    });
  }, [actions, starRatings, loadingActions, loadingStarRatings, player, comparePlayersStats, comparePlayersStarRatings, setComparePlayersStats, setComparePlayerRatings]);

  const isLoading = loadingActions || loadingStarRatings || !currSeason;

  // Top stats are shown within the 'General' category rows; no bespoke summary needed


  return (
    <div className="flex flex-col gap-2 w-[calc(50%-0.25rem)] md:flex-1 md:min-w-[200px] md:max-w-[300px] flex-shrink-0">
      <PlayerCompareItemHeader player={player} />

      {seasons && (
        <PlayerCompareSeasonPicker
          seasons={seasons}
          setCurrSeason={setCurrSeason}
          currSeason={currSeason}
        />
      )}

      {/* Player Icons Row */}
      {!isLoading && starRatings && actions && currSeason && (
        <PlayerIconsRow player={player} season={currSeason} size="sm" />
      )}

      {currSeason ? (
        <div className="flex flex-col gap-4">
          {/* Player Statistics Card (same structure as PlayerSeasonStatsCard) */}
          <div className="flex flex-col bg-slate-50 border dark:border-slate-600 border-slate-300 dark:bg-slate-700/80 w-full gap-3 p-3 rounded-xl">
            <div className="flex flex-row items-center justify-between">
              <p className="text-xs">{currSeason.name}</p>
              {/* expanded by default; no toggle */}
            </div>

            {/* Summary removed; 'General' category appears first and includes Tries, Points, Minutes as aligned rows */}

            <div>
              <PlayerSeasonStatsTray
                player={player}
                season={currSeason}
                stats={actions ?? []}
                isLoading={isLoading}
                forceCanonicalOrder
                highlightRowLeaders
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col bg-slate-50 border dark:border-slate-600 border-slate-300 dark:bg-slate-700/80 w-full gap-3 p-3 rounded-xl">
            <div className="flex flex-row items-center justify-between">
              <div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-16 h-5 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
              <div className="w-16 h-5 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
              <div className="w-24 h-5 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-full h-24 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* page-level skeleton removed; tray handles loading */}
    </div>
  );
}
