import { Fragment, useMemo, useState } from 'react';
import { useFantasySeasons } from '../../../hooks/dashboard/useFantasySeasons';
import { IProSeason } from '../../../types/season';
import { useSportActionRankings } from '../../../hooks/fantasy/useSportActionRanking';
import RoundedCard from '../../shared/RoundedCard';
import { twMerge } from 'tailwind-merge';
import { IProAthlete } from '../../../types/athletes';
import PlayerProfileModal from '../../player/PlayerProfileModal';
import NoContentCard from '../../shared/NoContentMessage';
import { PlayerRankingCard } from '../../players/ranking/PlayerRankingCard';

type Props = {
  season?: IProSeason;
  actionName: string;
  title: string;
  className?: string;
};

/** Renders a sports action ranking card */
export default function SportActionRankingsList({ season, actionName, title, className }: Props) {
  const { currentSeason } = useFantasySeasons();
  const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
  const toggleModal = () => {
    setSelectedPlayer(undefined);
  };

  const finalSeason = useMemo(() => {
    return season ?? currentSeason;
  }, [season, currentSeason]);

  const { rankings, isLoading } = useSportActionRankings(finalSeason?.id ?? '', actionName);

  if (!finalSeason) {
    return;
  }

  if (isLoading) {
    return (
      <>
        <RoundedCard
          className={twMerge(
            ' h-[380px] animate-pulse border-none rounded-xl p-4 flex flex-col gap-2 bg-gray-200 dark:bg-gray-800',
            className
          )}
        ></RoundedCard>
      </>
    );
  }

  return (
    <Fragment>
      <RoundedCard
        className={twMerge(
          ' h-[380px] rounded-xl p-4 flex flex-col gap-2 overflow-hidden',
          className
        )}
      >
        <div>
          <p className="font-semibold">{title}</p>
        </div>

        <div className="flex flex-col items-center gap-2 overflow-y-auto">
          {rankings.map((r, index) => {
            return (
              <PlayerRankingCard
                player={r}
                rank={index + 1}
                key={r.tracking_id}
                onClick={setSelectedPlayer}
                value={r.action_count ?? '-'}
              />
            );
          })}
        </div>

        {rankings.length === 0 && (
          <NoContentCard message="Whoops!! Nothing to see here yet. Check again soon" />
        )}
      </RoundedCard>

      {selectedPlayer && (
        <PlayerProfileModal player={selectedPlayer} isOpen={true} onClose={toggleModal} />
      )}
    </Fragment>
  );
}
