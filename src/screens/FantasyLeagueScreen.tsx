import { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader, Trophy } from 'lucide-react';
import { leagueService } from '../services/leagueService';
import { fantasyTeamService } from '../services/fantasyTeamService';
import { gamesService } from '../services/gamesService';
import { IFantasyLeague } from '../types/fantasyLeague';
// Using any as a temporary solution since the actual type definition is missing
type IGame = any;

import { leaguesOnClockFilter } from '../utils/leaguesUtils';
import JoinLeagueDeadlineCountdown from '../components/leagues/JoinLeagueDeadlineContdown';
// Removed Upcoming/Past sections in favor of a single Joined Leagues list
import JoinLeagueActiveLeaguesSection from '../components/leagues/join_league_screen/JoinLeagueActiveLeaguesSection';
import { useFetch } from '../hooks/useFetch';
import LeagueTabs from '../components/leagues/LeagueTabs';
import JoinLeagueByCode from '../components/leagues/JoinLeagueByCode';
import LeagueFilterPanel, {
  type CreatorType,
  type AccessType,
  type DateOrder,
} from '../components/leagues/LeagueFilterPanel';
import { useNavigate } from 'react-router-dom';
import FantasyLeagueScreenCTA from '../components/leagues/join_league_screen/LeagueScreenCTA';
import MyLeaguesTab from '../components/leagues/join_league_screen/MyLeaguesTab';
import DiscorverLeaguesTab from '../components/leagues/join_league_screen/DiscorverLeaguesTab';

export function FantasyLeaguesScreen() {
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
    mutate: refreshLeagues,
  } = useFetch('fantasy-leagues', [], () => leagueService.getAllLeagues());

  const leagues = leaguesData ?? [];

  console.log('leagues join: ', leagues);

  // Local cache of joined leagues that aren't returned by the general leagues list
  const [extraJoinedLeagues, setExtraJoinedLeagues] = useState<IFantasyLeague[]>([]);

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
        const joinedLeagueIds = new Set<string>(
          teams
            .filter(team => team.league_id) // Filter out teams without a league_id
            .map(team => team.league_id.toString())
        );

        console.log('joined league ids: ', joinedLeagueIds);

        // Create a mapping of league IDs to whether the user has joined
        const joinedLeagues = leagues.reduce(
          (acc, league) => {
            const idStr = String(league.id);
            acc[idStr] = joinedLeagueIds.has(idStr);
            return acc;
          },
          {} as Record<string, boolean>
        );

        console.log('joined leagues: ', joinedLeagues);

        setUserTeams(joinedLeagues);

        // Ensure we also display leagues the user joined that may not be in `leagues`
        const knownIds = new Set<string>(leagues.map(l => String(l.id)));
        const missingIds = Array.from(joinedLeagueIds).filter(id => !knownIds.has(id));

        if (missingIds.length > 0) {
          try {
            const fetched = await Promise.all(
              missingIds.map(async id => await leagueService.getLeagueById(Number(id)))
            );
            setExtraJoinedLeagues(fetched.filter(Boolean) as IFantasyLeague[]);
          } catch (e) {
            console.warn('Failed fetching some joined leagues by id', e);
          }
        } else {
          setExtraJoinedLeagues([]);
        }
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

  const navigate = useNavigate();

  // Handle league click
  const handleLeagueClick = (league: IFantasyLeague) => {
    //console.log('league clicked: ', league);
    navigate(`/league/${league.id}`, { state: { league } });
  };

  // if (isLoadingUserTeams) {
  //   return <LoadingState />;
  // }

  // Derived lists
  const isLeagueJoined = useCallback(
    (leagueId: string | number) => !!userTeams[String(leagueId)],
    [userTeams]
  );
  const isLeagueEnded = useCallback(
    (league: IFantasyLeague) => String((league as any)?.status || '').toLowerCase() === 'ended',
    []
  );

  const isLeagueHidden = useCallback(
    (league: IFantasyLeague) => String((league as any)?.hidden || '').toLowerCase() === 'true',
    []
  );

  const joinedLeagues = useMemo(() => {
    const base = leagues.filter(
      l => isLeagueJoined(l.id) && !isLeagueEnded(l) && !isLeagueHidden(l)
    );
    // Merge extras, avoid duplicates by id
    const seen = new Set(base.map(l => String(l.id)));
    const extras = extraJoinedLeagues.filter(
      l => !seen.has(String(l.id)) && !isLeagueEnded(l) && !isLeagueHidden(l)
    );
    console.log('joined leagues: ', [...base, ...extras]);
    return [...base, ...extras];
  }, [leagues, isLeagueJoined, extraJoinedLeagues, isLeagueEnded, isLeagueHidden]);

  const discoverBase = useMemo(
    () => leagues.filter(l => !isLeagueJoined(l.id) && l.is_open),
    [leagues, isLeagueJoined]
  );

  const discoverLeagues = useMemo(() => {
    let list = [...discoverBase];
    // Access Type
    if (discoverFilters.access === 'public') list = list.filter(l => !l.is_private);
    if (discoverFilters.access === 'invite') list = list.filter(l => l.is_private);
    // Creator Type (best-effort: uses `type` when provided)
    if (discoverFilters.creator !== 'all') {
      list = list.filter(l =>
        (l as any).type
          ? (l as any).type === (discoverFilters.creator === 'scrummy' ? 'scrummy' : 'user')
          : true
      );
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
    <div className="container dark:text-white mx-auto px-4 sm:px-6 py-6 max-w-3xl">
      <div className="flex items-center mb-4 gap-2 sm:mb-6 justify-between">

        <div className='flex flex-row gap-2 items-center justify-center' >
          <Trophy className='dark:text-white' />
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white flex-1">Fantasy Leagues</h1>
        </div>

        <div>
          {/* <FantasyLeagueScreenCTA /> */}
        </div>
      </div>

      <LeagueTabs value={activeTab} onChange={setActiveTab} className="mb-4 sm:mb-6" />

      {/* {leagueOnTheClock && (
        <div className="mb-4 sm:mb-6">
          <JoinLeagueDeadlineCountdown league={leagueOnTheClock} onViewLeague={handleLeagueClick} />
        </div>
      )} */}

      {activeTab === 'my' && (
        <MyLeaguesTab />
      )}

      {activeTab === 'discover' && (
        <DiscorverLeaguesTab />
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
