import { Fragment, useState } from 'react';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { swrFetchKeys } from '../../utils/swrKeys';
import useSWR from 'swr';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import RoundedCard from '../shared/RoundedCard';
import GroupedFixturesList from '../fixtures/GroupedFixturesList';
import NoContentCard from '../shared/NoContentMessage';

export default function LeagueFixturesTab() {
  const { sortedRounds, currentRound } = useFantasyLeagueGroup();

  const [selectedRoundId, setSelectedRoundId] = useState<number | undefined>(() => {
    const index = sortedRounds.findIndex(r => r.id === currentRound?.id);

    if (index === -1) {
      return undefined;
    }

    return index;
  });

  const isIndexValid =
    selectedRoundId !== undefined && selectedRoundId >= 0 && selectedRoundId < sortedRounds.length;
  const selectedRound = isIndexValid ? sortedRounds[selectedRoundId] : undefined;

  const canMoveLeft = selectedRoundId !== undefined && selectedRoundId > 0;
  const canMoveRight = selectedRoundId !== undefined && selectedRoundId < sortedRounds.length - 1;

  const moveLeft = () => {
    if (selectedRoundId === undefined) {
      return;
    }

    if (selectedRoundId > 0) {
      setSelectedRoundId(selectedRoundId - 1);
    }
  };

  const moveRight = () => {
    if (selectedRoundId === undefined) {
      return;
    }

    if (canMoveRight) {
      setSelectedRoundId(selectedRoundId + 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <Calendar className="" />
          <p className="font-bold text-xl">Fixtures</p>
        </div>

        {selectedRound && (
          <div className="flex flex-row items-center gap-2">
            {canMoveLeft && (
              <button
                onClick={moveLeft}
                className="bg-slate-300 cursor-pointer text-slate-700 dark:text-slate-400 dark:bg-slate-800 px-3 py-1 rounded-xl hover:dark:bg-slate-700"
              >
                <ChevronLeft />
              </button>
            )}
            <div className="bg-slate-300 text-slate-700 dark:text-slate-400 dark:bg-slate-800 px-3 py-1 rounded-xl hover:dark:bg-slate-700">
              {selectedRound.title}
            </div>

            {canMoveRight && (
              <button
                onClick={moveRight}
                className="bg-slate-300 cursor-pointer text-slate-700 dark:text-slate-400 dark:bg-slate-800 hover:dark:bg-slate-700 px-3 py-1 rounded-xl"
              >
                <ChevronRight />
              </button>
            )}
          </div>
        )}
      </div>

      {/* <div className='flex flex-row items-center gap-2 flex-nowrap overflow-x-auto no-scrollbar' >
                {sortedRounds.map((round) => {
                    return <RoundListItem
                        round={round}
                        key={round.id}
                        ref={round.id === currentRound?.id ? currRoundRef : undefined}
                        isCurrent={round.id === currentRound?.id}
                    />
                })}
            </div> */}

      {selectedRound && <FixtureListView round={selectedRound} />}
    </div>
  );
}

type FixtureListProps = {
  round: IFantasyLeagueRound;
};

function FixtureListView({ round }: FixtureListProps) {
  const key = swrFetchKeys.getGroupRoundGames(round.fantasy_league_group_id, round.id);
  const { data: fetchedGames, isLoading } = useSWR(key, () =>
    fantasyLeagueGroupsService.getGroupRoundGames(round.fantasy_league_group_id, round.id)
  );

  const games = fetchedGames ?? [];

  const upcomingGames = games.filter(game => {
    return game?.kickoff_time > new Date();
  });

  console.log('games: ', games);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-2">
        <RoundedCard className="w-full bg-slate-200 h-16 animate-pulse border-none" />
        <RoundedCard className="w-full bg-slate-200 h-16 animate-pulse border-none" />
        <RoundedCard className="w-full bg-slate-200 h-16 animate-pulse border-none" />
        <RoundedCard className="w-full bg-slate-200 h-16 animate-pulse border-none" />
        <RoundedCard className="w-full bg-slate-200 h-16 animate-pulse border-none" />
      </div>
    );
  }

  return (
    <Fragment>
      {upcomingGames && <GroupedFixturesList fixtures={upcomingGames} />}

      {upcomingGames.length === 0 && (
        <NoContentCard message={`There are no upcoming games for ${round.title}`} />
      )}
    </Fragment>
  );
}
