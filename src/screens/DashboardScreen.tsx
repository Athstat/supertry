import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leagueService } from '../services/leagueService';
import { IFantasyLeague } from '../types/fantasyLeague';
import PageView from './PageView';
import MyWeekPanel from '../components/dashboard/MyWeekPanel';
import ActionList from '../components/dashboard/ActionList';
import UpcomingFixturesSection from '../components/dashboard/UpcomingFixturesSection';
import FeaturedPlayersCarousel from '../components/dashboard/FeaturedPlayersCarousel';
import ComparePlayersPanel from '../components/dashboard/ComparePlayersPanel';
import JoinWeeklyLeagueCard from '../components/dashboard/JoinWeeklyLeagueCard';

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
      console.error('Failed to fetch leagues:', err);
    } finally {
      setIsLoadingLeagues(false);
    }
  };

  return (
    <PageView className="flex flex-col space-y-6 p-4">
      <JoinWeeklyLeagueCard />
      {/* <ActionList /> */}
      <UpcomingFixturesSection />
      <FeaturedPlayersCarousel />
      <ComparePlayersPanel />
      <MyWeekPanel />
    </PageView>
  );
}
