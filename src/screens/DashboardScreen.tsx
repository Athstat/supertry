import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MyTeamsSection,
  ActiveLeaguesSection,
  HeroSection,
} from "../components/dashboard";
import { teamService } from "../services/teamService";
import { leagueService } from "../services/leagueService";
import {
  IFantasyClubTeam,
  IFantasyTeamAthlete,
} from "../types/fantasyTeamAthlete";
import { IFantasyLeague } from "../types/fantasyLeague";

export function DashboardScreen() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<IFantasyClubTeam[]>([]);
  const [teamsWithAthletes, setTeamsWithAthletes] = useState<
    Map<string, IFantasyTeamAthlete[]>
  >(new Map());
  const [leagues, setLeagues] = useState<IFantasyLeague[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's teams and leagues
  useEffect(() => {
    fetchUserTeams();
    fetchLeagues();
  }, []);

  // Fetch user's teams
  const fetchUserTeams = async () => {
    try {
      setIsLoadingTeams(true);
      // Get teams directly using fetchUserTeams with default league ID
      const defaultLeagueId = "d313fbf5-c721-569b-975d-d9ec242a6f19"; // Default league ID
      let userTeams = await teamService.fetchUserTeams(defaultLeagueId);
      // Sort teams by creation date (newest first)
      const sortedTeams = [...userTeams].sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

      // Use the sorted teams instead of the original array
      userTeams = sortedTeams;

      setTeams(userTeams);

      // Fetch athletes for each team
      const athletesMap = new Map<string, IFantasyTeamAthlete[]>();

      for (const team of userTeams) {
        const athletes = await teamService.fetchTeamAthletes(team.id);
        athletesMap.set(team.id, athletes);
      }

      setTeamsWithAthletes(athletesMap);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
      setError("Failed to load your teams. Please try again later.");
    } finally {
      setIsLoadingTeams(false);
    }
  };

  // Fetch available leagues
  const fetchLeagues = async () => {
    try {
      setIsLoadingLeagues(true);
      const allLeagues = await leagueService.getAllLeagues();

      // Filter leagues based on is_open status (same as JoinLeagueScreen)
      const availableLeagues = allLeagues.filter(
        (league) => league.is_open && !league.has_ended
      );
      console.log("availableLeagues", availableLeagues);
      setLeagues(availableLeagues);
    } catch (err) {
      console.error("Failed to fetch leagues:", err);
      setError("Failed to load leagues. Please try again later.");
    } finally {
      setIsLoadingLeagues(false);
    }
  };

  const handleViewLeague = (league: IFantasyLeague) => {
    navigate(`/league/${league.official_league_id}`, {
      state: { league },
    });
  };

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <HeroSection />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Teams Section */}
        <div className="col-span-1 lg:col-span-2">
          <MyTeamsSection
            teams={teams}
            teamsWithAthletes={teamsWithAthletes}
            isLoading={isLoadingTeams}
            error={error}
          />
        </div>

        {/* Active Leagues Section */}
        <div className="col-span-1">
          <ActiveLeaguesSection
            leagues={leagues}
            isLoading={isLoadingLeagues}
            onViewLeague={handleViewLeague}
          />
        </div>
      </div>
    </main>
  );
}
