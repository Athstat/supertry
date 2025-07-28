import { useNavigate } from 'react-router-dom';
import PageView from './PageView';
import MyWeekPanel from '../components/dashboard/MyWeekPanel';
import UpcomingFixturesSection from '../components/dashboard/UpcomingFixturesSection';
import FeaturedPlayersCarousel from '../components/dashboard/FeaturedPlayersCarousel';
import ComparePlayersPanel from '../components/dashboard/ComparePlayersPanel';
import { HeroImageBanner } from '../components/dashboard/JoinWeeklyLeagueCard';
import SecondaryText from '../components/shared/SecondaryText';

export function DashboardScreen() {
  const navigate = useNavigate();

  const goToFixtures = () => {
    navigate('/fixtures');
  }

  return (
    <PageView className="flex flex-col space-y-6 p-4">

      {/* <ActionList /> */}
      <UpcomingFixturesSection />
      <FeaturedPlayersCarousel />
      <ComparePlayersPanel />
      <MyWeekPanel />
    </PageView>
  );
}
