import { useState, useCallback, useMemo, Fragment, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAthletes } from '../contexts/AthleteContext';
import { useDebounced } from '../hooks/useDebounced';

// Components
import FloatingSearchBar from '../components/players/ui/FloatingSearchBar';
import GlassBottomSheet from '../components/ui/GlassBottomSheet';
import { PlayerFilters } from '../components/players/PlayerFilters';
import { PlayerSort } from '../components/players/PlayerSort';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/players/EmptyState';
import { PlayerGameCard } from '../components/player/PlayerGameCard';
import PageView from './PageView';
import { Users, X } from 'lucide-react';
import PlayersScreenCompareStatus from '../components/players/compare/PlayersScreenCompareStatus';
import PlayerCompareModal from '../components/players/compare/PlayerCompareModal';
import PlayerProfileModal from '../components/player/PlayerProfileModal';
import { SortDirection, SortField } from '../types/playerSorting';
import { IProAthlete } from '../types/athletes';
import { IProTeam } from '../types/team';
import TeamLogo from '../components/team/TeamLogo';
import RoundedCard from '../components/shared/RoundedCard';
import SecondaryText from '../components/shared/SecondaryText';
import { useQueryState } from '../hooks/useQueryState';
import useAthleteFilter from '../hooks/useAthleteFilter';
import PlayerCompareProvider from '../components/players/compare/PlayerCompareProvider';
import { usePlayerCompareActions } from '../hooks/usePlayerCompare';
import { useAtomValue } from 'jotai';
import { comparePlayersAtomGroup } from '../state/comparePlayers.atoms';
import { useInView } from 'react-intersection-observer';
import PlayersCompareButton from '../components/player/PlayerScreenCompareButton';
import { twMerge } from 'tailwind-merge';
import useSWR from 'swr';
import { seasonService } from '../services/seasonsService';
import { getAthletesSummary } from '../utils/athleteUtils';

// Fantasy seasons: mirror FantasyLeaguesScreen behavior
import FantasyLeaguesScreenDataProvider from '../components/fantasy-leagues/FantasyLeaguesScreenDataProvider';
import PlayersSeasonSelector from '../components/fantasy-seasons/PlayersSeasonSelector';
import { useFantasyLeaguesScreen } from '../hooks/fantasy/useFantasyLeaguesScreen';

export function PlayersScreen() {
  return (
    <PlayerCompareProvider>
      <FantasyLeaguesScreenDataProvider>
        <PlayerScreenContent />
      </FantasyLeaguesScreenDataProvider>
    </PlayerCompareProvider>
  );
}

export const PlayerScreenContent = () => {
  const { athletes, error, isLoading, refreshAthletes } = useAthletes();
  const [params, setParams] = useSearchParams();

  // Use the same selected fantasy season as FantasyLeaguesScreen
  const { selectedSeason, selectedFantasySeasonId } = useFantasyLeaguesScreen();

  //console.log('selectedSeason', selectedSeason);

  const activeSeasonIdForFetch = useMemo(() => {
    // if (selectedSeason?.id) return selectedSeason.id;
    // if (selectedFantasySeasonId && selectedFantasySeasonId !== 'all')
    //   return selectedFantasySeasonId;
    return '9e74bed3-9ea2-5f41-a906-434d0d3e8f4e';
  }, [selectedSeason?.id, selectedFantasySeasonId]);

  console.log('activeSeasonIdForFetch', activeSeasonIdForFetch);

  // Fetch players for the selected season when a season is chosen (Overview uses context athletes)
  const {
    data: seasonPlayers,
    isLoading: loadingSeason,
    error: errorSeason,
    mutate: mutateSeason,
  } = useSWR(
    activeSeasonIdForFetch ? `seasons/${activeSeasonIdForFetch}/athletes` : null,
    () => seasonService.getSeasonAthletes(activeSeasonIdForFetch!),
    { revalidateOnFocus: false, dedupingInterval: 5 * 60 * 1000, keepPreviousData: true }
  );

  // Choose dataset by selection
  const displayedAthletes: IProAthlete[] = useMemo(() => {
    if (activeSeasonIdForFetch) return (seasonPlayers as unknown as IProAthlete[]) ?? [];
    return athletes;
  }, [activeSeasonIdForFetch, athletes, seasonPlayers]);

  // Derive available teams/positions from the displayed dataset
  const { teams: availableTeams, positions: availablePositions } = useMemo(() => {
    return getAthletesSummary(displayedAthletes);
  }, [displayedAthletes]);

  // Active loading/error helpers and retry
  const activeIsLoading = activeSeasonIdForFetch ? loadingSeason : isLoading;
  const activeError: any = activeSeasonIdForFetch ? errorSeason : error;
  const activeErrorMessage = activeError
    ? typeof activeError === 'string'
      ? activeError
      : 'Failed to load players'
    : null;

  const retryActive = () => {
    if (activeSeasonIdForFetch) mutateSeason();
    else refreshAthletes();
  };

  const [sortField, setSortField] = useState<SortField>('power_rank_rating');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [searchQuery, setSearchQuery] = useQueryState<string>('query', { init: '' });
  const [positionFilter, setPositionFilter] = useQueryState<string | undefined>('position');

  const [teamIdFilter, setTeamIdFilter] = useQueryState<string | undefined>('team_id');
  const selectedTeam = availableTeams.find(t => t.athstat_id === teamIdFilter);

  // Ensure team filter remains valid when dataset changes
  useEffect(() => {
    if (teamIdFilter && !availableTeams.some(t => t.athstat_id === teamIdFilter)) {
      setTeamIdFilter('');
    }
  }, [availableTeams, teamIdFilter]);

  // Use debounced search for better performance
  const debouncedSearchQuery = useDebounced(searchQuery, 300);

  const selectedPositions: string[] = useMemo(() => {
    return positionFilter ? [positionFilter] : [];
  }, [positionFilter]);

  const selectedTeamIds: string[] = useMemo(() => {
    return selectedTeam ? [selectedTeam.athstat_id] : [];
  }, [selectedTeam]);

  // Use optimized filtering hook
  const { filteredAthletes, isFiltering } = useAthleteFilter({
    athletes: displayedAthletes,
    searchQuery: debouncedSearchQuery,
    selectedPositions: selectedPositions,
    selectedTeamIds: selectedTeamIds,
    sortField,
    sortDirection,
  });

  const [controlsOpen, setControlsOpen] = useState(false);

  const isEmpty = !activeIsLoading && !isFiltering && filteredAthletes.length === 0;

  const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete>();
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const handleClosePlayerModal = () => {
    setPlayerModalPlayer(undefined);
    setShowPlayerModal(false);
  };

  const isPickingPlayers = useAtomValue(comparePlayersAtomGroup.isCompareModePicking);

  const { addOrRemovePlayer, startPicking, showCompareModal } = usePlayerCompareActions();

  // Handle player selection with useCallback for better performance
  const handlePlayerClick = useCallback(
    (player: IProAthlete) => {
      if (isPickingPlayers) {
        addOrRemovePlayer(player);
      } else {
        setPlayerModalPlayer(player);
        setShowPlayerModal(true);
      }
    },
    [isPickingPlayers]
  );

  // Handle search filtering
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle sorting by field and direction
  const handleSortByField = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Handle position filter change
  const handlePositionFilter = (position: string) => {
    setPositionFilter(position === positionFilter ? '' : position);
  };

  // Handle team filter change
  const handleTeamFilter = (team: IProTeam) => {
    setTeamIdFilter(team.athstat_id);
  };

  // Clear all filters (batch in a single URLSearchParams update)
  const clearFilters = () => {
    const next = new URLSearchParams(params);
    next.delete('position');
    next.delete('team_id');
    next.delete('query');
    setParams(next, { replace: true });
  };

  return (
    <Fragment>
      <PageView className="px-5 flex flex-col items-center justify-center gap-3 md:w-[80%] lg:w-[60%] pb-28 md:pb-32">
        {/* Search and Filter Header */}
        <div className="flex flex-row gap-2 items-center w-full">
          <Users />
          <h1 className="text-2xl font-bold">Players</h1>
        </div>

        {/* Fantasy Season Tabs - identical to Fantasy Leagues */}
        {/* <div className="sticky top-16 z-40 w-full -mx-5 py-2 bg-transparent border-b-0 overflow-visible">
          <PlayersSeasonSelector />
        </div> */}

        {/* <PlayersCompareButton
          className={twMerge(isPickingPlayers && 'bg-gradient-to-r from-primary-600 to-blue-700')}
        /> */}

        {<PlayersScreenCompareStatus />}

        {/* Selected Team Section */}
        <div>
          {selectedTeam && (
            <RoundedCard className="flex w-fit px-2 py-0.5 dark:bg-slate-800 flex-row items-center gap-2">
              <TeamLogo
                teamName={selectedTeam.athstat_name}
                url={selectedTeam.image_url}
                className="w-5 h-5"
              />

              <p>{selectedTeam.athstat_name}</p>

              <button onClick={() => setTeamIdFilter('')}>
                <SecondaryText>
                  {' '}
                  <X className="w-4 h-4" />{' '}
                </SecondaryText>
              </button>
            </RoundedCard>
          )}
        </div>

        {/* Loading State - for initial load */}
        {activeIsLoading && <LoadingState message="Loading..." />}

        {/* Filtering Loading State */}
        {isFiltering && !activeIsLoading && <LoadingState message="Searching..." />}

        {/* Error State */}
        {activeErrorMessage && !activeIsLoading && !isFiltering && (
          <ErrorState message={activeErrorMessage} onRetry={retryActive} />
        )}

        {/* Empty State */}
        {isEmpty && <EmptyState searchQuery={searchQuery} onClearSearch={() => handleSearch('')} />}

        {/* Player Grid */}
        {!activeIsLoading && !activeError && !isFiltering && (
          <div
            data-player-grid
            className="grid items-center justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-2 md:gap-y-3"
          >
            {filteredAthletes.map(player => (
              <PlayerCardItem
                player={player}
                onClick={() => handlePlayerClick(player)}
                key={player.tracking_id}
              />
            ))}
          </div>
        )}

        <PlayerCompareModal />

        {playerModalPlayer && (
          <PlayerProfileModal
            onClose={handleClosePlayerModal}
            player={playerModalPlayer}
            isOpen={playerModalPlayer !== undefined && showPlayerModal}
          />
        )}
      </PageView>

      <FloatingSearchBar
        value={searchQuery ?? ''}
        onChange={handleSearch}
        onOpenControls={() => setControlsOpen(true)}
        onOpenCompare={() => (isPickingPlayers ? showCompareModal() : startPicking())}
        isComparePicking={isPickingPlayers}
      />

      <GlassBottomSheet isOpen={controlsOpen} onClose={() => setControlsOpen(false)}>
        <div className="space-y-4">
          <PlayerFilters
            variant="inline"
            positionFilter={positionFilter ?? ''}
            teamFilter={selectedTeam}
            availablePositions={availablePositions}
            availableTeams={availableTeams}
            onPositionFilter={handlePositionFilter}
            onTeamFilter={handleTeamFilter}
            onClearFilters={clearFilters}
          />

          <PlayerSort
            variant="inline"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSortByField}
          />
        </div>
      </GlassBottomSheet>
    </Fragment>
  );
};

type ItemProps = {
  player: IProAthlete;
  onClick: () => void;
};

function PlayerCardItem({ player, onClick }: ItemProps) {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div ref={ref} data-player-card>
      {inView && (
        <PlayerGameCard
          key={player.tracking_id}
          player={player}
          onClick={onClick}
          className=""
          // Players screen specific spacing tweaks
          priceClassName="top-14 left-5"
          teamLogoClassName="top-7 right-2"
          detailsClassName="px-6 pb-10"
        />
      )}
    </div>
  );
}
