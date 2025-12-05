import { IProAthlete } from '../../../../types/athletes';
import PlayerPerformanceSnapshot from '../PlayerPerformanceSnapshot';
import PowerRankingChartTab from './PRChartTab';

type Props = {
  player: IProAthlete;
};

export default function PlayerMatchesTab({ player }: Props) {
  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* TIER 1: Performance Snapshot */}
      <PlayerPerformanceSnapshot player={player} />

      {/* <PlayerPrTrendCard 
        player={player}
      /> */}

      {/* TIER 2: Power Ranking Chart */}
      <PowerRankingChartTab player={player} />
    </div>
  );
}
