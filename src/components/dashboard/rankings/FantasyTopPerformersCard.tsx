import { Fragment, useState } from 'react';
import { useFantasySeasons } from '../../../hooks/dashboard/useFantasySeasons';
import { IProAthlete } from '../../../types/athletes';
import PlayerProfileModal from '../../player/PlayerProfileModal';
import NoContentCard from '../../ui/typography/NoContentMessage';
import { PlayerRankingCard } from '../../players/ranking/PlayerRankingCard';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { queryParamKeys } from '../../../types/constants';
import RoundedCard from '../../ui/cards/RoundedCard';
import { useFantasyPointsRankings } from '../../../hooks/athletes/useFantasyPointsRankings';
import { getRankingBorderColor } from '../../../utils/fantasy/rankingUtils';
import FantasyTopPlayersCard from './FantasyTopPlayersCard';

type Props = {
  className?: string
}

/** Renders a fantasy top performers card */
export default function FantasyTopPerformersCard({className} : Props) {
  const { selectedSeason: finalSeason, scoringRound } = useFantasySeasons();
  const navigate = useNavigate();

  const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
  const toggleModal = () => {
    setSelectedPlayer(undefined);
  };

  const { rankings, isLoading } = useFantasyPointsRankings((finalSeason?.id ?? ''), 5, {
    round_number: scoringRound?.round_number
  });

  const handleViewMore = () => {
    const queryParam = scoringRound?.round_number ? `?${queryParamKeys.ROUND_NUMBER_QUERY_KEY}=${scoringRound.round_number}` : '';
    navigate(`/players/fantasy-top-performers${queryParam}`);
  }

  if (!finalSeason) {
    return;
  }

  if (isLoading) {
    return (
      <>
        <RoundedCard className="p-4 h-[260px] animate-pulse border-none flex flex-col gap-2 bg-gray-200 dark:bg-gray-800"></RoundedCard>
      </>
    );
  }

  if (rankings.length === 0) {
    return <FantasyTopPlayersCard className={className} />;
  }

  return (
    <Fragment>
      <RoundedCard className={twMerge(
        "rounded-xl overflow-hidden bg-[#F0F3F7]",
        className
      )}>
        
        {/* Title */}
        <div className="p-4">
          <p className="font-semibold text-lg text-[#011E5C] dark:text-white" style={{ fontFamily: 'Oswald', }}>
            Fantasy Top Performers {scoringRound?.round_number ? `(Round ${scoringRound?.round_number})` : ''}
          </p>
        </div>

        {/* Table Header */}
        <div className="bg-[#011E5C] text-white pl-4 py-4 flex items-center gap-4 w-[97%] mx-auto">
          <div className="w-8 text-sm font-medium">Position</div>
          <div className="flex-1 text-sm font-medium ml-14">Player</div>
          <div className="text-sm font-medium mr-4">Points</div>
        </div>

        <div className="flex flex-col items-center overflow-y-auto gap-4 pt-1 pl-2 pr-2">
          {rankings.map((r, index) => {
            const val = r.total_points;
            const rank = index + 1;

            return (
              <PlayerRankingCard
                player={r}
                key={r.tracking_id}
                rank={rank}
                onClick={setSelectedPlayer}
                value={val ? `${Math.floor(val)}` : '--'}
                borderColor={getRankingBorderColor(rank)}
              />
            );
          })}
        </div>

        {rankings.length === 0 && (
          <div className="p-4">
            <NoContentCard message="Whoops!! Nothing to see here yet. Check again soon" />
          </div>
        )}

        {/* View All Players Link */}
        <p
          onClick={handleViewMore}
          className="font-semibold text-sm text-[#011E5C] dark:text-white underline pb-4 text-center cursor-pointer"
        >
          View All Players
        </p>
      </RoundedCard>

      {selectedPlayer && (
        <PlayerProfileModal player={selectedPlayer} onClose={toggleModal} isOpen={true} />
      )}
    </Fragment>
  );
}
