import { IProAthlete } from '../../../types/athletes';
import usePowerRankings from './usePowerRankings';
import { Activity, Trophy, Hash } from 'lucide-react';

type Props = {
  player: IProAthlete;
};

/** Renders a performance snapshot bar with key metrics */
export default function PlayerPerformanceSnapshot({ player }: Props) {
  const { data: powerRankings } = usePowerRankings(player.tracking_id);

  // Calculate metrics from power rankings data
  const avgPR =
    powerRankings && powerRankings.length > 0
      ? (
          powerRankings.reduce((sum, item) => sum + item.updated_power_ranking, 0) /
          powerRankings.length
        ).toFixed(1)
      : null;

  const bestMatch =
    powerRankings && powerRankings.length > 0
      ? Math.max(...powerRankings.map(item => item.updated_power_ranking))
      : null;

  const totalMatches = powerRankings?.length || 0;

  if (!avgPR && !bestMatch && totalMatches === 0) {
    return null;
  }

  return (
    <div className="flex flex-row gap-3 flex-wrap">
      {/* Average PR */}
      {/* {avgPR && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/10">
          <Activity className="w-4 h-4 text-blue-400" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Avg PR</span>
            <span className="text-sm font-bold text-white">{avgPR}</span>
          </div>
        </div>
      )} */}

      {/* Best Match */}
      {bestMatch && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-sm ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/10">
          <Trophy className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Best Match</span>
            <span className="text-sm font-bold text-white">PR: {bestMatch}</span>
          </div>
        </div>
      )}

      {/* Total Matches */}
      {totalMatches > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-sm ring-1 ring-green-500/30 shadow-lg shadow-green-500/10">
          <Hash className="w-4 h-4 text-green-400" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Total Matches</span>
            <span className="text-sm font-bold text-white">{totalMatches}</span>
          </div>
        </div>
      )}
    </div>
  );
}
