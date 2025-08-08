import { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader } from 'lucide-react';
import { leagueService } from '../services/leagueService';
import { fantasyTeamService } from '../services/fantasyTeamService';
import { gamesService } from '../services/gamesService';
import { IFantasyLeague } from '../types/fantasyLeague';
// Using any as a temporary solution since the actual type definition is missing
type IGame = any;

import { leaguesOnClockFilter } from '../utils/leaguesUtils';
import JoinLeagueDeadlineCountdown from '../components/leagues/JoinLeagueDeadlineContdown';
import JoinLeagueActiveLeaguesSection from '../components/leagues/join_league_screen/JoinLeagueActiveLeaguesSection';
import JoinLeaguePastLeaguesSection from '../components/leagues/join_league_screen/JoinLeaguePastLeaguesSection';
import JoinLeagueUpcomingLeaguesSection from '../components/leagues/join_league_screen/JoinLeagueUpcomingLeaguesSection';
import UserCreatedLeaguesSection from '../components/leagues/UserCreatedLeaguesSection';
import { useFetch } from '../hooks/useFetch';
import LeagueTabs from '../components/leagues/LeagueTabs';
import JoinLeagueByCode from '../components/leagues/JoinLeagueByCode';
import LeagueFilterPanel, { type CreatorType, type AccessType, type DateOrder } from '../components/leagues/LeagueFilterPanel';

export function JoinLeagueScreen() {
  // Tabs state (persist between visits)
  const [activeTab, setActiveTab] = useState<'my' | 'discover' | 'code'>(() => {
    const saved = localStorage.getItem('league_tab');
    return (saved as 'my' | 'discover' | 'code') || 'my';
  });

  useEffect(() => {
    localStorage.setItem('league_tab', activeTab);
  }, [activeTab]);

  // Fetch all leagues
  const {
    data: leaguesData,
    isLoading,
    error,
    mutate: refreshLeagues
  } = useFetch('fantasy-leagues', [], () => leagueService.getAllLeagues());

  const leagues = leaguesData ?? [];

  // Get unique competition IDs from all leagues - create a stable string key
  const competitionIdsKey = useMemo(() => {
    const ids = new Set<string>();
    leagues.forEach(league => {
      if (league.official_league_id) {
        ids.add(league.official_league_id);
      }
    });
    return Array.from(ids).sort().join(','); // Create stable string key
  }, [leagues]);

  // Fetch games for all competitions
  const { data: allGames } = useFetch('all-games', competitionIdsKey, async (key: string) => {
    if (!key) return {};
    const ids = key.split(',').filter(Boolean);
    const games: Record<string, IGame[]> = {};
    for (const id of ids) {
      try {
        const competitionGames = await gamesService.getGamesByCompetitionId(id);
        games[id] = competitionGames;
      } catch (error) {
        console.error(`Failed to fetch games for competition ${id}:`, error);
        games[id] = [];
      }
    }
    return games;
  });

  // Get games for a specific competition
  const getGamesByCompetitionId = (competitionId: string): IGame[] => {
    return allGames?.[competitionId] ?? [];
  };

  const [userTeams, setUserTeams] = useState<Record<string, boolean>>({});

  const { firstLeagueOnClock: leagueOnTheClock } = leaguesOnClockFilter(leagues);

  // My tab pill filters
  const [showCreatedByMe, setShowCreatedByMe] = useState(true);
  const [showJoined, setShowJoined] = useState(true);

  // Discover filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [discoverFilters, setDiscoverFilters] = useState<{
    creator: CreatorType;
    access: AccessType;
    date: DateOrder;
  }>({ creator: 'all', access: 'all', date: 'recent' });

  // Fetch user's teams to check which leagues they've joined
  useEffect(() => {
    const fetchUserTeams = async () => {
      if (leagues.length === 0) return;

      try {
        // Fetch all teams for the user in a single API call
        const teams = await fantasyTeamService.fetchUserTeams();

        // Create a Set of league IDs that the user has joined for O(1) lookups
        const joinedLeagueIds = new Set(
          teams
            .filter(team => team.league_id) // Filter out teams without a league_id
            .map(team => team.league_id.toString())
        );

        // Create a mapping of league IDs to whether the user has joined
        const joinedLeagues = leagues.reduce(
          (acc, league) => {
            acc[league.id] = joinedLeagueIds.has(league.id);
            return acc;
          },
          {} as Record<string, boolean>
        );

        setUserTeams(joinedLeagues);
      } catch (error) {
        console.error('Error fetching user teams:', error);
      }
    };

    // Add a small debounce to prevent rapid calls if leagues changes frequently
    const timeoutId = setTimeout(fetchUserTeams, 100);
    return () => clearTimeout(timeoutId);
  }, [leagues]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to refresh all leagues data
  const refreshAllLeagues = useCallback(() => {
    refreshLeagues();
  }, [refreshLeagues]);

  // Handle league click
  const handleLeagueClick = (league: IFantasyLeague) => {
    console.log('league clicked: ', league);
    // navigate(`/league/${league.official_league_id}`, {
    //   state: { league },
    // });
  };

  // if (isLoadingUserTeams) {
  //   return <LoadingState />;
  // }

  // Derived lists
  const joinedLeagues = useMemo(
    () => leagues.filter(l => userTeams[l.id]),
    [leagues, userTeams]
  );
  const discoverBase = useMemo(
    () => leagues.filter(l => !userTeams[l.id] && l.is_open),
    [leagues, userTeams]
  );

  const discoverLeagues = useMemo(() => {
    let list = [...discoverBase];
    // Access Type
    if (discoverFilters.access === 'public') list = list.filter(l => !l.is_private);
    if (discoverFilters.access === 'invite') list = list.filter(l => l.is_private);
    // Creator Type (best-effort: uses `type` when provided)
    if (discoverFilters.creator !== 'all') {
      list = list.filter(l => (l as any).type ? (l as any).type === (discoverFilters.creator === 'scrummy' ? 'scrummy' : 'user') : true);
    }
    // Date order
    list.sort((a, b) => {
      const aDate = new Date(a.created_date).getTime();
      const bDate = new Date(b.created_date).getTime();
      return discoverFilters.date === 'recent' ? bDate - aDate : aDate - bDate;
    });
    return list;
  }, [discoverBase, discoverFilters]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-3xl">
      <div className="flex items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-white flex-1">Leagues</h1>
      </div>

      <LeagueTabs value={activeTab} onChange={setActiveTab} className="mb-4 sm:mb-6" />

      {leagueOnTheClock && (
        <div className="mb-4 sm:mb-6">
          <JoinLeagueDeadlineCountdown league={leagueOnTheClock} onViewLeague={handleLeagueClick} />
        </div>
      )}

      {activeTab === 'my' && (
        <div className="space-y-6">
          {/* Filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCreatedByMe(v => !v)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                showCreatedByMe
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'
              }`}
            >
              Created By Me
            </button>
            <button
              onClick={() => setShowJoined(v => !v)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                showJoined
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'
              }`}
            >
              Joined
            </button>
          </div>

          {showCreatedByMe && (
            <div className="mt-2">
              <UserCreatedLeaguesSection onLeagueCreated={refreshAllLeagues} />
            </div>
          )}

          {showJoined && (
            <>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="w-8 h-8 text-primary-500 animate-spin" />
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your leagues...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg text-center">
                  <p className="mb-4">{error}</p>
                  <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200">Try Again</button>
                </div>
              ) : (
                <>
                  <JoinLeagueActiveLeaguesSection
                    leagues={joinedLeagues}
                    userTeams={userTeams}
                    getGamesByCompetitionId={getGamesByCompetitionId}
                  />
                  <JoinLeagueUpcomingLeaguesSection
                    leagues={joinedLeagues}
                    userTeams={userTeams}
                    getGamesByCompetitionId={getGamesByCompetitionId}
                  />
                  <JoinLeaguePastLeaguesSection
                    leagues={joinedLeagues}
                    userTeams={userTeams}
                    getGamesByCompetitionId={getGamesByCompetitionId}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'discover' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Discover Public Leagues</h2>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              Filters
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 text-primary-500 animate-spin" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading leagues...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg text-center">
              <p className="mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200">Try Again</button>
            </div>
          ) : discoverLeagues.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-base sm:text-lg font-medium mb-2 dark:text-gray-200">No leagues to discover</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <JoinLeagueActiveLeaguesSection
                leagues={discoverLeagues}
                userTeams={userTeams}
                getGamesByCompetitionId={getGamesByCompetitionId}
              />
            </>
          )}

          <LeagueFilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            value={discoverFilters}
            onChange={setDiscoverFilters}
          />
        </div>
      )}

      {activeTab === 'code' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Join by Code</h2>
          <JoinLeagueByCode onSuccess={refreshAllLeagues} />
        </div>
      )}
    </div>
  );
}
