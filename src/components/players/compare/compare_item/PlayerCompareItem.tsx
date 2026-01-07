import { IProAthlete } from '../../../../types/athletes';
import usePlayerStats from '../../../../hooks/athletes/usePlayerStats';
import PlayerCompareItemHeader from './PlayerCompareItemHeader';
import PlayerIconsRow from '../PlayerIconsRow';
import PlayerCompareSeasonStatsList from '../season_stats/PlayerCompareSeasonStats';

type Props = {
  player: IProAthlete;
};

export default function PlayersCompareItem({ player }: Props) {

  // const [, startTransition] = useTransition();

  const {
    seasonPlayerStats: actions,
    loadingPlayerStats: loadingActions,
    currSeason,
    starRatings,
    loadingStarRatings,
  } = usePlayerStats(player);

  const isLoading = loadingActions || loadingStarRatings || !currSeason;

  return (
    <div className="flex flex-col gap-2 w-[calc(50%-0.25rem)] md:flex-1 md:min-w-[200px] md:max-w-[300px] flex-shrink-0">
      <PlayerCompareItemHeader player={player} />

      {/* Player Icons Row */}
      {!isLoading && starRatings && actions && currSeason && (
        <PlayerIconsRow player={player} season={currSeason} size="sm" />
      )}

        {currSeason && (<div className="flex flex-col gap-4">
          {/* Player Statistics Card (same structure as PlayerSeasonStatsCard) */}
          <PlayerCompareSeasonStatsList season={currSeason} player={player} />
          
        </div>)}
      
        {!currSeason && <div className="flex flex-col gap-4">
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
        </div>}
      

      {/* page-level skeleton removed; tray handles loading */}
    </div>
  );
}
