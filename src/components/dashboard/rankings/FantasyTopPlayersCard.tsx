import { Fragment, useMemo, useState } from 'react';
import { useFantasySeasons } from '../../../hooks/dashboard/useFantasySeasons';
import { IProAthlete } from '../../../types/athletes';
import PlayerProfileModal from '../../player/PlayerProfileModal';
import NoContentCard from '../../ui/typography/NoContentMessage';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import RoundedCard from '../../ui/cards/RoundedCard';
import { getRankingBorderColor } from '../../../utils/fantasy/rankingUtils';
import { usePlayerSeasonTeam } from '../../../hooks/seasons/useSeasonTeams';
import TeamJersey from '../../player/TeamJersey';
import RankNumberCard from '../../ui/cards/RankNumberCard';
import SecondaryText from '../../ui/typography/SecondaryText';
import { useSupportedAthletes } from '../../../hooks/athletes/useSupportedAthletes';

type Props = {
  className?: string
}

/** Renders a fantasy top players by power ranking card */
export default function FantasyTopPlayersCard({className} : Props) {

  const { selectedSeason: finalSeason } = useFantasySeasons();
  const navigate = useNavigate();

  const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
  const toggleModal = () => {
    setSelectedPlayer(undefined);
  };

  const {athletes, isLoading} = useSupportedAthletes();

  const top5ByPR = useMemo(() => {
    return [...athletes].slice(0, 5);
  }, [athletes])

  const handleViewMore = () => {
    navigate(`/players/all`);
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

  return (
    <Fragment>
      <RoundedCard className={twMerge(
        "rounded-xl overflow-hidden bg-transparent",
        className
      )}>
        
        {/* Title */}
        <div className="p-4">
          <p className="font-semibold text-xl text-[#011E5C] dark:text-white" style={{ fontFamily: 'Oswald', }}>
            Top Rated Six Nations Players
          </p>
        </div>

        {/* Table Header */}
        <div className="bg-[#011E5C] text-white pl-4 py-2 flex items-center gap-4 w-[97%] mx-auto">
          <div className="w-8 text-xs font-semibold">Position</div>
          <div className="flex-1 text-xs font-semibold ml-14">Player</div>
          <div className="text-xs font-semibold mr-4">Power Rank</div>
        </div>

        <div className="flex flex-col items-center overflow-y-auto gap-1 pt-4 pl-2 pr-2">
          {top5ByPR.map((r, index) => {
            const rank = index + 1;

            return (
              <PlayerItem
                player={r}
                key={r.tracking_id}
                rank={rank}
                onClick={setSelectedPlayer}
                borderColor={getRankingBorderColor(rank)}
              />
            );
          })}
        </div>

        {top5ByPR.length === 0 && (
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



type PlayerRankingCardProps = {
  rank: number | string;
  player: IProAthlete;
  onClick: (player: IProAthlete) => void;
  borderColor?: string;
};

/** Renders a Horizontal Player Ranking Card */
function PlayerItem({ rank, onClick, player, borderColor = '#1196F5' }: PlayerRankingCardProps) {
  
  const {seasonTeam} = usePlayerSeasonTeam(player);
  
  const handleOnClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  return (
    <div className="flex flex-col w-full shadow-slate-300 dark:shadow-none  shadow-sm overflow-hidden">
      <div
        onClick={handleOnClick}
        className="flex cursor-pointer  flex-row items-center gap-4 overflow-hidden border-l-4 pl-2 py-2"
        style={{ borderLeftColor: borderColor }}
      >
        {/* Rank number with grey background */}
        <RankNumberCard 
          value={rank}
        />

        <div className="flex flex-row items-center gap-2 flex-shrink-0">
          {seasonTeam && (
            <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex flex-col items-center justify-center">
              <TeamJersey
                useBaseClasses={false}
                teamId={seasonTeam.athstat_id}
                className="h-8"
                hideFade
              />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm truncate">{player.player_name}</p>
          <SecondaryText className="text-xs truncate">{seasonTeam?.athstat_name}</SecondaryText>
        </div>

        <div className="flex-shrink-0 mr-4 flex flex-row items-center justify-end">
          <p className="font-semibold text-sm">{player.power_rank_rating ? Math.floor(player.power_rank_rating || 0) : ''}</p>
        </div>
      </div>
    </div>
  );
}
