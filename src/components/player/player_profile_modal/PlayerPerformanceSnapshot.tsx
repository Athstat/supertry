import { useMemo } from 'react';
import { IProAthlete } from '../../../types/athletes';
import usePowerRankings from '../../../hooks/athletes/usePowerRankings';
import RoundedCard from '../../shared/RoundedCard';
import SecondaryText from '../../ui/typography/SecondaryText';
import MatchPrCard from '../../rankings/MatchPrCard';

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

  const bestMatch = useMemo(() => {
    return powerRankings && powerRankings.length > 0
      ? Math.max(...powerRankings.map(item => item.updated_power_ranking))
      : null;
  }, [powerRankings]);

  const totalMatches = powerRankings?.length || 0;

  const average = useMemo(() => {

    if (totalMatches === 0) {
      return undefined;
    }

    const totalPr = powerRankings.reduce((sum, curr) => {
      return sum + curr.updated_power_ranking;
    }, 0);

    return (totalPr) / (totalMatches)
  }, [totalMatches, powerRankings]);

  const worstMatch = useMemo(() => {
    return powerRankings && powerRankings.length > 0
      ? Math.min(...powerRankings.map(item => item.updated_power_ranking))
      : null;
  }, [powerRankings]);

  if (!avgPR && !bestMatch && totalMatches === 0) {
    return null;
  }

  return (
    <RoundedCard className="flex flex-col gap-4  flex-wrap p-4">

      <div>
        <p className='font-semibold text-sm' >Summary (Last {totalMatches} Games)</p>
      </div>

      <div className='flex flex-row items-center justify-between' >

        <div className='flex flex-col gap-1 items-center justify-center flex-1' >
          <SecondaryText>Best PR</SecondaryText>
          {bestMatch && <MatchPrCard
            pr={bestMatch}
          />}
        </div>

        <div className='flex flex-col gap-1 items-center justify-center flex-1' >
          <SecondaryText>Average PR</SecondaryText>
          {average && <MatchPrCard
            pr={average}
          />}
        </div>

        <div className='flex flex-col gap-1 items-center justify-center flex-1' >
          <SecondaryText>Worst PR</SecondaryText>
          {worstMatch && <MatchPrCard
            pr={worstMatch}
          />}
        </div>

      </div>

    </RoundedCard>
  );
}
