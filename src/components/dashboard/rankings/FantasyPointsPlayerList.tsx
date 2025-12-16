import { Fragment, useMemo, useState } from 'react';
import { useDashboard } from '../../../hooks/dashboard/useDashboard';
import { IProSeason } from '../../../types/season';
import { useFantasyPointsRankings } from '../../../hooks/fantasy/useSportActionRanking';
import RoundedCard from '../../shared/RoundedCard';
import { IProAthlete } from '../../../types/athletes';
import PlayerProfileModal from '../../player/PlayerProfileModal';
import NoContentCard from '../../shared/NoContentMessage';
import { PlayerRankingCard } from '../../players/ranking/PlayerRankingCard';
import { useNavigate } from 'react-router-dom';

type Props = {
  season?: IProSeason;
  currentRound?: number;
};

export default function FantasyPointsScoredPlayerList({ season, currentRound }: Props) {
  const { currentSeason } = useDashboard();
  const navigate = useNavigate();

  const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
  const toggleModal = () => {
    setSelectedPlayer(undefined);
  };

  const finalSeason = useMemo(() => {
    return season || currentSeason;
  }, [currentSeason, season]);

  const { rankings, isLoading } = useFantasyPointsRankings(finalSeason?.id ?? '', 5);

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

  return (
    <Fragment>
      <RoundedCard className="rounded-xl overflow-hidden bg-[#F0F3F7]">
        {/* Title */}
        <div className="p-4">
          <p className="font-semibold text-lg text-[#011E5C] dark:text-white" style={{ fontFamily: 'Oswald', }}>
            Fantasy Top Performers {currentRound ? `(Round ${currentRound})` : ''}
          </p>
        </div>

        {/* Table Header */}
        <div className="bg-[#011E5C] text-white pl-4 py-2 flex items-center gap-4 w-[97%] mx-auto">
          <div className="w-8 text-xs font-semibold">Position</div>
          <div className="flex-1 text-xs font-semibold ml-14">Player</div>
          <div className="text-xs font-semibold mr-4">Points</div>
        </div>

        <div className="flex flex-col items-center overflow-y-auto gap-1 pt-4 pl-2 pr-2">
          {rankings.map((r, index) => {
            const val = r.total_points;
            const rank = index + 1;

            // Define border colors based on rank
            const getBorderColor = (rank: number) => {
              switch (rank) {
                case 1: return '#1CA64F'; // Gold
                case 2: return '#EF4444'; // Silver
                case 3: return '#475569'; // Bronze
                case 4: return '#1CA64F'; // Purple
                case 5: return '#475569'; // Green
                default: return '#1196F5'; // Blue
              }
            };

            return (
              <PlayerRankingCard
                player={r}
                key={r.tracking_id}
                rank={rank}
                onClick={setSelectedPlayer}
                value={val ? `${Math.floor(val)}` : '--'}
                borderColor={getBorderColor(rank)}
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
          onClick={() => navigate('/players')}
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
