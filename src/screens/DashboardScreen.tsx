import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActiveLeaguesSection } from "../components/dashboard";
import { leagueService } from "../services/leagueService";
import { IFantasyLeague } from "../types/fantasyLeague";
import PageView from "./PageView";
import { Home } from "lucide-react";
import DiscoverPlayersCard from "../components/dashboard/DiscoverPlayersCard";
import UpcomingFixturesSection from "../components/dashboard/UpcomingFixturesSection";

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
      const availableLeagues = allLeagues;

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
    <PageView className="flex flex-col space-y-6 p-4">


      <div className="flex flex-row items-center gap-2" >
        <Home />
        <h1 className="font-bold text-2xl" >Home</h1>
      </div>

      <DiscoverPlayersCard />

      {/* <HeroSection 
        availableLeagues={leagues}
        onViewLeague={handleViewLeague} 
      /> */}
      
      <ActiveLeaguesSection
        leagues={leagues}
        isLoading={isLoadingLeagues}
        onViewLeague={handleViewLeague}
      />


      <UpcomingFixturesSection />

    </PageView>
  );
}
