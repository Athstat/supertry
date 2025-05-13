import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActiveLeaguesSection,
  HeroSection,
} from "../components/dashboard";
import { leagueService } from "../services/leagueService";
import { IFantasyLeague } from "../types/fantasyLeague";

export function DashboardScreen() {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState<IFantasyLeague[]>([]);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(true);

  // Fetch user's teams and leagues
  useEffect(() => {
    fetchLeagues();
  }, []);

  // Fetch available leagues
  const fetchLeagues = async () => {
    try {
      setIsLoadingLeagues(true);
      const allLeagues = await leagueService.getAllLeagues();

      // Filter leagues based on is_open status (same as JoinLeagueScreen)
      const availableLeagues = allLeagues.filter(
        (league) => {
          const hasLeagueEnded = league.is_open && !league.has_ended;
          return hasLeagueEnded;
        }
      );
      
      setLeagues(availableLeagues);
    } catch (err) {
      console.error("Failed to fetch leagues:", err);
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
    <main className="flex flex-col mx-auto px-4 py-6 lg:px-[15%]">
      
      {/* Hero Section */}
      
      <HeroSection 
        availableLeagues={leagues}
        onViewLeague={handleViewLeague} 
      />

      {/* Dashboard Grid */}
      <div className="grid gap-6">
        {/* Active Leagues Section */}
          <ActiveLeaguesSection
            leagues={leagues}
            isLoading={isLoadingLeagues}
            onViewLeague={handleViewLeague}
          />
      </div>

    </main>
  );
}

