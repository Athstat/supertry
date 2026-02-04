import { IProAthlete } from '../../../../types/athletes';
import PlayerCompareItemHeader from './PlayerCompareItemHeader';
import PlayerCompareSeasonStatsList from '../season_stats/PlayerCompareSeasonStats';
import PlayerPointsHistoryList from '../../../player/player_profile_modal/points_history/PlayerPointsHistoryList';
import SecondaryText from '../../../ui/typography/SecondaryText';
import MatchPrCard from '../../../rankings/MatchPrCard';
import { usePlayerCompareItem } from '../../../../hooks/athletes/usePlayerCompareItem';
import RoundedCard from '../../../ui/cards/RoundedCard';
import PlayerFixtureModal from '../../../fixture/player_fixture_modal/PlayerFixtureModal';
import PlayerCompareItemProvider from '../../../../contexts/ui/PlayerCompareItemContext';

type Props = {
  player: IProAthlete;
};

/** Renders a player compare item */
export default function PlayersCompareItem({ player }: Props) {

  return (
    <PlayerCompareItemProvider player={player} >
      <Content />
    </PlayerCompareItemProvider>
  )

}

function Content() {

  const { selectedSeason, player, isLoading, hasNoData, setFixture, selectedFixture } = usePlayerCompareItem();

  const handleCloseFixtureModal = () => {
    setFixture(undefined);
  }

  if (isLoading) {
    return (
      <LoadingSkeleton />
    )
  }

  return (
    <div className="flex flex-col gap-2 w-[calc(50%-0.25rem)] md:flex-1 md:min-w-[200px] md:max-w-[300px] flex-shrink-0">

      <PlayerCompareItemHeader player={player} />

      <div className='px-3' >
        <div className='flex flex-row items-center justify-between gap-2' >
          <SecondaryText>Power Ranking</SecondaryText>
          <MatchPrCard
            pr={player.power_rank_rating}
          />
        </div>
      </div>


      {/* Player Icons Row */}
      {/* {!isLoading && starRatings && actions && currSeason && (
        <PlayerIconsRow player={player} season={currSeason} size="sm" />
      )} */}

      {selectedSeason && (<div className="flex flex-col gap-4">
        {/* Player Statistics Card (same structure as PlayerSeasonStatsCard) */}

        <PlayerPointsHistoryList
          player={player}
          season={selectedSeason}
          onSelectFixture={setFixture}
        />

        <PlayerCompareSeasonStatsList season={selectedSeason} player={player} />

      </div>)}

      {!selectedSeason && !hasNoData && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col w-full gap-3 p-3 rounded-xl">
            <SecondaryText className='' >Pick a season to compare player stats against</SecondaryText>
          </div>
        </div>
      )}

      {selectedFixture && (
        <PlayerFixtureModal 
          player={player}
          fixture={selectedFixture}
          onClose={handleCloseFixtureModal}
          isOpen={Boolean(selectedFixture) && Boolean(player)}
        />
      )}

      {/* page-level skeleton removed; tray handles loading */}
    </div>
  );
}

function LoadingSkeleton() {
  const { player } = usePlayerCompareItem();
  return (
    <div className='flex flex-col gap-2' >
      <PlayerCompareItemHeader player={player} />

      <div className='px-3' >
        <div className='flex flex-row items-center justify-between gap-2' >
          <SecondaryText>Power Ranking</SecondaryText>
          <MatchPrCard
            pr={player.power_rank_rating}
          />
        </div>
      </div>

      <div className='flex flex-col gap-2' >
        <RoundedCard className='p-2 w-full border-none bg-slate-100 animate-pulse h-[120px]' />
        <RoundedCard className='p-2 w-full border-none bg-slate-100 animate-pulse h-[150px]' />
        <RoundedCard className='p-2 w-full border-none bg-slate-100 animate-pulse h-[150px]' />
        <RoundedCard className='p-2 w-full border-none bg-slate-100 animate-pulse h-[150px]' />
      </div>
    </div>
  )
}