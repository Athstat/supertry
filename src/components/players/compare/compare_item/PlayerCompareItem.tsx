import { IProAthlete } from '../../../../types/athletes';
import PlayerCompareItemHeader from './PlayerCompareItemHeader';
import PlayerCompareSeasonStatsList from '../season_stats/PlayerCompareSeasonStats';
import PlayerPointsHistoryList from '../../../player/player_profile_modal/points_history/PlayerPointsHistoryList';
import SecondaryText from '../../../ui/typography/SecondaryText';
import MatchPrCard from '../../../rankings/MatchPrCard';
import PlayerCompareItemProvider from '../../../../contexts/PlayerCompareItemContext';
import { usePlayerCompareItem } from '../../../../hooks/athletes/usePlayerCompareItem';
import RoundedCard from '../../../ui/cards/RoundedCard';

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

  const { selectedSeason, player, isLoading } = usePlayerCompareItem();

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
        />

        <PlayerCompareSeasonStatsList season={selectedSeason} player={player} />

      </div>)}

      {!selectedSeason && <div className="flex flex-col gap-4">
        <div className="flex flex-col bg-slate-50 border dark:border-slate-600 border-slate-300 dark:bg-slate-700/80 w-full gap-3 p-3 rounded-xl">
          <div className="flex flex-row items-center justify-between">
            <div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-16 h-5 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
            <div className="w-16 h-5 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
            <div className="w-24 h-5 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full h-24 rounded bg-slate-200 dark:bg-slate-600 animate-pulse" />
          </div>
        </div>
      </div>}


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