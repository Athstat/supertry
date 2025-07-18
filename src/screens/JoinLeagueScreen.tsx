import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { leagueService } from "../services/leagueService";
import { fantasyTeamService } from "../services/fantasyTeamService";
import { IFantasyLeague } from "../types/fantasyLeague";

import { leaguesOnClockFilter } from "../utils/leaguesUtils";
import JoinLeagueDeadlineCountdown from "../components/leagues/JoinLeagueDeadlineContdown";
import JoinLeagueActiveLeaguesSection from "../components/leagues/join_league_screen/JoinLeagueActiveLeaguesSection";
import JoinLeaguePastLeaguesSection from "../components/leagues/join_league_screen/JoinLeaguePastLeaguesSection";
import JoinLeagueUpcomingLeaguesSection from "../components/leagues/join_league_screen/JoinLeagueUpcomingLeaguesSection";
import { useFetch } from "../hooks/useFetch";
import { LoadingState } from "../components/ui/LoadingState";

export function JoinLeagueScreen() {
  const navigate = useNavigate();
  const {data, isLoading, error} = useFetch("fantasy-leagues", [], () => leagueService.getAllLeagues());

  const leagues = data ?? [];

  const [userTeams, setUserTeams] = useState<Record<string, boolean>>({});
  const [isLoadingUserTeams, setIsLoadingUserTeams] = useState(false);

  const {firstLeagueOnClock: leagueOnTheClock} = leaguesOnClockFilter(leagues);

  // Fetch user's teams to check which leagues they've joined
  useEffect(() => {
    const fetchUserTeams = async () => {
      if (leagues.length === 0) return;

      setIsLoadingUserTeams(true);
      const joinedLeagues: Record<string, boolean> = {};

      try {
        // Fetch all teams for the user
        const teams = await fantasyTeamService.fetchUserTeams();

        // Map of joined league IDs
        leagues.forEach((league) => {
          // Check if any team's league_id matches the current league's id
          const hasJoined = teams.some((team) => team.league_id?.toString() === league.id);
          joinedLeagues[league.id] = hasJoined;
        });

        setUserTeams(joinedLeagues);
      } catch (error) {
        console.error("Failed to fetch user teams:", error);
      } finally {
        setIsLoadingUserTeams(false);
      }
    };

    fetchUserTeams();
  }, [leagues]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle league click
  const handleLeagueClick = (league: IFantasyLeague) => {
    navigate(`/league/${league.official_league_id}`, {
      state: { league },
    });
  };

  if (isLoadingUserTeams) {
    return <LoadingState />
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
          Leagues
        </h1>
      </div>

      {leagueOnTheClock && <JoinLeagueDeadlineCountdown league={leagueOnTheClock} onViewLeague={handleLeagueClick} />}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 text-primary-500 animate-spin" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading available leagues...
          </span>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      ) : leagues.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">
            No leagues available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for new leagues
          </p>
        </div>
      ) : (
        <>
          {!isLoading &&
            <JoinLeagueActiveLeaguesSection
              leagues={leagues}
              userTeams={userTeams}
            />
          }
        </>
      )}

      {!isLoading &&
        <JoinLeagueUpcomingLeaguesSection
          leagues={leagues}
          userTeams={userTeams}
        />
      }

      {!isLoading &&
        <JoinLeaguePastLeaguesSection
          leagues={leagues}
          userTeams={userTeams}
        />
      }

    </div>

  );
}

