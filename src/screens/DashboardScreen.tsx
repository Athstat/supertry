import PageView from './PageView';
import UpcomingFixturesSection from '../components/dashboard/UpcomingFixturesSection';
import FeaturedPlayersCarousel from '../components/dashboard/FeaturedPlayersCarousel';
import ComparePlayersPanel from '../components/dashboard/ComparePlayersPanel';
import { Home } from 'lucide-react';
import HeroImageBanner from '../components/dashboard/HeroImageBanner';
import { useNavigate } from 'react-router-dom';
import MyWeekPanel from '../components/dashboard/MyWeekPanel';
import FeaturedFantasyLeagueGroups from './FeaturedFantasyLeagueGroups';

export function DashboardScreen() {
  const navigate = useNavigate();

  const handleBannerClick = () => {
    navigate('/leagues');
  };

  return (
    <PageView className="flex flex-col space-y-6 p-4">
      <div className="flex flex-row items-center gap-2">
        <Home />
        <p className="text-xl font-extrabold">Dashboard</p>
      </div>

      {/* <HeroSection /> */}

      <HeroImageBanner link={'/images/wwc_2025_banner.jpg'} onClick={handleBannerClick} />

      {/* <FeaturedPlayersCarousel /> */}

      <FeaturedFantasyLeagueGroups />

      {/* <ActionList /> */}
      <UpcomingFixturesSection />
      <ComparePlayersPanel />
      <MyWeekPanel />
      {/* <MyTeamsSection /> */}
    </PageView>
  );
}
