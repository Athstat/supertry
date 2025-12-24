import { Fragment, useMemo, useState } from 'react';
import { useFantasySeasons } from '../../../hooks/dashboard/useFantasySeasons';
import { IProSeason } from '../../../types/season';
import { useMostSelectedPlayers } from '../../../hooks/fantasy/useSportActionRanking';
import RoundedCard from '../../shared/RoundedCard';
import { IProAthlete } from '../../../types/athletes';
import PlayerProfileModal from '../../player/PlayerProfileModal';
import NoContentCard from '../../shared/NoContentMessage';
import { PlayerRankingCard } from '../../players/ranking/PlayerRankingCard';

type Props = {
  season?: IProSeason;
};

export default function MostSelectedPlayersList({ season }: Props) {
  const { currentSeason } = useFantasySeasons();

  const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
  const toggleModal = () => {
    setSelectedPlayer(undefined);
  };

  const finalSeason = useMemo(() => {
    return season || currentSeason;
  }, [currentSeason, season]);

  const { rankings, isLoading } = useMostSelectedPlayers(finalSeason?.id ?? '', 3);

  if (!finalSeason) {
    return;
  }

  if (isLoading) {
    return (
      <>
        <RoundedCard className="p-4 h-[250px] animate-pulse border-none flex flex-col gap-2 bg-gray-200 dark:bg-gray-800"></RoundedCard>
      </>
    );
  }

  return (
    <Fragment>
      <RoundedCard className="p-4 h-[250px] flex flex-col gap-2 overflow-hidden">
        <div>
          <p className="font-semibold">Most Selected Players</p>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">
          {rankings.map((r, index) => {
            const val = r.percentage_selected;

            return (
              <PlayerRankingCard
                player={r}
                key={r.tracking_id}
                rank={index + 1}
                onClick={setSelectedPlayer}
                value={val ? `${val.toFixed(1)}%` : '-'}
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
