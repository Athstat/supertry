import { Fragment, useMemo, useState } from 'react';
import { useDashboard } from '../../../hooks/dashboard/useDashboard';
import { IProSeason } from '../../../types/season';
import { useFantasyPointsRankings } from '../../../hooks/fantasy/useSportActionRanking';
import RoundedCard from '../../shared/RoundedCard';
import { IProAthlete } from '../../../types/athletes';
import PlayerProfileModal from '../../player/PlayerProfileModal';
import NoContentCard from '../../shared/NoContentMessage';
import { PlayerRankingCard } from '../../players/ranking/PlayerRankingCard';

type Props = {
  season?: IProSeason;
};

export default function FantasyPointsScoredPlayerList({ season }: Props) {
  const { currentSeason } = useDashboard();

  const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
  const toggleModal = () => {
    setSelectedPlayer(undefined);
  };

  const finalSeason = useMemo(() => {
    return season || currentSeason;
  }, [currentSeason, season]);

  const { rankings, isLoading } = useFantasyPointsRankings(finalSeason?.id ?? '', 3);

  if (!finalSeason) {
    return;
  }

  if (isLoading) {
    return (
      <>
        <RoundedCard className="p-4 h-[260px] animate-pulse border-none flex flex-col gap-2"></RoundedCard>
      </>
    );
  }

  return (
    <Fragment>
      <RoundedCard className="h-[260px] rounded-xl p-4 flex flex-col gap-2 overflow-hidden">
        <div>
          <p className="font-semibold">Fantasy Points Scored</p>
        </div>

        <div className="flex flex-col items-center overflow-y-auto gap-2">
          {rankings.map((r, index) => {
            const val = r.total_points;

            return (
              <PlayerRankingCard
                player={r}
                key={r.tracking_id}
                rank={index + 1}
                onClick={setSelectedPlayer}
                value={val ? `${Math.floor(val)}` : '--'}
              />
            );
          })}
        </div>

        {rankings.length === 0 && (
          <NoContentCard message="Whoops!! Nothing to see here yet. Check again soon" />
        )}
      </RoundedCard>

      {selectedPlayer && (
        <PlayerProfileModal player={selectedPlayer} onClose={toggleModal} isOpen={true} />
      )}
    </Fragment>
  );
}
